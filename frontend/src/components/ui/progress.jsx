import React from 'react'
import { motion } from 'framer-motion'

export const Progress = ({ 
  value = 0, 
  max = 100, 
  className = "", 
  size = 'md',
  variant = 'default',
  showValue = false,
  animated = true 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-cyan-600'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`
        w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
        ${sizeClasses[size]}
      `}>
        <motion.div
          className={`h-full rounded-full ${variantClasses[variant]}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 0.5, ease: "easeOut" } : {}}
        />
      </div>
      {showValue && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{Math.round(percentage)}%</span>
          <span>{value} / {max}</span>
        </div>
      )}
    </div>
  )
}

export const CircularProgress = ({ 
  value = 0, 
  max = 100, 
  size = 60,
  strokeWidth = 4,
  className = "",
  variant = 'default',
  showValue = false 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
  }

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

export const StepProgress = ({ 
  steps = [], 
  currentStep = 0, 
  className = "",
  variant = 'default' 
}) => {
  const variantClasses = {
    default: {
      active: 'bg-blue-600 border-blue-600 text-white',
      completed: 'bg-green-600 border-green-600 text-white',
      pending: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
    },
    minimal: {
      active: 'bg-blue-600 border-blue-600',
      completed: 'bg-green-600 border-green-600',
      pending: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
    }
  }

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed'
    if (index === currentStep) return 'active'
    return 'pending'
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isLast = index === steps.length - 1

        return (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <div className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                transition-all duration-200
                ${variantClasses[variant][status]}
              `}>
                {variant === 'default' ? (
                  status === 'completed' ? '✓' : index + 1
                ) : (
                  <div className="w-3 h-3 rounded-full bg-current" />
                )}
              </div>
              
              {variant === 'default' && (
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    status === 'active' ? 'text-blue-600 dark:text-blue-400' :
                    status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-colors duration-200
                ${status === 'completed' 
                  ? 'bg-green-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export const LoadingProgress = ({ 
  steps = [],
  currentStep = 0,
  className = "" 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Processing...
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentStep + 1} of {steps.length}
        </span>
      </div>
      
      <Progress 
        value={currentStep + 1} 
        max={steps.length} 
        variant="default"
        showValue={false}
        animated={true}
      />
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              index === currentStep 
                ? 'bg-blue-50 dark:bg-blue-900/20' 
                : index < currentStep 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              index === currentStep 
                ? 'bg-blue-600 text-white animate-pulse' 
                : index < currentStep 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
            }`}>
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className={`text-sm ${
              index === currentStep 
                ? 'text-blue-900 dark:text-blue-100 font-medium' 
                : index < currentStep 
                  ? 'text-green-900 dark:text-green-100' 
                  : 'text-gray-600 dark:text-gray-400'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}