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
