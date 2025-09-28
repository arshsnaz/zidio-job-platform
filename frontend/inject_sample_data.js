// Console script to add sample jobs
(async function() {
  const API_BASE = 'http://localhost:7070/api';
  
  // Sample jobs data
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
    }
  ];

  console.log('Starting to add sample jobs...');
  
  try {
    // First create a recruiter account
    const recruiterData = {
      name: "TechCorp Recruiter",
      email: "recruiter@techcorp.com",
      password: "password123",
      role: "RECRUITER"
    };

    let token = null;
    
    // Try to register, if already exists, login
    try {
      const registerResponse = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recruiterData)
      });
      
      if (registerResponse.ok) {
        const data = await registerResponse.json();
        token = data.token;
        console.log('✓ Recruiter registered successfully');
      }
    } catch (e) {
      console.log('Recruiter may already exist, trying to login...');
    }

    if (!token) {
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: "recruiter@techcorp.com",
          password: "password123"
        })
      });
      
      if (loginResponse.ok) {
        const data = await loginResponse.json();
        token = data.token;
        console.log('✓ Recruiter logged in successfully');
      } else {
        console.error('Could not authenticate recruiter');
        return;
      }
    }

    // Now add the jobs
    let successCount = 0;
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
          console.log(`✓ Added job: ${job.title}`);
          successCount++;
        } else {
          const errorText = await response.text();
          console.log(`✗ Failed to add job: ${job.title} - ${errorText}`);
        }
      } catch (error) {
        console.log(`✗ Error adding job ${job.title}:`, error.message);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n🎉 Successfully added ${successCount} out of ${sampleJobs.length} jobs!`);
    console.log('You can now refresh the page to see the jobs in the Jobs section.');
    
  } catch (error) {
    console.error('Script error:', error);
  }
})();