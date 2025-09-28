import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  File, 
  FileText, 
  X, 
  Check, 
  AlertCircle, 
  Download,
  Eye,
  Trash2,
  RotateCcw
} from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'

export const FileUpload = ({ 
  onUpload, 
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  className = "",
  children 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      const isValidType = acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      )
      const isValidSize = file.size <= maxFileSize
      return isValidType && isValidSize
    })

    for (const file of validFiles) {
      const fileId = Math.random().toString(36).substr(2, 9)
      const uploadFile = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading'
      }

      setUploadingFiles(prev => [...prev, uploadFile])

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === fileId ? { ...f, progress } : f
            )
          )
        }

        // Simulate upload completion
        await onUpload?.(file)
        
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
        setUploadedFiles(prev => [...prev, {
          ...uploadFile,
          status: 'completed',
          uploadedAt: new Date(),
          url: URL.createObjectURL(file) // For preview
        }])
      } catch (error) {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === fileId ? { ...f, status: 'error', error: error.message } : f
          )
        )
      }
    }
  }

  const retryUpload = (fileId) => {
    const failedFile = uploadingFiles.find(f => f.id === fileId)
    if (failedFile) {
      setUploadingFiles(prev => 
        prev.map(f => 
          f.id === fileId ? { ...f, status: 'uploading', progress: 0 } : f
        )
      )
      handleFiles([failedFile.file])
    }
  }

  const removeFile = (fileId, isUploaded = false) => {
    if (isUploaded) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    } else {
      setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <motion.div
          animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {children || "Drop files here or click to upload"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: {acceptedTypes.join(', ')} • Max size: {formatFileSize(maxFileSize)}
            </p>
          </div>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploading Files */}
      <AnimatePresence>
        {uploadingFiles.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center space-x-4">
              {getFileIcon(file.name)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="space-y-2">
                    <Progress value={file.progress} className="h-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Uploading... {file.progress}%
                    </p>
                  </div>
                )}
                
                {file.status === 'error' && (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Upload failed: {file.error}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {file.status === 'error' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => retryUpload(file.id)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4"
          >
            <div className="flex items-center space-x-4">
              {getFileIcon(file.name)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Uploaded {file.uploadedAt.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id, true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export const ResumeUpload = ({ onUpload, existingResume }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Resume Upload
        </h3>
        {existingResume && (
          <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span>Resume uploaded</span>
          </div>
        )}
      </div>
      
      <FileUpload
        onUpload={onUpload}
        acceptedTypes={['.pdf', '.doc', '.docx']}
        maxFileSize={10 * 1024 * 1024} // 10MB for resumes
        multiple={false}
      >
        <div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            Upload your resume
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Upload a PDF or Word document to let employers know about your experience
          </p>
        </div>
      </FileUpload>
    </div>
  )
}

export const DocumentUpload = ({ 
  onUpload, 
  title = "Document Upload",
  description = "Upload supporting documents",
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  multiple = true 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <FileUpload
        onUpload={onUpload}
        acceptedTypes={acceptedTypes}
        multiple={multiple}
      />
    </div>
  )
}