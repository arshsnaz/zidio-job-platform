import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  File, 
  FileText, 
  Image as ImageIcon,
  X, 
  Check, 
  AlertCircle, 
  Eye,
  Download,
  Trash2,
  RotateCcw,
  Paperclip
} from 'lucide-react'
import { Button } from './button'
import { Progress } from './progress'

export const DropzoneUpload = ({ 
  onFilesAccepted, 
  acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  multiple = false,
  className = "",
  children,
  disabled = false 
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [rejectedFiles, setRejectedFiles] = useState([])

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const filesWithPreview = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: 'ready',
        progress: 0
      }))
      
      setUploadedFiles(prev => [...prev, ...filesWithPreview])
      onFilesAccepted?.(acceptedFiles)
    }

    // Handle rejected files
    if (fileRejections.length > 0) {
      setRejectedFiles(fileRejections)
    }
  }, [onFilesAccepted])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxSize: maxFileSize,
    maxFiles,
    multiple,
    disabled
  })

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const clearRejectedFiles = () => {
    setRejectedFiles([])
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-green-500" />
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase()
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

  const dropzoneClassName = `
    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
    transition-all duration-300 ease-in-out
    ${disabled 
      ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed' 
      : isDragAccept 
        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 scale-105' 
        : isDragReject 
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
          : isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-102' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
    }
    ${className}
  `

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div {...getRootProps({ className: dropzoneClassName })}>
        <input {...getInputProps()} />
        
        <motion.div
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className="flex justify-center">
            <motion.div
              animate={isDragActive ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className={`h-12 w-12 ${
                isDragAccept ? 'text-green-500' : 
                isDragReject ? 'text-red-500' : 
                isDragActive ? 'text-blue-500' : 
                'text-gray-400'
              }`} />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            {children ? (
              children
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {isDragActive ? (
                    isDragAccept ? 'Drop files here' : 'File type not supported'
                  ) : (
                    'Drop files here or click to browse'
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.values(acceptedTypes).flat().join(', ')} • Max {formatFileSize(maxFileSize)}
                  {maxFiles > 1 && ` • Up to ${maxFiles} files`}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {file.preview ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  getFileIcon(file)
                )}
              </div>
              
              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Ready to upload
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {file.preview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.preview, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
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

      {/* Rejected Files */}
      <AnimatePresence>
        {rejectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-900 dark:text-red-100">
                    {rejectedFiles.length} file(s) rejected
                  </h4>
                  {rejectedFiles.map((rejection, index) => (
                    <div key={index} className="text-sm text-red-700 dark:text-red-300">
                      <p className="font-medium">{rejection.file.name}</p>
                      <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                        {rejection.errors.map((error, errorIndex) => (
                          <li key={errorIndex}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRejectedFiles}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const FileAttachment = ({ 
  files = [], 
  onAdd, 
  onRemove, 
  maxFiles = 5,
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Attachments ({files.length}/{maxFiles})
        </h3>
        {files.length < maxFiles && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAdd}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Add file
          </Button>
        )}
      </div>

      {files.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No attachments yet
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function for file size formatting
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}