import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, Heart, HeartOff, Star, StarOff } from 'lucide-react'
import { Button } from './button'

export const BookmarkButton = ({ 
  isBookmarked = false, 
  onToggle, 
  variant = 'bookmark',
  size = 'md',
  showLabel = false,
  disabled = false,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = async () => {
    if (disabled || isAnimating) return
    
    setIsAnimating(true)
    try {
      await onToggle?.()
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const icons = {
    bookmark: {
      filled: BookmarkCheck,
      outline: Bookmark
    },
    heart: {
      filled: Heart,
      outline: HeartOff
    },
    star: {
      filled: Star,
      outline: StarOff
    }
  }

  const colors = {
    bookmark: {
      filled: 'text-blue-600 dark:text-blue-400',
      outline: 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
    },
    heart: {
      filled: 'text-red-600 dark:text-red-400',
      outline: 'text-gray-400 hover:text-red-600 dark:hover:text-red-400'
    },
    star: {
      filled: 'text-yellow-600 dark:text-yellow-400',
      outline: 'text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400'
    }
  }

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const Icon = isBookmarked ? icons[variant].filled : icons[variant].outline
  const colorClass = isBookmarked ? colors[variant].filled : colors[variant].outline

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`transition-colors duration-200 ${className}`}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Icon 
          className={`${sizes[size]} ${colorClass} transition-colors duration-200`}
        />
        {showLabel && (
          <span className="text-sm">
            {isBookmarked 
              ? variant === 'bookmark' ? 'Saved' 
                : variant === 'heart' ? 'Liked' 
                : 'Starred'
              : variant === 'bookmark' ? 'Save' 
                : variant === 'heart' ? 'Like' 
                : 'Star'
            }
          </span>
        )}
      </motion.div>
    </Button>
  )
}

export const BookmarkList = ({ 
  bookmarks = [], 
  onRemove, 
  onItemClick,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No saved jobs yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Start saving jobs you're interested in to view them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark, index) => (
        <motion.div
          key={bookmark.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onItemClick?.(bookmark)}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {bookmark.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {bookmark.company} • {bookmark.location}
              </p>
              {bookmark.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {bookmark.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Saved on {new Date(bookmark.savedAt).toLocaleDateString()}</span>
                {bookmark.salary && (
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {bookmark.salary}
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-4">
              <BookmarkButton
                isBookmarked={true}
                onToggle={() => onRemove?.(bookmark.id)}
                variant="bookmark"
                size="md"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export const BookmarkStats = ({ totalBookmarks = 0, recentBookmarks = 0 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Saved Jobs Statistics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalBookmarks}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Saved
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {recentBookmarks}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This Week
          </div>
        </div>
      </div>
    </div>
  )
}

export const BookmarkCategories = ({ 
  categories = [], 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Categories
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect?.('all')}
          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All Jobs
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
              selectedCategory === category.id
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>{category.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}