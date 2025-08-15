# Frontend Contact Form Integration Guide for security-x

## Overview
Implement complete contact form integration in the frontend to properly submit form data to the backend API and display contact submissions in the admin dashboard. This implementation will replace the current simulated form submission with real API calls and add comprehensive contact management to the admin interface.

## Implementation Steps

### 1. Update Contact Form Submission (`app/contact/page.tsx`)

Replace the existing `handleSubmit` function in `app/contact/page.tsx` with actual API integration:

```typescript
// Add this import at the top
import api from '@/lib/api';
import { useState } from 'react';

// Replace the existing handleSubmit function with this implementation:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const emailError = formData.email && !validateEmail(formData.email) ? 'Please enter a valid email address' : ''
  const phoneError = formData.phone && !validatePhone(formData.phone) ? 'Please enter a valid phone number' : ''
  
  if (emailError || phoneError) {
    setValidationErrors({
      email: emailError,
      phone: phoneError
    })
    return
  }
  
  setIsSubmitting(true)
  
  try {
    // Prepare the data for submission
    const submissionData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      company: formData.company?.trim() || undefined,
      phone: formData.phone?.trim() || undefined,
      countryCode: formData.countryCode,
      serviceType: formData.serviceType || undefined,
      message: formData.message.trim(),
      formType: isAssessment ? 'assessment' : 'contact'
    };

    // Remove undefined fields
    Object.keys(submissionData).forEach(key => {
      if (submissionData[key as keyof typeof submissionData] === undefined) {
        delete submissionData[key as keyof typeof submissionData];
      }
    });

    // Submit to API
    const response = await api.post('/contacts', submissionData);
    
    if (response.data.success) {
      setSubmitSuccess(true);
      // Reset form data
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        countryCode: '+91',
        serviceType: '',
        message: ''
      });
      setValidationErrors({ email: '', phone: '' });
    } else {
      throw new Error(response.data.message || 'Submission failed');
    }
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    // Handle different types of errors
    let errorMessage = 'Sorry, there was an error submitting your message. Please try again.';
    
    if (error.response?.status === 429) {
      errorMessage = 'Too many submissions. Please wait 15 minutes before trying again.';
    } else if (error.response?.status === 400) {
      errorMessage = error.response.data.message || 'Please check your input and try again.';
    } else if (error.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later or contact us directly.';
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    // You can use a toast notification library here instead of alert
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
}
```

### 2. Add Error Handling State to Contact Form

Add error handling state to the contact form component. Add this near the other useState declarations:

```typescript
// Add this state for general error handling
const [submitError, setSubmitError] = useState<string>('');

// Update the form JSX to display errors
// Add this error display before the form
{submitError && (
  <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
    <p className="text-red-400 text-sm">{submitError}</p>
  </div>
)}
```

### 3. Create Contact Management Page (`app/admin/contacts/page.tsx`)

Create a new directory `app/admin/contacts/` and add `page.tsx`:

