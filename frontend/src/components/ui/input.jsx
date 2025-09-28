import * as React from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Search, X } from "lucide-react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ 
  className, 
  type, 
  icon: Icon, 
  label, 
  error, 
  clearable = false,
  onClear,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  React.useEffect(() => {
    setHasValue(!!props.value || !!props.defaultValue)
  }, [props.value, props.defaultValue])

  const handleClear = () => {
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      {label && (
        <motion.label
          className={cn(
            "absolute left-3 text-sm font-medium pointer-events-none transition-all duration-200 z-10",
            isFocused || hasValue
              ? "top-2 text-xs text-primary bg-background px-1 -translate-y-1/2"
              : "top-1/2 -translate-y-1/2 text-muted-foreground",
            Icon && "left-10"
          )}
          animate={{
            fontSize: isFocused || hasValue ? "0.75rem" : "0.875rem",
            y: isFocused || hasValue ? -24 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {/* Leading Icon */}
        {Icon && (
          <Icon className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 z-10 transition-colors",
            isFocused ? "text-primary" : "text-muted-foreground"
          )} />
        )}
        
        {/* Input Field */}
        <input
          type={inputType}
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm transition-all duration-200",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "hover:border-primary/50",
            Icon && "pl-10",
            (type === 'password' || clearable) && "pr-10",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Trailing Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {/* Clear Button */}
          {clearable && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
          
          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-destructive font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})
Input.displayName = "Input"

// Search Input Component
const SearchInput = React.forwardRef(({ 
  className, 
  placeholder = "Search...",
  onSearch,
  ...props 
}, ref) => {
  const [searchValue, setSearchValue] = React.useState("")

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClear = () => {
    setSearchValue("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <Input
      ref={ref}
      type="text"
      icon={Search}
      placeholder={placeholder}
      value={searchValue}
      onChange={handleSearch}
      clearable={searchValue.length > 0}
      onClear={handleClear}
      className={cn("max-w-sm", className)}
      {...props}
    />
  )
})
SearchInput.displayName = "SearchInput"

// Textarea Component
const Textarea = React.forwardRef(({ 
  className, 
  label, 
  error, 
  rows = 3,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(false)

  React.useEffect(() => {
    setHasValue(!!props.value || !!props.defaultValue)
  }, [props.value, props.defaultValue])

  return (
    <div className="relative w-full">
      {/* Floating Label */}
      {label && (
        <motion.label
          className={cn(
            "absolute left-3 text-sm font-medium pointer-events-none transition-all duration-200 z-10",
            isFocused || hasValue
              ? "top-2 text-xs text-primary bg-background px-1 -translate-y-1/2"
              : "top-4 text-muted-foreground"
          )}
          animate={{
            fontSize: isFocused || hasValue ? "0.75rem" : "0.875rem",
            y: isFocused || hasValue ? -12 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
      
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-xl border border-input bg-background px-3 py-3 text-sm transition-all duration-200",
          "placeholder:text-muted-foreground resize-none",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-primary/50",
          error && "border-destructive focus:border-destructive focus:ring-destructive/20",
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-destructive font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Input, SearchInput, Textarea }