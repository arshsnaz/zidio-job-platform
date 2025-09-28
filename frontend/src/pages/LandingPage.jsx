import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Award, 
  Building2,
  Code,
  Lightbulb,
  Target,
  CheckCircle,
  Star,
  Globe,
  Play,
  ArrowUpRight,
  MessageSquare,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const LandingPage = () => {
  const stats = [
    { icon: Users, label: 'Active Job Seekers', value: '50,000+', color: 'bg-blue-500' },
    { icon: Building2, label: 'Partner Companies', value: '1,200+', color: 'bg-green-500' },
    { icon: Briefcase, label: 'Jobs Posted', value: '25,000+', color: 'bg-purple-500' },
    { icon: Award, label: 'Success Rate', value: '92%', color: 'bg-orange-500' }
  ];

  const services = [
    {
      icon: Code,
      title: 'Software Development',
      description: 'Connect with top software engineers, developers, and tech professionals.',
      features: ['Full-stack Development', 'Mobile App Development', 'DevOps & Cloud', 'AI/ML Engineering']
    },
    {
      icon: Lightbulb,
      title: 'Digital Innovation',
      description: 'Find innovative minds for digital transformation and emerging technologies.',
      features: ['Product Design', 'UX/UI Design', 'Digital Marketing', 'Business Analysis']
    },
    {
      icon: Target,
      title: 'Talent Acquisition',
      description: 'Streamlined recruitment process with AI-powered matching algorithms.',
      features: ['Smart Matching', 'Skills Assessment', 'Interview Scheduling', 'Analytics Dashboard']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'TechCorp',
      image: '/api/placeholder/60/60',
      quote: 'Zidio Development helped me find my dream job in just 2 weeks. Their platform is intuitive and the matching algorithm is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'HR Director',
      company: 'InnovateLab',
      image: '/api/placeholder/60/60',
      quote: 'We\'ve hired over 50 talented professionals through Zidio. Their quality candidate pool and efficient process saved us months of recruitment time.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Product Manager',
      company: 'StartupHub',
      image: '/api/placeholder/60/60',
      quote: 'The career guidance and skill development resources on Zidio are exceptional. It\'s more than just a job platform.',
      rating: 5
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Zidio Development
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-slate-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="space-y-8">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                🚀 #1 Tech Job Platform
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Connect Top{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tech Talent
                </span>{' '}
                with Dream Opportunities
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed">
                Zidio Development revolutionizes tech recruitment with AI-powered matching, 
                comprehensive skill assessments, and seamless hiring experiences for both 
                candidates and companies.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=student">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    Find Your Dream Job
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/register?role=recruiter">
                  <Button size="lg" variant="outline" className="border-slate-300 hover:border-blue-600 hover:text-blue-600 px-8 py-4 text-lg">
                    Hire Top Talent
                    <Building2 className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{i}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Trusted by 50,000+ professionals</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-slate-600">4.9/5 rating</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Live Job Matches</h3>
                    <Badge className="bg-green-100 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Live
                    </Badge>
                  </div>
                  
                  {['Senior React Developer', 'Python Backend Engineer', 'DevOps Specialist'].map((title, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{title}</p>
                        <p className="text-sm text-slate-500">95% match • $120k+</p>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Apply
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-200 rounded-full blur-xl opacity-60"></div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                      <div className="text-slate-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 mb-4">Our Services</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Comprehensive Tech Recruitment Solutions
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From startups to enterprise companies, we provide tailored solutions 
              to connect the right talent with the right opportunities.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-0 shadow-md">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-slate-900">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Simple Steps to Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our streamlined process makes finding the perfect job or candidate effortless and efficient.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Job Seekers */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">For Job Seekers</h3>
                <p className="text-slate-600">Find your dream job in tech with our AI-powered platform</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Create Your Profile', description: 'Build a comprehensive profile showcasing your skills, experience, and career goals.' },
                  { step: 2, title: 'Get Matched', description: 'Our AI algorithm matches you with relevant job opportunities based on your profile.' },
                  { step: 3, title: 'Apply & Interview', description: 'Apply to jobs with one click and participate in streamlined interview processes.' },
                  { step: 4, title: 'Land Your Dream Job', description: 'Receive offers and start your new career journey with ongoing support.' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Employers */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">For Employers</h3>
                <p className="text-slate-600">Hire top talent quickly and efficiently</p>
              </div>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Post Job Requirements', description: 'Define your ideal candidate with detailed job descriptions and requirements.' },
                  { step: 2, title: 'Review Matched Candidates', description: 'Get a curated list of pre-screened candidates that match your criteria.' },
                  { step: 3, title: 'Conduct Interviews', description: 'Use our integrated tools to schedule and conduct efficient interviews.' },
                  { step: 4, title: 'Make the Hire', description: 'Extend offers and onboard your new team members seamlessly.' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 mb-4">Success Stories</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Thousands of professionals have transformed their careers through Zidio Development.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-slate-700 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center space-x-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of professionals who have found success through Zidio Development. 
              Your dream job or perfect candidate is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=student">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Start Job Search
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/register?role=recruiter">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
                  Post a Job
                  <Building2 className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Zidio Development</span>
              </div>
              <p className="text-slate-400">
                Connecting top tech talent with dream opportunities worldwide.
              </p>
              <div className="flex space-x-4">
                {/* Social links would go here */}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Salary Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interview Tips</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Employers</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Candidates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@zidiodevelopment.com
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              © 2025 Zidio Development. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;