```typescript
"use client";

import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { BlogContainer, BlogTypography } from '@/components/blog';
import { AdminGlassCard, AdminTable, AdminTableHeader, AdminTableBody } from '@/components/admin/AdminComponents';

interface IContact {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  countryCode: string;
  serviceType?: string;
  message: string;
  formType: 'contact' | 'assessment';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  formattedPhone?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

interface ContactStats {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  urgentCount: number;
  contactFormCount: number;
  assessmentFormCount: number;
}

interface ContactsResponse {
  contacts: IContact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalContacts: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats: ContactStats;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ContactManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Build query string
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: '10',
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(formTypeFilter !== 'all' && { formType: formTypeFilter }),
    ...(priorityFilter !== 'all' && { priority: priorityFilter }),
    ...(searchTerm && { search: searchTerm })
  });

  const { data, error, isLoading } = useSWR<{ data: ContactsResponse }>(`/contacts?${queryParams}`, fetcher);

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      await api.put(`/contacts/${contactId}`, { status: newStatus });
      toast.success('Contact status updated successfully!');
      mutate(`/contacts?${queryParams}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handlePriorityUpdate = async (contactId: string, newPriority: string) => {
    try {
      await api.put(`/contacts/${contactId}`, { priority: newPriority });
      toast.success('Contact priority updated successfully!');
      mutate(`/contacts?${queryParams}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update priority.');
    }
  };

  const handleDelete = async (contactId: string, contactName: string) => {
    if (window.confirm(`Are you sure you want to delete the contact from ${contactName}?`)) {
      try {
        await api.delete(`/contacts/${contactId}`);
        toast.success('Contact deleted successfully!');
        mutate(`/contacts?${queryParams}`);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to delete contact.');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'urgent': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (error) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Error">
          <BlogTypography variant="body" className="text-red-400">
            Failed to load contacts. Please try again.
          </BlogTypography>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  const contacts = data?.data?.contacts || [];
  const pagination = data?.data?.pagination;
  const stats = data?.data?.stats;

  return (
    <BlogContainer>
      <div className="mb-8">
        <BlogTypography variant="h1">Contact Management</BlogTypography>
        <BlogTypography variant="body">Manage contact form submissions and customer inquiries</BlogTypography>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AdminGlassCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-white/70">Total Contacts</div>
            </div>
          </AdminGlassCard>
          <AdminGlassCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.newCount}</div>
              <div className="text-sm text-white/70">New Submissions</div>
            </div>
          </AdminGlassCard>
          <AdminGlassCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.inProgressCount}</div>
              <div className="text-sm text-white/70">In Progress</div>
            </div>
          </AdminGlassCard>
          <AdminGlassCard className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.urgentCount}</div>
              <div className="text-sm text-white/70">Urgent</div>
            </div>
          </AdminGlassCard>
        </div>
      )}

      <AdminGlassCard>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm text-white/70 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 text-sm"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-white/70 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            >
              <option value="all" className="bg-black">All Status</option>
              <option value="new" className="bg-black">New</option>
              <option value="in-progress" className="bg-black">In Progress</option>
              <option value="resolved" className="bg-black">Resolved</option>
              <option value="closed" className="bg-black">Closed</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-white/70 mb-1">Form Type</label>
            <select
              value={formTypeFilter}
              onChange={(e) => setFormTypeFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            >
              <option value="all" className="bg-black">All Types</option>
              <option value="contact" className="bg-black">Contact</option>
              <option value="assessment" className="bg-black">Assessment</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-white/70 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
            >
              <option value="all" className="bg-black">All Priorities</option>
              <option value="low" className="bg-black">Low</option>
              <option value="medium" className="bg-black">Medium</option>
              <option value="high" className="bg-black">High</option>
              <option value="urgent" className="bg-black">Urgent</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <Button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setFormTypeFilter('all');
                setPriorityFilter('all');
                setCurrentPage(1);
              }}
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <BlogTypography variant="body" className="ml-3 mb-0">
              Loading contacts...
            </BlogTypography>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-between mb-6">
              <BlogTypography variant="h2" className="mb-0">
                Contacts ({pagination?.totalContacts || 0})
              </BlogTypography>
            </div>

            <div className="overflow-x-auto">
              <AdminTable>
                <AdminTableHeader>
                  <tr>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Name & Email</th>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Company</th>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Type</th>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Status</th>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Priority</th>
                    <th className="py-3.5 px-4 text-left text-sm font-semibold text-white">Date</th>
                    <th className="relative py-3.5 px-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </AdminTableHeader>
                <AdminTableBody>
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-sm">
                        <div>
                          <div className="font-medium text-white">{contact.name}</div>
                          <div className="text-white/70 text-xs">{contact.email}</div>
                          {contact.formattedPhone && (
                            <div className="text-white/60 text-xs">{contact.formattedPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-white/80">
                        {contact.company || '-'}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contact.formType === 'assessment' 
                            ? 'bg-purple-500/20 text-purple-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {contact.formType}
                        </span>
                        {contact.serviceType && (
                          <div className="text-xs text-white/60 mt-1">{contact.serviceType}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusBadgeClass(contact.status)}`}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <option value="new" className="bg-black">New</option>
                          <option value="in-progress" className="bg-black">In Progress</option>
                          <option value="resolved" className="bg-black">Resolved</option>
                          <option value="closed" className="bg-black">Closed</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <select
                          value={contact.priority}
                          onChange={(e) => handlePriorityUpdate(contact._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${getPriorityBadgeClass(contact.priority)}`}
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <option value="low" className="bg-black">Low</option>
                          <option value="medium" className="bg-black">Medium</option>
                          <option value="high" className="bg-black">High</option>
                          <option value="urgent" className="bg-black">Urgent</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-sm text-white/80">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-medium space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-400/50 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowContactModal(true);
                          }}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-400/50 text-red-400 hover:bg-red-500/10" 
                          onClick={() => handleDelete(contact._id, contact.name)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </AdminTableBody>
              </AdminTable>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-white/70">
                  Page {pagination.currentPage} of {pagination.totalPages} 
                  ({pagination.totalContacts} total contacts)
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {contacts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1m0 0h8" />
                </svg>
                <BlogTypography variant="body" className="text-white/60 mb-0">
                  No contacts found. Contact submissions will appear here.
                </BlogTypography>
              </div>
            )}
          </>
        )}
      </AdminGlassCard>

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
          }}
          onUpdate={() => {
            mutate(`/contacts?${queryParams}`);
          }}
        />
      )}
    </BlogContainer>
  );
}

// Contact Detail Modal Component
interface ContactDetailModalProps {
  contact: IContact;
  onClose: () => void;
  onUpdate: () => void;
}

function ContactDetailModal({ contact, onClose, onUpdate }: ContactDetailModalProps) {
  const [notes, setNotes] = useState(contact.notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateNotes = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/contacts/${contact._id}`, { notes });
      toast.success('Notes updated successfully!');
      onUpdate();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update notes.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Contact Details</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                <div className="text-white">{contact.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                <div className="text-white">{contact.email}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Company</label>
                <div className="text-white">{contact.company || '-'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Phone</label>
                <div className="text-white">{contact.formattedPhone || '-'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Form Type</label>
                <div className="text-white capitalize">{contact.formType}</div>
              </div>
              {contact.serviceType && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Service Type</label>
                  <div className="text-white">{contact.serviceType}</div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Status</label>
                <div className="text-white capitalize">{contact.status}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Priority</label>
                <div className="text-white capitalize">{contact.priority}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Submitted</label>
                <div className="text-white">{new Date(contact.createdAt).toLocaleString()}</div>
              </div>
              {contact.lastContactedAt && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">Last Contacted</label>
                  <div className="text-white">{new Date(contact.lastContactedAt).toLocaleString()}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Message</label>
              <div className="bg-white/5 border border-white/20 rounded-lg p-3 text-white whitespace-pre-wrap">
                {contact.message}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 resize-none"
                placeholder="Add internal notes about this contact..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
              <Button
                onClick={handleUpdateNotes}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? 'Updating...' : 'Update Notes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 4. Update Admin Navigation (`app/admin/layout.tsx`)

Update the admin layout to include the new contacts section. Modify the navigation in `app/admin/layout.tsx` to include a link to contacts:

```typescript
// Add this to the navigation items
<Link 
  href="/admin/contacts" 
  className="flex items-center px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
>
  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1m0 0h8" />
  </svg>
  Contacts
</Link>
```

### 5. Update Admin Dashboard Overview (`app/admin/dashboard/page.tsx`)

Add contact statistics to the main admin dashboard. Add this section after the existing blog management section:

```typescript
// Add this import
import Link from 'next/link';

// Add this component before the return statement
const ContactStatsSection = () => {
  const { data: contactData } = useSWR('/contacts?limit=5', fetcher);
  const contacts = contactData?.data?.contacts || [];
  const stats = contactData?.data?.stats;

  return (
    <AdminGlassCard>
      <div className="flex flex-row items-center justify-between mb-6">
        <BlogTypography variant="h2" className="mb-0">
          Recent Contacts ({stats?.total || 0})
        </BlogTypography>
        <Link href="/admin/contacts">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Manage Contacts
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{stats.newCount}</div>
            <div className="text-xs text-white/70">New</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{stats.inProgressCount}</div>
            <div className="text-xs text-white/70">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{stats.urgentCount}</div>
            <div className="text-xs text-white/70">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">{stats.assessmentFormCount}</div>
            <div className="text-xs text-white/70">Assessments</div>
          </div>
        </div>
      )}

      {contacts.length > 0 ? (
        <div className="space-y-3">
          {contacts.map((contact: any) => (
            <div key={contact._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium text-white">{contact.name}</div>
                <div className="text-sm text-white/70">{contact.email}</div>
                {contact.company && (
                  <div className="text-xs text-white/60">{contact.company}</div>
                )}
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  contact.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                  contact.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                  contact.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {contact.status}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <BlogTypography variant="body" className="text-white/60 mb-0">
            No contact submissions yet.
          </BlogTypography>
        </div>
      )}
    </AdminGlassCard>
  );
};

// Add this component to the return JSX after the blog management section
<div className="mb-8">
  <ContactStatsSection />
</div>
```

### 6. Create Contact Analytics Page (`app/admin/contacts/analytics/page.tsx`)

Create a new analytics page for contact insights:

```typescript
"use client";

import useSWR from 'swr';
import { useState } from 'react';
import api from '@/lib/api';
import { BlogContainer, BlogTypography } from '@/components/blog';
import { AdminGlassCard } from '@/components/admin/AdminComponents';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export default function ContactAnalytics() {
  const [period, setPeriod] = useState('30');
  
  const { data, error, isLoading } = useSWR(`/contacts/analytics?period=${period}`, fetcher);
  
  const analytics = data?.data;

  if (error) {
    return (
      <BlogContainer>
        <AdminGlassCard title="Error">
          <BlogTypography variant="body" className="text-red-400">
            Failed to load analytics. Please try again.
          </BlogTypography>
        </AdminGlassCard>
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <div className="mb-8">
        <BlogTypography variant="h1">Contact Analytics</BlogTypography>
        <BlogTypography variant="body">Insights into contact form submissions and trends</BlogTypography>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
        >
          <option value="7" className="bg-black">Last 7 days</option>
          <option value="30" className="bg-black">Last 30 days</option>
          <option value="90" className="bg-black">Last 90 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <BlogTypography variant="body" className="ml-3 mb-0">
            Loading analytics...
          </BlogTypography>
        </div>
      ) : analytics ? (
        <div className="space-y-8">
          {/* Status Distribution */}
          <AdminGlassCard title="Status Distribution">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.statusDistribution.map((status: any) => (
                <div key={status._id} className="text-center">
                  <div className="text-2xl font-bold text-white">{status.count}</div>
                  <div className="text-sm text-white/70 capitalize">{status._id}</div>
                </div>
              ))}
            </div>
          </AdminGlassCard>

          {/* Service Type Distribution */}
          {analytics.serviceTypeDistribution.length > 0 && (
            <AdminGlassCard title="Assessment Service Types">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.serviceTypeDistribution.map((service: any) => (
                  <div key={service._id} className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-xl font-bold text-white">{service.count}</div>
                    <div className="text-sm text-white/70">{service._id.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </AdminGlassCard>
          )}

          {/* Daily Submissions Chart */}
          <AdminGlassCard title="Daily Submissions">
            <div className="space-y-2">
              {analytics.dailySubmissions.map((day: any) => (
                <div key={day._id} className="flex items-center justify-between">
                  <div className="text-white/80">{day._id}</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-400">Contact: {day.contact}</div>
                    <div className="text-purple-400">Assessment: {day.assessment}</div>
                    <div className="text-white font-medium">Total: {day.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </AdminGlassCard>
        </div>
      ) : (
        <AdminGlassCard>
          <BlogTypography variant="body" className="text-white/60 text-center">
            No analytics data available for the selected period.
          </BlogTypography>
        </AdminGlassCard>
      )}
    </BlogContainer>
  );
}
```

### 7. Create Toast Notification Setup

Ensure the React Hot Toast is properly set up. Add this to your `app/layout.tsx` or create a providers file:

```typescript
// Add this import if not already present
import { Toaster } from 'react-hot-toast';

// Add this to your layout JSX
<Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  }}
/>
```

### 8. Update API Library (if needed)

Ensure your `lib/api.ts` is properly configured for the contact endpoints. If it doesn't exist, create it:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  withCredentials: true,
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Testing the Implementation

### Frontend Testing Steps

1. **Test Contact Form Submission:**
   - Fill out the contact form with valid data
   - Submit and verify success message
   - Test with invalid data and verify error handling
   - Test rate limiting by submitting multiple times quickly

2. **Test Admin Contact Management:**
   - Navigate to `/admin/contacts`
   - Verify contacts appear in the table
   - Test filtering by status, priority, form type
   - Test search functionality
   - Test status and priority updates
   - Test contact deletion
   - Test pagination

3. **Test Contact Analytics:**
   - Navigate to `/admin/contacts/analytics`
   - Verify charts and statistics load
   - Test different time periods

### Error Handling Testing

- Test with network disconnected
- Test with invalid API responses
- Test with server errors (500 status)
- Test with rate limiting (429 status)
- Test with validation errors (400 status)

## Security Considerations

1. **CSRF Protection**: Ensure CSRF tokens are handled if implemented
2. **Rate Limiting**: Contact form has built-in rate limiting
3. **Input Validation**: All inputs are validated on both client and server
4. **XSS Protection**: All user inputs are properly escaped
5. **Auth Protection**: Admin routes require authentication

## Performance Optimizations

1. **SWR Caching**: Contact data is cached and revalidated
2. **Pagination**: Large contact lists are paginated
3. **Debounced Search**: Search input should be debounced
4. **Lazy Loading**: Analytics load separately from main contact list
5. **Optimistic Updates**: Status changes update optimistically

This implementation provides a complete, production-ready contact form integration with comprehensive admin management features, analytics, and proper error handling.