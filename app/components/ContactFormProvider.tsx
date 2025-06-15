'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import ContactForm from './ContactForm'

interface ContactFormContextType {
  openContactForm: () => void
  openAssessmentForm: () => void
  closeForm: () => void
  isOpen: boolean
  formType: 'contact' | 'assessment'
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined)

export const useContactForm = () => {
  const context = useContext(ContactFormContext)
  if (context === undefined) {
    throw new Error('useContactForm must be used within a ContactFormProvider')
  }
  return context
}

interface ContactFormProviderProps {
  children: ReactNode
}

export default function ContactFormProvider({ children }: ContactFormProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formType, setFormType] = useState<'contact' | 'assessment'>('contact')

  const openContactForm = () => {
    setFormType('contact')
    setIsOpen(true)
  }

  const openAssessmentForm = () => {
    setFormType('assessment')
    setIsOpen(true)
  }

  const closeForm = () => {
    setIsOpen(false)
  }

  return (
    <ContactFormContext.Provider value={{
      openContactForm,
      openAssessmentForm,
      closeForm,
      isOpen,
      formType
    }}>
      {children}
      <ContactForm 
        isOpen={isOpen}
        onClose={closeForm}
        formType={formType}
      />
    </ContactFormContext.Provider>
  )
} 