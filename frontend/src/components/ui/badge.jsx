import * as React from "react"
import { motion } from "framer-motion"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30",
        info: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30",
        outline: "border-border text-foreground hover:bg-accent hover:text-accent-foreground",
        gradient: "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
        pill: "rounded-full px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Badge = React.forwardRef(({ 
  className, 
  variant, 
  size,
  dismissible = false,
  onDismiss,
  children,
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  )
})
Badge.displayName = "Badge"

// Status Badge Component
const StatusBadge = React.forwardRef(({ 
  status, 
  className, 
  ...props 
}, ref) => {
  const getVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'approved':
      case 'published':
      case 'success':
      case 'completed':
        return 'success'
      case 'pending':
      case 'review':
      case 'processing':
        return 'warning'
      case 'inactive':
      case 'rejected':
      case 'failed':
      case 'error':
        return 'destructive'
      case 'draft':
      case 'new':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Badge
      ref={ref}
      variant={getVariant(status)}
      className={className}
      {...props}
    >
      {status}
    </Badge>
  )
})
StatusBadge.displayName = "StatusBadge"

// Skill Badge Component
const SkillBadge = React.forwardRef(({ 
  skill, 
  level, 
  className, 
  ...props 
}, ref) => {
  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'expert':
      case 'advanced':
        return 'gradient'
      case 'intermediate':
        return 'default'
      case 'beginner':
      case 'basic':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Badge
      ref={ref}
      variant={getLevelColor(level)}
      size="sm"
      className={cn("font-medium", className)}
      {...props}
    >
      {skill}
      {level && (
        <span className="ml-1 text-xs opacity-75">
          ({level})
        </span>
      )}
    </Badge>
  )
})
SkillBadge.displayName = "SkillBadge"

export { Badge, StatusBadge, SkillBadge, badgeVariants }