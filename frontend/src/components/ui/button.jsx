import * as React from "react"
import { motion } from "framer-motion"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-105",
        outline: "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:scale-105",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:scale-105",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl hover:scale-105",
        glass: "backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 dark:bg-black/10 dark:border-white/10 dark:hover:bg-black/20 hover:scale-105",
        success: "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-bold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  const Component = motion.button

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Component>
  )
})

Button.displayName = "Button"

// Additional button components for specific use cases
const IconButton = React.forwardRef(({ 
  icon: Icon, 
  className, 
  variant = "ghost", 
  size = "icon",
  ...props 
}, ref) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("rounded-full", className)}
      ref={ref}
      {...props}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
});

IconButton.displayName = "IconButton";

const FloatingActionButton = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      <Button
        variant="gradient"
        size="lg"
        className={cn(
          "rounded-full h-14 w-14 p-0 shadow-2xl hover:shadow-3xl",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
});

FloatingActionButton.displayName = "FloatingActionButton";

const ButtonGroup = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "inline-flex rounded-xl shadow-sm",
        "divide-x divide-border",
        "[&>button]:rounded-none",
        "[&>button:first-child]:rounded-l-xl",
        "[&>button:last-child]:rounded-r-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = "ButtonGroup";

export { Button, IconButton, FloatingActionButton, ButtonGroup, buttonVariants }