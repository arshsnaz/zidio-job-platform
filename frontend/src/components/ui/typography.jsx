import React from 'react'

// Typography Scale
export const Heading = ({ 
  level = 1, 
  children, 
  className = "",
  color = "text-gray-900 dark:text-white",
  weight = "font-bold",
  tracking = "tracking-tight",
  leading = "",
  responsive = true,
  ...props 
}) => {
  const baseClasses = `${color} ${weight} ${tracking} ${leading}`
  
  const responsiveClasses = {
    1: responsive ? "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl" : "text-4xl",
    2: responsive ? "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl" : "text-3xl", 
    3: responsive ? "text-xl sm:text-2xl lg:text-3xl xl:text-4xl" : "text-2xl",
    4: responsive ? "text-lg sm:text-xl lg:text-2xl xl:text-3xl" : "text-xl",
    5: responsive ? "text-base sm:text-lg lg:text-xl xl:text-2xl" : "text-lg",
    6: responsive ? "text-sm sm:text-base lg:text-lg xl:text-xl" : "text-base"
  }
  
  const sizeClass = responsiveClasses[level] || responsiveClasses[1]
  const Component = `h${level}`
  
  return React.createElement(
    Component,
    {
      className: `${baseClasses} ${sizeClass} ${className}`,
      ...props
    },
    children
  )
}

export const Text = ({ 
  size = 'base',
  children, 
  className = "",
  color = "text-gray-700 dark:text-gray-300",
  weight = "font-normal",
  leading = "leading-relaxed",
  as = 'p',
  ...props 
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    '2xl': "text-2xl"
  }
  
  const Component = as
  
  return React.createElement(
    Component,
    {
      className: `${color} ${weight} ${leading} ${sizeClasses[size]} ${className}`,
      ...props
    },
    children
  )
}

export const Label = ({ 
  children, 
  htmlFor,
  required = false,
  className = "",
  size = 'sm',
  ...props 
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base"
  }
  
  return (
    <label 
      htmlFor={htmlFor}
      className={`
        block font-medium text-gray-900 dark:text-white
        ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export const Caption = ({ 
  children, 
  className = "",
  color = "text-gray-500 dark:text-gray-400",
  ...props 
}) => {
  return (
    <Text 
      size="sm" 
      color={color}
      className={className}
      {...props}
    >
      {children}
    </Text>
  )
}

export const Quote = ({ 
  children, 
  author,
  className = "",
  ...props 
}) => {
  return (
    <blockquote 
      className={`
        border-l-4 border-blue-500 pl-6 py-4 italic
        text-gray-700 dark:text-gray-300
        ${className}
      `}
      {...props}
    >
      <Text size="lg" leading="leading-relaxed">
        "{children}"
      </Text>
      {author && (
        <footer className="mt-3">
          <Text size="sm" color="text-gray-500 dark:text-gray-400">
            — {author}
          </Text>
        </footer>
      )}
    </blockquote>
  )
}

export const Code = ({ 
  children, 
  inline = false,
  className = "",
  ...props 
}) => {
  if (inline) {
    return (
      <code 
        className={`
          px-1.5 py-0.5 rounded text-sm font-mono
          bg-gray-100 dark:bg-gray-800 
          text-gray-900 dark:text-gray-100
          ${className}
        `}
        {...props}
      >
        {children}
      </code>
    )
  }
  
  return (
    <pre 
      className={`
        p-4 rounded-lg overflow-x-auto
        bg-gray-100 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
        {children}
      </code>
    </pre>
  )
}

export const List = ({ 
  children, 
  ordered = false,
  className = "",
  spacing = "space-y-2",
  ...props 
}) => {
  const Component = ordered ? 'ol' : 'ul'
  const listStyle = ordered ? 'list-decimal' : 'list-disc'
  
  return React.createElement(
    Component,
    {
      className: `${listStyle} list-inside ${spacing} ${className}`,
      ...props
    },
    children
  )
}

export const ListItem = ({ 
  children, 
  className = "",
  ...props 
}) => {
  return (
    <li 
      className={`text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </li>
  )
}

export const Link = ({ 
  children, 
  href,
  external = false,
  className = "",
  variant = 'default',
  ...props 
}) => {
  const variants = {
    default: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline",
    subtle: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400",
    button: "inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  }
  
  return (
    <a 
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

export const Highlight = ({ 
  children, 
  color = 'yellow',
  className = "",
  ...props 
}) => {
  const colors = {
    yellow: "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100",
    blue: "bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100",
    green: "bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100",
    red: "bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100",
    purple: "bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100"
  }
  
  return (
    <mark 
      className={`px-1 py-0.5 rounded ${colors[color]} ${className}`}
      {...props}
    >
      {children}
    </mark>
  )
}

export const Divider = ({ 
  className = "",
  orientation = 'horizontal',
  spacing = 'my-8',
  ...props 
}) => {
  const orientationClass = orientation === 'vertical' 
    ? 'w-px h-full mx-4' 
    : 'h-px w-full'
  
  return (
    <hr 
      className={`
        border-none bg-gray-200 dark:bg-gray-700
        ${orientationClass} ${spacing} ${className}
      `}
      {...props}
    />
  )
}

// Utility components for common text patterns
export const PageTitle = ({ children, className = "", ...props }) => (
  <Heading 
    level={1} 
    className={`mb-6 ${className}`}
    {...props}
  >
    {children}
  </Heading>
)

export const SectionTitle = ({ children, className = "", ...props }) => (
  <Heading 
    level={2} 
    className={`mb-4 ${className}`}
    {...props}
  >
    {children}
  </Heading>
)

export const CardTitle = ({ children, className = "", ...props }) => (
  <Heading 
    level={3} 
    className={`mb-2 ${className}`}
    responsive={false}
    {...props}
  >
    {children}
  </Heading>
)

export const FormSection = ({ title, description, children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {title && <SectionTitle>{title}</SectionTitle>}
    {description && <Caption>{description}</Caption>}
    {children}
  </div>
)

export const ErrorText = ({ children, className = "", ...props }) => (
  <Text 
    size="sm" 
    color="text-red-600 dark:text-red-400"
    className={className}
    {...props}
  >
    {children}
  </Text>
)

export const SuccessText = ({ children, className = "", ...props }) => (
  <Text 
    size="sm" 
    color="text-green-600 dark:text-green-400"
    className={className}
    {...props}
  >
    {children}
  </Text>
)

export const HelperText = ({ children, className = "", ...props }) => (
  <Caption className={className} {...props}>
    {children}
  </Caption>
)