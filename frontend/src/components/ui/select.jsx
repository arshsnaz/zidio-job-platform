import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const Select = ({ children, value, onValueChange, disabled = false }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { value, onValueChange, disabled })
      )}
    </div>
  )
}

const SelectTrigger = ({ 
  children, 
  className, 
  value, 
  onValueChange, 
  disabled,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 z-50 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === SelectContent) {
                  return React.cloneElement(child, { 
                    value, 
                    onValueChange, 
                    onClose: () => setIsOpen(false)
                  })
                }
                return null
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const SelectValue = ({ placeholder, value, children }) => {
  return (
    <span className="block truncate">
      {value || placeholder || "Select..."}
    </span>
  )
}

const SelectContent = ({ 
  children, 
  className, 
  value, 
  onValueChange, 
  onClose,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "max-h-60 overflow-auto",
        className
      )}
      {...props}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange, onClose })
      )}
    </div>
  )
}

const SelectItem = ({ 
  children, 
  value: itemValue, 
  className,
  value: selectedValue,
  onValueChange,
  onClose,
  ...props 
}) => {
  const isSelected = selectedValue === itemValue

  const handleSelect = () => {
    if (onValueChange) {
      onValueChange(itemValue)
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={handleSelect}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      <span className="block truncate">{children}</span>
    </button>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
}