import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { User, Camera } from "lucide-react"

const Avatar = React.forwardRef(({ 
  className, 
  size = "default",
  online = false,
  editable = false,
  onEdit,
  ...props 
}, ref) => {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8", 
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
    "3xl": "h-24 w-24"
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border-2 border-border bg-background",
        sizeClasses[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {props.children}
      
      {/* Online Status Indicator */}
      {online && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
      
      {/* Edit Button */}
      {editable && (
        <motion.button
          onClick={onEdit}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full"
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className="h-4 w-4 text-white" />
        </motion.button>
      )}
    </motion.div>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, alt, ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm",
      className
    )}
    {...props}
  >
    {children || <User className="h-1/2 w-1/2" />}
  </div>
))
AvatarFallback.displayName = "AvatarFallback"

// Profile Avatar Component
const ProfileAvatar = React.forwardRef(({ 
  src,
  name,
  email,
  size = "default",
  showInfo = false,
  className,
  ...props 
}, ref) => {
  const getInitials = (name) => {
    if (!name) return ""
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (showInfo) {
    return (
      <div 
        ref={ref}
        className={cn("flex items-center space-x-3", className)}
        {...props}
      >
        <Avatar size={size}>
          {src && <AvatarImage src={src} alt={name} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{name}</span>
          {email && (
            <span className="text-xs text-muted-foreground">{email}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <Avatar ref={ref} size={size} className={className} {...props}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
})
ProfileAvatar.displayName = "ProfileAvatar"

export { Avatar, AvatarImage, AvatarFallback, ProfileAvatar }