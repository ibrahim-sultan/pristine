const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Program = require('../models/Program');
const Testimonial = require('../models/Testimonial');
const User = require('../models/User');

dotenv.config();

const programs = [
  {
    title: "AI & Machine Learning Bootcamp",
    category: "bootcamp",
    description: "Dive deep into the world of artificial intelligence and machine learning. Learn to build intelligent systems, work with neural networks, and create predictive models that solve real-world problems.",
    shortDescription: "Master AI fundamentals and build intelligent systems with hands-on projects.",
    duration: "10 weeks",
    level: "intermediate",
    price: { amount: 599, currency: "USD" },
    modules: [
      { title: "Introduction to AI", description: "Fundamentals of artificial intelligence", duration: "1 week", topics: ["AI History", "Types of AI", "AI Applications"] },
      { title: "Python for AI", description: "Python programming for AI development", duration: "2 weeks", topics: ["NumPy", "Pandas", "Data Manipulation"] },
      { title: "Machine Learning Basics", description: "Core ML concepts and algorithms", duration: "3 weeks", topics: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"] },
      { title: "Deep Learning", description: "Neural networks and deep learning", duration: "2 weeks", topics: ["Neural Networks", "TensorFlow", "Keras"] },
      { title: "Capstone Project", description: "Build a complete AI solution", duration: "2 weeks", topics: ["Project Planning", "Implementation", "Presentation"] }
    ],
    outcomes: ["Build machine learning models", "Understand neural network architectures", "Deploy AI solutions", "Work with real datasets"],
    prerequisites: ["Basic programming knowledge", "High school mathematics"],
    features: ["Live instructor-led sessions", "Hands-on projects", "Industry mentorship", "Certificate of completion"],
    deliveryMode: "online",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Data Science & Analytics Bootcamp",
    category: "bootcamp",
    description: "Transform data into actionable insights. Learn statistical analysis, data visualization, and predictive modeling to become a data-driven decision maker.",
    shortDescription: "Learn to analyze data and derive meaningful insights for business decisions.",
    duration: "8 weeks",
    level: "beginner",
    price: { amount: 499, currency: "USD" },
    modules: [
      { title: "Data Fundamentals", description: "Introduction to data science", duration: "1 week", topics: ["Data Types", "Data Collection", "Data Ethics"] },
      { title: "Statistical Analysis", description: "Statistical methods for data analysis", duration: "2 weeks", topics: ["Descriptive Statistics", "Inferential Statistics", "Hypothesis Testing"] },
      { title: "Data Visualization", description: "Creating compelling visualizations", duration: "2 weeks", topics: ["Matplotlib", "Seaborn", "Dashboard Design"] },
      { title: "Predictive Analytics", description: "Building predictive models", duration: "2 weeks", topics: ["Regression", "Classification", "Time Series"] },
      { title: "Final Project", description: "End-to-end data science project", duration: "1 week", topics: ["Data Pipeline", "Analysis", "Reporting"] }
    ],
    outcomes: ["Perform statistical analysis", "Create data visualizations", "Build predictive models", "Communicate data insights"],
    prerequisites: ["No prior experience required"],
    features: ["Beginner-friendly", "Real-world datasets", "Portfolio project", "Job preparation support"],
    deliveryMode: "online",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Python Programming Bootcamp",
    category: "bootcamp",
    description: "Start your coding journey with Python, one of the most versatile and in-demand programming languages. Build practical projects from day one.",
    shortDescription: "Learn Python programming from scratch with hands-on projects.",
    duration: "6 weeks",
    level: "beginner",
    price: { amount: 349, currency: "USD" },
    modules: [
      { title: "Python Basics", description: "Core Python syntax and concepts", duration: "2 weeks", topics: ["Variables", "Data Types", "Control Flow"] },
      { title: "Functions & Modules", description: "Building reusable code", duration: "1 week", topics: ["Functions", "Modules", "Packages"] },
      { title: "Data Structures", description: "Working with complex data", duration: "1 week", topics: ["Lists", "Dictionaries", "Sets"] },
      { title: "Object-Oriented Programming", description: "OOP principles in Python", duration: "1 week", topics: ["Classes", "Inheritance", "Polymorphism"] },
      { title: "Projects Week", description: "Build complete Python applications", duration: "1 week", topics: ["CLI Apps", "Automation Scripts", "Data Projects"] }
    ],
    outcomes: ["Write Python programs", "Understand programming fundamentals", "Build automation scripts", "Prepare for advanced topics"],
    prerequisites: ["No coding experience needed", "Access to a computer"],
    features: ["Zero to hero curriculum", "Daily coding challenges", "Peer programming", "Certificate"],
    deliveryMode: "online",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Web Development Bootcamp",
    category: "bootcamp",
    description: "Build modern, responsive websites and web applications. Master HTML, CSS, JavaScript, and React to launch your career as a web developer.",
    shortDescription: "Master full-stack web development with modern technologies.",
    duration: "12 weeks",
    level: "beginner",
    price: { amount: 699, currency: "USD" },
    modules: [
      { title: "HTML & CSS Fundamentals", description: "Building web page structure and styling", duration: "2 weeks", topics: ["HTML5", "CSS3", "Responsive Design"] },
      { title: "JavaScript Essentials", description: "Programming for the web", duration: "3 weeks", topics: ["JS Basics", "DOM Manipulation", "Events"] },
      { title: "React Development", description: "Building modern web apps", duration: "4 weeks", topics: ["Components", "State", "Hooks", "Routing"] },
      { title: "Backend Basics", description: "Server-side development", duration: "2 weeks", topics: ["Node.js", "Express", "APIs"] },
      { title: "Capstone Project", description: "Build a full-stack application", duration: "1 week", topics: ["Planning", "Development", "Deployment"] }
    ],
    outcomes: ["Build responsive websites", "Create React applications", "Develop REST APIs", "Deploy web applications"],
    prerequisites: ["Basic computer skills"],
    features: ["Project-based learning", "Code reviews", "Portfolio development", "Career support"],
    deliveryMode: "hybrid",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Climate Tech & Sustainability Innovation Bootcamp",
    category: "climate",
    description: "Combine technology with environmental action. Learn to build solutions that address climate change using data analysis, IoT, and sustainable innovation frameworks.",
    shortDescription: "Build tech solutions for climate action and sustainability challenges.",
    duration: "8 weeks",
    level: "intermediate",
    price: { amount: 549, currency: "USD" },
    modules: [
      { title: "Climate Science Fundamentals", description: "Understanding climate systems", duration: "1 week", topics: ["Climate Data", "Environmental Indicators", "Impact Assessment"] },
      { title: "Data for Climate Action", description: "Analyzing environmental data", duration: "2 weeks", topics: ["Climate Datasets", "Visualization", "Trend Analysis"] },
      { title: "Sustainable Tech Solutions", description: "Building green technology", duration: "2 weeks", topics: ["IoT for Environment", "Energy Systems", "Waste Management"] },
      { title: "Innovation & Design", description: "Creating sustainable products", duration: "2 weeks", topics: ["Design Thinking", "Circular Economy", "Green Business"] },
      { title: "Climate Action Project", description: "Develop a climate solution", duration: "1 week", topics: ["Problem Definition", "Solution Development", "Impact Measurement"] }
    ],
    outcomes: ["Analyze climate data", "Design sustainable solutions", "Build environmental monitoring systems", "Lead climate innovation projects"],
    prerequisites: ["Basic programming knowledge", "Interest in sustainability"],
    features: ["Real environmental datasets", "Industry partnerships", "Impact-focused projects", "SDG alignment"],
    deliveryMode: "online",
    isFeatured: true,
    isActive: true
  },
  {
    title: "Climate Awareness Challenge (Ages 6-11)",
    category: "olympiad",
    description: "Young learners explore climate concepts through creative coding with Scratch. Build interactive stories and games about environmental protection.",
    shortDescription: "Introduction to coding and climate awareness for young learners.",
    duration: "6 weeks",
    level: "beginner",
    ageGroup: { min: 6, max: 11 },
    price: { amount: 199, currency: "USD" },
    modules: [
      { title: "Introduction to Climate", description: "Understanding our planet", duration: "1 week", topics: ["Earth Systems", "Weather vs Climate", "Living Green"] },
      { title: "Scratch Basics", description: "Learning to code with blocks", duration: "2 weeks", topics: ["Sprites", "Motion", "Events"] },
      { title: "Climate Stories", description: "Creating interactive narratives", duration: "2 weeks", topics: ["Storytelling", "Animation", "Sound"] },
      { title: "Competition Prep", description: "Preparing for the challenge", duration: "1 week", topics: ["Project Refinement", "Presentation Skills", "Judging Criteria"] }
    ],
    outcomes: ["Basic coding skills", "Climate awareness", "Creative problem-solving", "Presentation skills"],
    prerequisites: ["No prior experience needed", "Parent supervision recommended"],
    features: ["Age-appropriate content", "Fun activities", "Certificate", "Competition entry"],
    deliveryMode: "online",
    isActive: true
  },
  {
    title: "Climate Action App Challenge (Ages 11-14)",
    category: "olympiad",
    description: "Middle schoolers combine Python programming with web development to create apps that promote climate action in their communities.",
    shortDescription: "Build climate action apps using Python and web technologies.",
    duration: "8 weeks",
    level: "intermediate",
    ageGroup: { min: 11, max: 14 },
    price: { amount: 299, currency: "USD" },
    modules: [
      { title: "Climate Science", description: "Understanding environmental challenges", duration: "1 week", topics: ["Carbon Footprint", "Renewable Energy", "Biodiversity"] },
      { title: "Python Foundations", description: "Programming fundamentals", duration: "2 weeks", topics: ["Variables", "Loops", "Functions"] },
      { title: "Web Development Intro", description: "Building web pages", duration: "2 weeks", topics: ["HTML", "CSS", "Basic JS"] },
      { title: "App Development", description: "Creating climate apps", duration: "2 weeks", topics: ["App Design", "Data Display", "User Interface"] },
      { title: "Competition Preparation", description: "Finalizing projects", duration: "1 week", topics: ["Testing", "Documentation", "Pitch Preparation"] }
    ],
    outcomes: ["Python programming", "Web development basics", "App creation", "Climate advocacy skills"],
    prerequisites: ["Basic computer skills"],
    features: ["Mentorship", "Team collaboration", "Real-world impact", "Competition support"],
    deliveryMode: "online",
    isActive: true
  },
  {
    title: "Climate Data Analysis Challenge (Ages 14-19)",
    category: "olympiad",
    description: "Advanced students tackle real climate datasets using data science techniques. Compete to create the most impactful analysis and visualizations.",
    shortDescription: "Advanced climate data analysis for high school students.",
    duration: "10 weeks",
    level: "advanced",
    ageGroup: { min: 14, max: 19 },
    price: { amount: 399, currency: "USD" },
    modules: [
      { title: "Climate Science Deep Dive", description: "Advanced climate concepts", duration: "1 week", topics: ["Climate Models", "IPCC Reports", "Research Methods"] },
      { title: "Data Science Tools", description: "Python for data analysis", duration: "2 weeks", topics: ["Pandas", "NumPy", "Data Cleaning"] },
      { title: "Statistical Analysis", description: "Analyzing climate trends", duration: "2 weeks", topics: ["Time Series", "Correlation", "Regression"] },
      { title: "Visualization & Communication", description: "Presenting findings", duration: "2 weeks", topics: ["Matplotlib", "Plotly", "Storytelling with Data"] },
      { title: "Research Project", description: "Original climate research", duration: "3 weeks", topics: ["Hypothesis", "Analysis", "Publication"] }
    ],
    outcomes: ["Advanced data analysis", "Research methodology", "Scientific communication", "Competition readiness"],
    prerequisites: ["Programming experience", "Math proficiency"],
    features: ["Real climate datasets", "Research mentorship", "Publication opportunities", "University prep"],
    deliveryMode: "online",
    isActive: true
  },
  {
    title: "Digital Literacy for Teachers",
    category: "corporate",
    description: "Empower educators with essential digital skills. Learn to integrate technology into teaching, create digital content, and use educational tools effectively.",
    shortDescription: "Essential digital skills training for modern educators.",
    duration: "4 weeks",
    level: "beginner",
    price: { amount: 299, currency: "USD" },
    modules: [
      { title: "Digital Fundamentals", description: "Core digital skills", duration: "1 week", topics: ["Digital Tools", "Online Safety", "Cloud Computing"] },
      { title: "Educational Technology", description: "Tech for teaching", duration: "1 week", topics: ["LMS Platforms", "Interactive Tools", "Assessment Tech"] },
      { title: "Content Creation", description: "Creating digital learning materials", duration: "1 week", topics: ["Presentations", "Videos", "Interactive Content"] },
      { title: "Implementation", description: "Applying skills in classroom", duration: "1 week", topics: ["Lesson Planning", "Student Engagement", "Evaluation"] }
    ],
    outcomes: ["Digital tool proficiency", "Online teaching skills", "Content creation abilities", "Technology integration"],
    prerequisites: ["Basic computer skills"],
    features: ["Practical focus", "Peer learning", "Resource library", "Ongoing support"],
    deliveryMode: "hybrid",
    isActive: true
  },
  {
    title: "AI for Education Leaders",
    category: "corporate",
    description: "Strategic overview of AI in education for school administrators and education leaders. Understand opportunities, challenges, and implementation strategies.",
    shortDescription: "Strategic AI adoption guide for education leaders.",
    duration: "3 weeks",
    level: "beginner",
    price: { amount: 499, currency: "USD" },
    modules: [
      { title: "AI in Education Overview", description: "Understanding AI applications", duration: "1 week", topics: ["AI Basics", "EdTech Trends", "Case Studies"] },
      { title: "Strategic Planning", description: "Planning AI adoption", duration: "1 week", topics: ["Assessment", "Roadmap", "Change Management"] },
      { title: "Implementation & Ethics", description: "Responsible AI deployment", duration: "1 week", topics: ["Privacy", "Bias", "Best Practices"] }
    ],
    outcomes: ["AI literacy", "Strategic planning skills", "Risk awareness", "Implementation roadmap"],
    prerequisites: ["Leadership role in education"],
    features: ["Executive format", "Case studies", "Peer networking", "Action plan development"],
    deliveryMode: "online",
    isActive: true
  },
  {
    title: "Data Privacy & Cybersecurity",
    category: "corporate",
    description: "Protect your organization from cyber threats. Learn essential cybersecurity practices, data protection regulations, and incident response procedures.",
    shortDescription: "Essential cybersecurity training for organizations.",
    duration: "4 weeks",
    level: "intermediate",
    price: { amount: 599, currency: "USD" },
    modules: [
      { title: "Cybersecurity Fundamentals", description: "Understanding threats and defenses", duration: "1 week", topics: ["Threat Landscape", "Security Principles", "Risk Assessment"] },
      { title: "Data Protection", description: "Protecting sensitive information", duration: "1 week", topics: ["Encryption", "Access Control", "GDPR Compliance"] },
      { title: "Security Practices", description: "Implementing security measures", duration: "1 week", topics: ["Password Management", "Network Security", "Endpoint Protection"] },
      { title: "Incident Response", description: "Handling security incidents", duration: "1 week", topics: ["Detection", "Response Plan", "Recovery"] }
    ],
    outcomes: ["Security awareness", "Compliance knowledge", "Incident handling", "Risk management"],
    prerequisites: ["IT background helpful but not required"],
    features: ["Practical exercises", "Compliance focus", "Certification prep", "Security toolkit"],
    deliveryMode: "online",
    isActive: true
  },
  {
    title: "Emerging Tech Adoption",
    category: "corporate",
    description: "Stay ahead of the technology curve. Explore emerging technologies including AI, blockchain, IoT, and cloud computing with practical implementation strategies.",
    shortDescription: "Navigate emerging technologies for business innovation.",
    duration: "6 weeks",
    level: "intermediate",
    price: { amount: 699, currency: "USD" },
    modules: [
      { title: "Tech Landscape", description: "Overview of emerging technologies", duration: "1 week", topics: ["AI/ML", "Blockchain", "IoT", "Cloud"] },
      { title: "Business Applications", description: "Technology use cases", duration: "2 weeks", topics: ["Industry Applications", "ROI Analysis", "Vendor Evaluation"] },
      { title: "Implementation Strategy", description: "Planning tech adoption", duration: "2 weeks", topics: ["Pilot Programs", "Change Management", "Scaling"] },
      { title: "Future Planning", description: "Building tech capability", duration: "1 week", topics: ["Skills Development", "Innovation Culture", "Roadmapping"] }
    ],
    outcomes: ["Technology literacy", "Strategic evaluation skills", "Implementation planning", "Innovation mindset"],
    prerequisites: ["Business or technical background"],
    features: ["Industry experts", "Case studies", "Hands-on labs", "Strategy template"],
    deliveryMode: "online",
    isActive: true
  }
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Student",
    organization: "Lagos State University",
    content: "The AI Bootcamp transformed my career. I went from knowing nothing about machine learning to building my own models. The instructors are world-class!",
    rating: 5,
    category: "student",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Mohammed Al-Rashid",
    role: "Parent",
    organization: "Riyadh International School",
    content: "My daughter loved the Climate Awareness program. She now understands environmental issues and can even code! The curriculum is perfectly designed for young learners.",
    rating: 5,
    category: "parent",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Dr. Funke Adeyemi",
    role: "Principal",
    organization: "Greensprings School",
    content: "Pristine Education's corporate training program elevated our teachers' digital skills significantly. The practical approach made implementation seamless.",
    rating: 5,
    category: "school",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "James Okafor",
    role: "HR Director",
    organization: "TechCorp Nigeria",
    content: "The Cybersecurity training was exactly what our team needed. Professional delivery, relevant content, and immediate impact on our security practices.",
    rating: 5,
    category: "corporate",
    isApproved: true,
    isFeatured: true
  },
  {
    name: "Sarah Ibrahim",
    role: "Student",
    organization: "Age 15",
    content: "I won second place in the Climate Data Challenge! The program taught me real data science skills and how to make a difference for our planet.",
    rating: 5,
    category: "student",
    isApproved: true,
    isFeatured: true
  }
];

// Helper function to generate slug
const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pristine_education');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Program.deleteMany({});
    await Testimonial.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('Cleared existing data');

    // Add slugs to programs before inserting
    const programsWithSlugs = programs.map(prog => ({
      ...prog,
      slug: generateSlug(prog.title)
    }));

    // Insert programs
    await Program.insertMany(programsWithSlugs);
    console.log('Programs seeded successfully');

    // Insert testimonials
    await Testimonial.insertMany(testimonials);
    console.log('Testimonials seeded successfully');

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@pristineeducation.com',
      password: 'admin123456',
      role: 'admin'
    });
    console.log('Admin user created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
