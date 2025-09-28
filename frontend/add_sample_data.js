// Script to add sample data to the job platform
const sampleJobs = [
  {
    title: "Senior Full Stack Developer",
    description: "We are looking for an experienced Full Stack Developer to join our engineering team. The ideal candidate will have expertise in React, Node.js, and cloud technologies.",
    companyName: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    requiredSkills: "React, Node.js, JavaScript, TypeScript, AWS, MongoDB, PostgreSQL",
    stipend: "$120,000 - $150,000",
    experienceLevel: "Senior",
    recruiterEmail: "recruiter@techcorp.com",
    status: "ACTIVE"
  },
  {
    title: "Frontend React Developer",
    description: "Join our dynamic frontend team to build cutting-edge user interfaces for our SaaS platform. We use modern React ecosystem including Next.js, TypeScript, and Tailwind CSS.",
    companyName: "InnovateLabs",
    location: "Austin, TX",
    type: "Full-time",
    requiredSkills: "React, Next.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, Redux",
    stipend: "$90,000 - $120,000",
    experienceLevel: "Mid-level",
    recruiterEmail: "careers@innovatelabs.com",
    status: "ACTIVE"
  },
  {
    title: "DevOps Engineer",
    description: "Seeking a DevOps Engineer to streamline our CI/CD processes and manage cloud infrastructure. Experience with containerization and orchestration required.",
    companyName: "CloudTech Systems",
    location: "Seattle, WA",
    type: "Full-time",
    requiredSkills: "Docker, Kubernetes, AWS, Jenkins, Terraform, Linux, Python, Monitoring Tools",
    stipend: "$110,000 - $140,000",
    experienceLevel: "Mid-level",
    recruiterEmail: "hr@cloudtech.com",
    status: "ACTIVE"
  },
  {
    title: "Python Backend Developer",
    description: "Looking for a Python Backend Developer to work on our microservices architecture. You will be developing RESTful APIs and implementing scalable backend solutions.",
    companyName: "DataFlow Inc",
    location: "New York, NY",
    type: "Full-time",
    requiredSkills: "Python, Django, Flask, PostgreSQL, Redis, AWS, Docker, REST APIs",
    stipend: "$100,000 - $130,000",
    experienceLevel: "Mid-level",
    recruiterEmail: "jobs@dataflow.com",
    status: "ACTIVE"
  },
  {
    title: "Machine Learning Engineer",
    description: "Join our AI team to develop and deploy machine learning models for enterprise clients. Work with large datasets and implement ML algorithms.",
    companyName: "AI Innovations",
    location: "Boston, MA",
    type: "Full-time",
    requiredSkills: "Python, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, AWS SageMaker, MLOps",
    stipend: "$130,000 - $160,000",
    experienceLevel: "Senior",
    recruiterEmail: "ml-jobs@aiinnovations.com",
    status: "ACTIVE"
  },
  {
    title: "Mobile App Developer (React Native)",
    description: "Seeking a Mobile App Developer to build cross-platform applications using React Native. Experience with both iOS and Android development preferred.",
    companyName: "MobileTech Co",
    location: "Los Angeles, CA",
    type: "Full-time",
    requiredSkills: "React Native, JavaScript, TypeScript, iOS Development, Android Development, Redux",
    stipend: "$95,000 - $125,000",
    experienceLevel: "Mid-level",
    recruiterEmail: "mobile@mobiletech.com",
    status: "ACTIVE"
  },
  {
    title: "Software Engineering Intern",
    description: "Summer internship opportunity for Computer Science students. Work alongside experienced engineers on real projects involving web development and mobile apps.",
    companyName: "StartupHub",
    location: "Remote",
    type: "Internship",
    requiredSkills: "Any programming language, Git, Problem-solving skills",
    stipend: "$4,000 - $6,000 per month",
    experienceLevel: "Entry-level",
    recruiterEmail: "internships@startuphub.com",
    status: "ACTIVE"
  }
];

// Function to add jobs via API
async function addSampleJobs() {
  const API_BASE = 'http://localhost:7070/api';
  
  // First, let's create a recruiter user and get a token
  try {
    // Register a sample recruiter
    const recruiterData = {
      name: "TechCorp Recruiter",
      email: "recruiter@techcorp.com",
      password: "password123",
      role: "RECRUITER"
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recruiterData)
    });

    let token = null;
    if (registerResponse.status === 409) {
      // User already exists, try to login
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "recruiter@techcorp.com",
          password: "password123"
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        token = loginData.token;
      }
    } else if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      token = registerData.token;
    }

    if (!token) {
      console.log('Could not get authentication token');
      return;
    }

    // Now add jobs
    for (const job of sampleJobs) {
      try {
        const response = await fetch(`${API_BASE}/jobPosts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(job)
        });

        if (response.ok) {
          console.log(`Added job: ${job.title}`);
        } else {
          console.log(`Failed to add job: ${job.title}`, await response.text());
        }
      } catch (error) {
        console.log(`Error adding job ${job.title}:`, error);
      }
    }
  } catch (error) {
    console.log('Error:', error);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.addSampleJobs = addSampleJobs;
  window.sampleJobs = sampleJobs;
}

console.log('Sample data script loaded. Use addSampleJobs() to add sample jobs to the database.');