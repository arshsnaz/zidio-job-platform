import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const InterviewsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interviews</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your interview schedule</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Calendar</CardTitle>
          <CardDescription>Schedule and track your interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Interview scheduling system coming soon...
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default InterviewsPage