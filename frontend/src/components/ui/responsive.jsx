import React from 'react'
import { motion } from 'framer-motion'

// Responsive Container
export const Container = ({ 
  children, 
  maxWidth = 'max-w-7xl',
  padding = 'px-4 sm:px-6 lg:px-8',
  className = "" 
}) => {
  return (
    <div className={`mx-auto ${maxWidth} ${padding} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Grid
export const ResponsiveGrid = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'gap-6',
  className = "" 
}) => {
  const gridCols = `grid-cols-${cols.sm} sm:grid-cols-${cols.md} lg:grid-cols-${cols.lg} xl:grid-cols-${cols.xl}`
  
  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Stack
export const Stack = ({ 
  children, 
  direction = { base: 'column', md: 'row' },
  spacing = 'space-y-4 md:space-y-0 md:space-x-4',
  align = 'items-start',
  justify = 'justify-start',
  className = "" 
}) => {
  const flexDirection = `flex-col ${direction.md ? `md:flex-${direction.md}` : ''}`
  
  return (
    <div className={`flex ${flexDirection} ${spacing} ${align} ${justify} ${className}`}>
      {children}
    </div>
  )
}

// Responsive Card
export const ResponsiveCard = ({ 
  children, 
  padding = 'p-4 sm:p-6',
  className = "",
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        shadow-sm ${hover ? 'hover:shadow-md' : ''} transition-shadow
        ${padding} ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Mobile Drawer
export const MobileDrawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  showOverlay = true 
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {showOverlay && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
      
      {/* Mobile drawer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden"
      >
        {title && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </>
  )
}

// Responsive Text
export const ResponsiveText = ({ 
  children, 
  size = { base: 'text-base', sm: 'sm:text-lg', lg: 'lg:text-xl' },
  weight = 'font-normal',
  color = 'text-gray-900 dark:text-white',
  className = "",
  as = 'p' 
}) => {
  const Component = as
  const sizeClasses = Object.entries(size).map(([breakpoint, value]) => 
    breakpoint === 'base' ? value : `${breakpoint}:${value}`
  ).join(' ')
  
  return (
    <Component className={`${sizeClasses} ${weight} ${color} ${className}`}>
      {children}
    </Component>
  )
}

// Responsive Button Group
export const ResponsiveButtonGroup = ({ 
  children, 
  orientation = { base: 'vertical', sm: 'horizontal' },
  className = "" 
}) => {
  const orientationClasses = orientation.base === 'vertical' 
    ? 'flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'
    : 'flex-row space-x-2'
  
  return (
    <div className={`flex ${orientationClasses} ${className}`}>
      {children}
    </div>
  )
}

// Show/Hide based on screen size
export const ShowOn = ({ breakpoint = 'sm', children }) => {
  const breakpoints = {
    sm: 'hidden sm:block',
    md: 'hidden md:block', 
    lg: 'hidden lg:block',
    xl: 'hidden xl:block'
  }
  
  return (
    <div className={breakpoints[breakpoint]}>
      {children}
    </div>
  )
}

export const HideOn = ({ breakpoint = 'sm', children }) => {
  const breakpoints = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden', 
    xl: 'xl:hidden'
  }
  
  return (
    <div className={breakpoints[breakpoint]}>
      {children}
    </div>
  )
}

// Responsive Section
export const Section = ({ 
  children, 
  spacing = 'py-12 sm:py-16 lg:py-20',
  className = "" 
}) => {
  return (
    <section className={`${spacing} ${className}`}>
      {children}
    </section>
  )
}

// Responsive Hero Section
export const HeroSection = ({ 
  children, 
  className = "",
  background = 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800' 
}) => {
  return (
    <Section 
      spacing="py-16 sm:py-20 lg:py-24"
      className={`${background} ${className}`}
    >
      <Container>
        {children}
      </Container>
    </Section>
  )
}

// Responsive Stats Grid
export const StatsGrid = ({ stats = [], className = "" }) => {
  return (
    <ResponsiveGrid 
      cols={{ sm: 1, md: 2, lg: 4 }}
      className={className}
    >
      {stats.map((stat, index) => (
        <ResponsiveCard key={index} className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {stat.label}
          </div>
          {stat.change && (
            <div className={`text-xs mt-1 ${
              stat.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change > 0 ? '+' : ''}{stat.change}%
            </div>
          )}
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  )
}

// Responsive Feature Grid
export const FeatureGrid = ({ features = [], className = "" }) => {
  return (
    <ResponsiveGrid 
      cols={{ sm: 1, md: 2, lg: 3 }}
      className={className}
    >
      {features.map((feature, index) => (
        <ResponsiveCard key={index} className="text-center">
          <div className="flex justify-center mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {feature.description}
          </p>
        </ResponsiveCard>
      ))}
    </ResponsiveGrid>
  )
}

// Mobile-first utility hooks
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = React.useState('sm')
  
  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else if (width >= 640) setBreakpoint('sm')
      else setBreakpoint('xs')
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}

export const useIsMobile = () => {
  const breakpoint = useBreakpoint()
  return breakpoint === 'xs' || breakpoint === 'sm'
}