import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, MapPin, Briefcase, Calendar, Clock } from 'lucide-react'
import { Input } from './input'
import { Button } from './button'
import { Badge } from './badge'

export const SearchInput = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  onClear,
  className = "",
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10"
        {...props}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

export const JobSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  location, 
  onLocationChange,
  filters,
  onFiltersChange,
  onSearch 
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Sales']

  const handleFilterToggle = (type, value) => {
    const currentFilters = filters[type] || []
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value]
    
    onFiltersChange({
      ...filters,
      [type]: newFilters
    })
  }

  const activeFilterCount = Object.values(filters).flat().length

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex-1">
          <SearchInput
            placeholder="Job title, keywords, or company"
            value={searchQuery}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
          />
        </div>
        
        <div className="w-full md:w-64">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2 px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          <Button onClick={onSearch} className="px-6">
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
          >
            {/* Job Type */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Briefcase className="h-4 w-4 mr-2" />
                Job Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map(type => (
                  <Badge
                    key={type}
                    variant={filters.jobType?.includes(type) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterToggle('jobType', type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Calendar className="h-4 w-4 mr-2" />
                Experience Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {experienceLevels.map(level => (
                  <Badge
                    key={level}
                    variant={filters.experienceLevel?.includes(level) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterToggle('experienceLevel', level)}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Briefcase className="h-4 w-4 mr-2" />
                Industry
              </h3>
              <div className="flex flex-wrap gap-2">
                {industries.map(industry => (
                  <Badge
                    key={industry}
                    variant={filters.industry?.includes(industry) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterToggle('industry', industry)}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Date Posted */}
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3">
                <Clock className="h-4 w-4 mr-2" />
                Date Posted
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Last 24 hours', 'Last 3 days', 'Last week', 'Last month'].map(period => (
                  <Badge
                    key={period}
                    variant={filters.datePosted?.includes(period) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => handleFilterToggle('datePosted', period)}
                  >
                    {period}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => onFiltersChange({})}
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SearchResults = ({ 
  results = [], 
  loading = false, 
  searchQuery = "",
  totalResults = 0,
  onResultClick 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search terms or filters
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {totalResults > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalResults.toLocaleString()} results found
        </div>
      )}
      
      <AnimatePresence>
        {results.map((result, index) => (
          <motion.div
            key={result.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onResultClick?.(result)}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {result.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {result.company} • {result.location}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {result.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {result.type}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {result.postedAt}
                  </span>
                </div>
              </div>
              {result.salary && (
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {result.salary}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}