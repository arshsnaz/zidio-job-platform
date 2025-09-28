import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Calendar,
  Users,
  FileText,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

const JobPostingWizard = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    department: '',
    location: '',
    workType: 'full-time',
    
    // Job Details
    description: '',
    responsibilities: [''],
    requirements: [''],
    qualifications: [''],
    
    // Compensation & Benefits
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    benefits: [''],
    
    // Application Settings
    applicationDeadline: '',
    questionsRequired: [],
    hiringManager: '',
    
    // Review & Publish
    isActive: true,
    emailNotifications: true
  })

  const steps = [
    { id: 1, title: 'Basic Info', icon: Briefcase },
    { id: 2, title: 'Job Details', icon: FileText },
    { id: 3, title: 'Compensation', icon: DollarSign },
    { id: 4, title: 'Application', icon: Calendar },
    { id: 5, title: 'Review', icon: CheckCircle }
  ]

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => updateFormData('department', e.target.value)}
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Work Type *</label>
                <select
                  value={formData.workType}
                  onChange={(e) => updateFormData('workType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key Responsibilities</label>
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={resp}
                    onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                    placeholder="Add a key responsibility"
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('responsibilities', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('responsibilities')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Responsibility
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={req}
                    onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                    placeholder="Add a requirement"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('requirements', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('requirements')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Salary</label>
                <Input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => updateFormData('salaryMin', e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Maximum Salary</label>
                <Input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => updateFormData('salaryMax', e.target.value)}
                  placeholder="80000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => updateFormData('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Benefits & Perks</label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={benefit}
                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                    placeholder="e.g. Health insurance, Remote work, Stock options"
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('benefits', index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('benefits')}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Benefit
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Application Deadline</label>
              <Input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Hiring Manager</label>
              <Input
                value={formData.hiringManager}
                onChange={(e) => updateFormData('hiringManager', e.target.value)}
                placeholder="Name of the hiring manager"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={(e) => updateFormData('emailNotifications', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Send email notifications for new applications</span>
              </label>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Job Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg">{formData.title || 'Job Title'}</h4>
                  <p className="text-muted-foreground">{formData.department} • {formData.location}</p>
                  <Badge variant="outline" className="mt-2">{formData.workType}</Badge>
                </div>

                {formData.description && (
                  <div>
                    <h5 className="font-medium mb-2">Description</h5>
                    <p className="text-sm text-muted-foreground">{formData.description}</p>
                  </div>
                )}

                {formData.salaryMin && formData.salaryMax && (
                  <div>
                    <h5 className="font-medium mb-2">Salary Range</h5>
                    <p className="text-sm">
                      {formData.currency} {formData.salaryMin} - {formData.salaryMax}
                    </p>
                  </div>
                )}

                {formData.requirements.filter(req => req.trim()).length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2">Requirements</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.requirements.filter(req => req.trim()).map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold">Post a New Job</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-12 h-0.5 mx-2
                      ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Job
                </Button>
              ) : (
                <Button onClick={nextStep}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default JobPostingWizard