import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bookmark, 
  Upload, 
  Download,
  Heart,
  Star,
  Eye,
  Settings,
  Bell,
  User,
  ChevronRight
} from 'lucide-react'

// UI Components
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Avatar } from '../components/ui/avatar'
import { Modal, Drawer, ConfirmDialog } from '../components/ui/modal'
import { SearchInput, JobSearchBar } from '../components/ui/search'
import { BookmarkButton } from '../components/ui/bookmark'
import { DropzoneUpload } from '../components/ui/dropzone'
import { Progress, CircularProgress, StepProgress } from '../components/ui/progress'
import { 
  CardSkeleton, 
  ListSkeleton, 
  TableSkeleton, 
  ChartSkeleton 
} from '../components/ui/skeleton'

// Layout Components
import { 
  Container, 
  ResponsiveGrid, 
  Stack, 
  ResponsiveCard,
  StatsGrid,
  FeatureGrid
} from '../components/ui/responsive'

// Typography Components
import { 
  Heading, 
  Text, 
  Label, 
  Caption, 
  PageTitle, 
  SectionTitle,
  CardTitle
} from '../components/ui/typography'

const ComponentShowcasePage = () => {
  const [showModal, setShowModal] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [filters, setFilters] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showSkeletons, setShowSkeletons] = useState(false)

  const sampleStats = [
    { value: "12,543", label: "Total Users", change: 12 },
    { value: "1,234", label: "Active Jobs", change: 8 },
    { value: "98.5%", label: "Success Rate", change: 2 },
    { value: "$2.4M", label: "Total Revenue", change: -3 }
  ]

  const sampleFeatures = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "Advanced Search",
      description: "Find the perfect job with our intelligent search and filtering system"
    },
    {
      icon: <Upload className="h-8 w-8 text-green-600" />,
      title: "Easy Upload",
      description: "Upload your resume and documents with our drag & drop interface"
    },
    {
      icon: <Bell className="h-8 w-8 text-yellow-600" />,
      title: "Smart Notifications",
      description: "Stay updated with real-time notifications about your applications"
    }
  ]

  const wizardSteps = [
    { title: "Personal Info", description: "Basic information" },
    { title: "Experience", description: "Work history" },
    { title: "Skills", description: "Technical skills" },
    { title: "Review", description: "Final review" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container className="py-8">
        <PageTitle>Component Showcase</PageTitle>
        <Caption className="mb-8">
          A comprehensive demo of all modern UI components built with TailwindCSS and Framer Motion
        </Caption>

        {/* Typography Section */}
        <section className="mb-12">
          <SectionTitle>Typography System</SectionTitle>
          <ResponsiveCard className="space-y-6">
            <div className="space-y-4">
              <Heading level={1}>Main Heading (H1)</Heading>
              <Heading level={2}>Section Heading (H2)</Heading>
              <Heading level={3}>Subsection Heading (H3)</Heading>
              <Text size="lg">Large body text for important content and descriptions</Text>
              <Text>Regular body text for general content and paragraphs</Text>
              <Text size="sm">Small text for captions, labels, and secondary information</Text>
              <Caption>Caption text for metadata and additional context</Caption>
            </div>
          </ResponsiveCard>
        </section>

        {/* Buttons Section */}
        <section className="mb-12">
          <SectionTitle>Button Components</SectionTitle>
          <ResponsiveCard>
            <div className="space-y-6">
              <div>
                <Label>Button Variants</Label>
                <Stack direction={{ base: 'column', md: 'row' }}>
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </Stack>
              </div>
              
              <div>
                <Label>Button Sizes</Label>
                <Stack direction={{ base: 'column', md: 'row' }} align="items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </Stack>
              </div>

              <div>
                <Label>Icon Buttons</Label>
                <Stack direction={{ base: 'column', md: 'row' }}>
                  <Button><Search className="h-4 w-4 mr-2" />Search</Button>
                  <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download</Button>
                  <Button variant="ghost"><Settings className="h-4 w-4 mr-2" />Settings</Button>
                </Stack>
              </div>
            </div>
          </ResponsiveCard>
        </section>

        {/* Form Elements */}
        <section className="mb-12">
          <SectionTitle>Form Elements</SectionTitle>
          <ResponsiveCard>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" required>Email Address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email" 
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="search">Search with Icon</Label>
                <SearchInput
                  placeholder="Search jobs, companies..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Advanced Job Search</Label>
                <div className="mt-2">
                  <JobSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    location={location}
                    onLocationChange={setLocation}
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={() => console.log('Search triggered')}
                  />
                </div>
              </div>
            </div>
          </ResponsiveCard>
        </section>

        {/* Interactive Components */}
        <section className="mb-12">
          <SectionTitle>Interactive Components</SectionTitle>
          <ResponsiveCard>
            <div className="space-y-6">
              <div>
                <Label>Bookmark & Actions</Label>
                <Stack direction={{ base: 'column', md: 'row' }}>
                  <BookmarkButton
                    isBookmarked={bookmarked}
                    onToggle={() => setBookmarked(!bookmarked)}
                    showLabel={true}
                  />
                  <BookmarkButton
                    variant="heart"
                    isBookmarked={bookmarked}
                    onToggle={() => setBookmarked(!bookmarked)}
                    showLabel={true}
                  />
                  <BookmarkButton
                    variant="star"
                    isBookmarked={bookmarked}
                    onToggle={() => setBookmarked(!bookmarked)}
                    showLabel={true}
                  />
                </Stack>
              </div>

              <div>
                <Label>Modal & Drawer Controls</Label>
                <Stack direction={{ base: 'column', md: 'row' }}>
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                  <Button variant="outline" onClick={() => setShowDrawer(true)}>Open Drawer</Button>
                  <Button variant="destructive" onClick={() => setShowConfirmDialog(true)}>
                    Delete Item
                  </Button>
                </Stack>
              </div>

              <div>
                <Label>Loading States</Label>
                <Stack direction={{ base: 'column', md: 'row' }}>
                  <Button onClick={() => setShowSkeletons(!showSkeletons)}>
                    {showSkeletons ? 'Hide' : 'Show'} Skeletons
                  </Button>
                  <Button variant="outline" disabled>
                    Loading...
                  </Button>
                </Stack>
              </div>
            </div>
          </ResponsiveCard>
        </section>

        {/* Progress Components */}
        <section className="mb-12">
          <SectionTitle>Progress Indicators</SectionTitle>
          <ResponsiveCard>
            <div className="space-y-6">
              <div>
                <Label>Linear Progress</Label>
                <div className="space-y-4 mt-2">
                  <Progress value={30} showValue={true} />
                  <Progress value={65} variant="success" showValue={true} />
                  <Progress value={85} variant="warning" showValue={true} />
                </div>
              </div>

              <div>
                <Label>Circular Progress</Label>
                <Stack direction={{ base: 'column', md: 'row' }} align="items-center">
                  <CircularProgress value={75} showValue={true} />
                  <CircularProgress value={50} variant="success" showValue={true} />
                  <CircularProgress value={25} variant="warning" showValue={true} />
                </Stack>
              </div>

              <div>
                <Label>Step Progress</Label>
                <div className="mt-4">
                  <StepProgress 
                    steps={wizardSteps}
                    currentStep={currentStep}
                  />
                  <div className="mt-4">
                    <Stack direction={{ base: 'column', md: 'row' }}>
                      <Button 
                        variant="outline"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      <Button 
                        onClick={() => setCurrentStep(Math.min(wizardSteps.length - 1, currentStep + 1))}
                        disabled={currentStep === wizardSteps.length - 1}
                      >
                        Next
                      </Button>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveCard>
        </section>

        {/* File Upload */}
        <section className="mb-12">
          <SectionTitle>File Upload System</SectionTitle>
          <ResponsiveCard>
            <DropzoneUpload
              onFilesAccepted={(files) => {
                setUploadedFiles(prev => [...prev, ...files])
                console.log('Files uploaded:', files)
              }}
              maxFiles={5}
              multiple={true}
            />
          </ResponsiveCard>
        </section>

        {/* Stats and Data Display */}
        <section className="mb-12">
          <SectionTitle>Statistics & Data Display</SectionTitle>
          <div className="space-y-6">
            <StatsGrid stats={sampleStats} />
            <FeatureGrid features={sampleFeatures} />
          </div>
        </section>

        {/* Loading States */}
        {showSkeletons && (
          <section className="mb-12">
            <SectionTitle>Loading Skeletons</SectionTitle>
            <div className="space-y-6">
              <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }}>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </ResponsiveGrid>
              <ListSkeleton count={3} />
              <ChartSkeleton />
              <TableSkeleton />
            </div>
          </section>
        )}

        {/* Cards and Layouts */}
        <section className="mb-12">
          <SectionTitle>Card Layouts</SectionTitle>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <ResponsiveCard key={i} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar />
                  <div className="flex-1">
                    <CardTitle>Card Title {i}</CardTitle>
                    <Caption>Card subtitle with additional information</Caption>
                  </div>
                  <Badge variant={i % 2 === 0 ? 'default' : 'secondary'}>
                    Status
                  </Badge>
                </div>
                <Text size="sm">
                  This is a sample card component with responsive design and modern styling.
                  It demonstrates the card layout with proper spacing and typography.
                </Text>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm">
                    View More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
        </section>

        {/* Theme Demo */}
        <section className="mb-12">
          <SectionTitle>Theme System</SectionTitle>
          <ResponsiveCard>
            <div className="space-y-4">
              <Text>
                The application supports automatic dark/light mode switching based on system preferences,
                with the ability to manually override the theme preference.
              </Text>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <Text className="font-medium">Light Mode</Text>
                  <Caption>Clean and bright interface</Caption>
                </div>
                <div className="p-4 bg-gray-800 text-white rounded-lg border">
                  <Text className="font-medium text-white">Dark Mode</Text>
                  <Caption className="text-gray-300">Easy on the eyes</Caption>
                </div>
              </div>
            </div>
          </ResponsiveCard>
        </section>
      </Container>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sample Modal"
        description="This is a demonstration modal with smooth animations"
      >
        <div className="p-6 space-y-4">
          <Text>
            This modal demonstrates the smooth animations and responsive design.
            It includes proper focus management and accessibility features.
          </Text>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Sample Drawer"
        description="Side panel with slide animation"
      >
        <div className="space-y-4">
          <Text>
            This drawer slides in from the right side with smooth animations.
            Perfect for navigation menus, filters, or detailed information panels.
          </Text>
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map(option => (
              <Button key={option} variant="ghost" className="w-full justify-start">
                {option}
              </Button>
            ))}
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => console.log('Item deleted')}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  )
}

export default ComponentShowcasePage