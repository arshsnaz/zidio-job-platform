import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, children, hover = true, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-lg",
      "backdrop-blur-sm",
      hover && "hover:shadow-xl hover:border-primary/20 transition-all duration-300",
      className
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={hover ? { 
      y: -4,
      transition: { duration: 0.2 }
    } : {}}
    {...props}
  >
    {children}
  </motion.div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight",
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
      className
    )}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced Card variants
const StatsCard = React.forwardRef(({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon: Icon,
  className,
  ...props 
}, ref) => (
  <Card
    ref={ref}
    className={cn(
      "p-6 hover:scale-105 transition-all duration-300",
      "bg-gradient-to-br from-background to-secondary/30",
      className
    )}
    {...props}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={cn(
            "text-xs font-medium mt-1",
            changeType === "positive" ? "text-green-600" : "text-red-600"
          )}>
            {change}
          </p>
        )}
      </div>
      {Icon && (
        <div className={cn(
          "p-3 rounded-full",
          changeType === "positive" 
            ? "bg-green-100 text-green-600 dark:bg-green-900/20" 
            : "bg-red-100 text-red-600 dark:bg-red-900/20"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  </Card>
))
StatsCard.displayName = "StatsCard"

const GlassCard = React.forwardRef(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20",
      "shadow-xl dark:bg-black/10 dark:border-white/10",
      "hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300",
      className
    )}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ 
      scale: 1.02,
      y: -4,
      transition: { duration: 0.2 }
    }}
    {...props}
  >
    {children}
  </motion.div>
))
GlassCard.displayName = "GlassCard"

const FeatureCard = React.forwardRef(({ 
  icon: Icon,
  title,
  description,
  href,
  className,
  ...props 
}, ref) => (
  <Card
    ref={ref}
    className={cn(
      "p-6 cursor-pointer group",
      "hover:shadow-2xl hover:scale-105 transition-all duration-300",
      "border-2 hover:border-primary/50",
      className
    )}
    {...props}
  >
    <div className="flex flex-col items-center text-center space-y-4">
      {Icon && (
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </Card>
))
FeatureCard.displayName = "FeatureCard"

const InteractiveCard = React.forwardRef(({ 
  className, 
  children, 
  onClick,
  ...props 
}, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-lg",
      "cursor-pointer transition-all duration-300",
      "hover:shadow-xl hover:border-primary/30",
      className
    )}
    onClick={onClick}
    whileHover={{ 
      scale: 1.02, 
      y: -4,
      transition: { duration: 0.2 }
    }}
    whileTap={{ 
      scale: 0.98,
      transition: { duration: 0.1 }
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
))
InteractiveCard.displayName = "InteractiveCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  StatsCard,
  GlassCard,
  FeatureCard,
  InteractiveCard
}