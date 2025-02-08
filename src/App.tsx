import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import Chatbot from "./components/ChatBot";
import { Layout } from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import RegisterFlow from "./components/auth/RegisterFlow";
import Index from "./pages/Index";
import Dashboard from "@/pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AI from "./pages/AI";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/subscription/success";
import SubscriptionCancel from "./pages/subscription/cancel";
import Flashcards from "./pages/Flashcards";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import MockTest from "./pages/MockTest";
import StudyGroups from "./pages/study-groups/StudyGroups";
import CreateGroup from "./pages/study-groups/CreateGroup";
import JoinGroup from "./pages/study-groups/JoinGroup";
import GroupDetail from "./pages/study-groups/GroupDetail";
import { ChittiAI } from './components/ChittiAI';
import CourseRoutes from "@/components/courses/CourseRoutes";
import ChapterVideo from '@/pages/courses/ChapterVideo';
import CourseTemplate from "@/components/courses/CourseTemplate";
import CourseContent from '@/pages/CourseContent';

const queryClient = new QueryClient();

function AuthRedirect() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return currentUser ? <Navigate to="/dashboard" replace /> : <Index />;
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-[#060913]">
              <Navigation />
              <Layout>
                <div className="pt-16">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<AuthRedirect />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterFlow />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/leaderboard" element={
                      <ProtectedRoute>
                        <Leaderboard /> 
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai" element={
                      <ProtectedRoute>
                        <AI />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription" element={
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription/success" element={
                      <ProtectedRoute>
                        <SubscriptionSuccess />
                      </ProtectedRoute>
                    } />
                    <Route path="/subscription/cancel" element={
                      <ProtectedRoute>
                        <SubscriptionCancel />
                      </ProtectedRoute>
                    } />
                    <Route path="/flashcards" element={
                      <ProtectedRoute>
                        <Flashcards />
                      </ProtectedRoute>
                    } />
                    <Route path="/summary" element={
                      <ProtectedRoute>
                        <Summary />
                      </ProtectedRoute>
                    } />
                    <Route path="/quiz" element={
                      <ProtectedRoute>
                        <Quiz />
                      </ProtectedRoute>
                    } />
                    <Route path="/mock-test" element={<ProtectedRoute><MockTest /></ProtectedRoute>} />
                    <Route path="/courses" element={
                      <ProtectedRoute>
                        <CourseRoutes />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/nodejs-backend" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Node.js Backend Development"
                          description="Learn to build scalable backend services with Node.js. Master Express.js, MongoDB, RESTful APIs, and more."
                          topics={[
                            "Express.js Framework",
                            "MongoDB & Mongoose",
                            "RESTful API Design",
                            "Authentication & Authorization",
                            "Error Handling",
                            "Testing & Debugging",
                            "Deployment & DevOps",
                            "Performance Optimization"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Node.js",
                              description: "Learn the basics of Node.js and its ecosystem",
                              duration: "45 minutes",
                              videoUrl: "https://example.com/videos/nodejs-intro",
                              completed: false,
                              quiz: {
                                questions: [
                                  {
                                    question: "What is Node.js?",
                                    options: [
                                      "A browser-based JavaScript runtime",
                                      "A server-side JavaScript runtime",
                                      "A database management system",
                                      "A front-end framework"
                                    ],
                                    correctAnswer: 1
                                  },
                                  {
                                    question: "What is npm?",
                                    options: [
                                      "Node Package Manager",
                                      "New Project Manager",
                                      "Node Process Monitor",
                                      "Node Project Module"
                                    ],
                                    correctAnswer: 0
                                  }
                                ]
                              }
                            },
                            {
                              id: 2,
                              title: "Express.js Fundamentals",
                              description: "Build web applications with Express.js",
                              duration: "1 hour",
                              videoUrl: "https://example.com/videos/expressjs",
                              completed: false,
                              quiz: {
                                questions: [
                                  {
                                    question: "What is middleware in Express.js?",
                                    options: [
                                      "A database connection",
                                      "A function that has access to request and response objects",
                                      "A routing mechanism",
                                      "A template engine"
                                    ],
                                    correctAnswer: 1
                                  }
                                ]
                              }
                            },
                            {
                              id: 3,
                              title: "Database Integration",
                              description: "Work with MongoDB and Mongoose",
                              duration: "1.5 hours",
                              videoUrl: "https://example.com/videos/mongodb",
                              completed: false,
                              quiz: {
                                questions: [
                                  {
                                    question: "What is MongoDB?",
                                    options: [
                                      "A SQL database",
                                      "A NoSQL database",
                                      "A file system",
                                      "A caching system"
                                    ],
                                    correctAnswer: 1
                                  }
                                ]
                              }
                            },
                            {
                              id: 4,
                              title: "API Development",
                              description: "Create RESTful APIs",
                              duration: "2 hours",
                              videoUrl: "https://example.com/videos/rest-api",
                              completed: false,
                              quiz: {
                                questions: [
                                  {
                                    question: "What is REST?",
                                    options: [
                                      "A programming language",
                                      "A database",
                                      "An architectural style for APIs",
                                      "A framework"
                                    ],
                                    correctAnswer: 2
                                  }
                                ]
                              }
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/machine-learning" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Machine Learning Basics"
                          description="Get started with machine learning algorithms and concepts. Learn about data preprocessing, model training, and evaluation."
                          topics={[
                            "Data Preprocessing",
                            "Supervised Learning",
                            "Unsupervised Learning",
                            "Model Evaluation",
                            "Feature Engineering",
                            "Neural Networks",
                            "Deep Learning",
                            "Model Deployment"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to ML",
                              description: "Understanding machine learning concepts",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/ml-intro"
                            },
                            {
                              id: 2,
                              title: "Data Preparation",
                              description: "Learn data preprocessing techniques",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/data-prep"
                            },
                            {
                              id: 3,
                              title: "Model Training",
                              description: "Train and evaluate ML models",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/model-training"
                            },
                            {
                              id: 4,
                              title: "Advanced Topics",
                              description: "Deep learning and deployment",
                              duration: "2.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/advanced-ml"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/aws-cloud" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="AWS Cloud Computing"
                          description="Master cloud computing with Amazon Web Services. Learn about EC2, S3, Lambda, and more."
                          topics={[
                            "AWS Fundamentals",
                            "EC2 & Virtual Machines",
                            "S3 Storage Solutions",
                            "Lambda Functions",
                            "Database Services",
                            "Networking & Security",
                            "Monitoring & Logging",
                            "Cost Management"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "AWS Basics",
                              description: "Introduction to AWS services",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/aws-basics"
                            },
                            {
                              id: 2,
                              title: "Compute Services",
                              description: "Work with EC2 and Lambda",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/aws-compute"
                            },
                            {
                              id: 3,
                              title: "Storage & Database",
                              description: "Learn S3 and RDS",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/aws-storage"
                            },
                            {
                              id: 4,
                              title: "DevOps on AWS",
                              description: "CI/CD and deployment",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/aws-devops"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/mobile-dev" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Mobile App Development"
                          description="Learn to build mobile apps with React Native, Flutter, or native iOS and Android development."
                          topics={[
                            "Mobile App Fundamentals",
                            "React Native Development",
                            "Flutter Development",
                            "Native iOS Development",
                            "Native Android Development",
                            "Mobile App Design",
                            "Mobile App Testing",
                            "Mobile App Deployment"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Mobile App Development",
                              description: "Learn the basics of mobile app development",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/mobile-dev-intro"
                            },
                            {
                              id: 2,
                              title: "React Native Fundamentals",
                              description: "Build mobile apps with React Native",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/react-native"
                            },
                            {
                              id: 3,
                              title: "Flutter Fundamentals",
                              description: "Build mobile apps with Flutter",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/flutter"
                            },
                            {
                              id: 4,
                              title: "Native Mobile App Development",
                              description: "Build native mobile apps for iOS and Android",
                              duration: "3 hours",
                              completed: false,
                              videoUrl: "https://example.com/native-mobile-dev"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/devops" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="DevOps Essentials"
                          description="Learn the fundamentals of DevOps and how to implement it in your organization."
                          topics={[
                            "DevOps Fundamentals",
                            "Agile Development",
                            "Continuous Integration",
                            "Continuous Deployment",
                            "Continuous Monitoring",
                            "Infrastructure as Code",
                            "Containerization",
                            "Orchestration"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to DevOps",
                              description: "Learn the basics of DevOps",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/devops-intro"
                            },
                            {
                              id: 2,
                              title: "Agile Development",
                              description: "Learn Agile development methodologies",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/agile-dev"
                            },
                            {
                              id: 3,
                              title: "CI/CD Pipelines",
                              description: "Learn to implement CI/CD pipelines",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/cicd"
                            },
                            {
                              id: 4,
                              title: "Infrastructure as Code",
                              description: "Learn to manage infrastructure with code",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/iac"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/cyber-security" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Cybersecurity Fundamentals"
                          description="Learn the basics of cybersecurity and how to protect your organization from cyber threats."
                          topics={[
                            "Cybersecurity Fundamentals",
                            "Network Security",
                            "Cloud Security",
                            "Endpoint Security",
                            "Application Security",
                            "Data Security",
                            "Compliance and Risk Management",
                            "Incident Response"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Cybersecurity",
                              description: "Learn the basics of cybersecurity",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/cybersecurity-intro"
                            },
                            {
                              id: 2,
                              title: "Network Security",
                              description: "Learn to secure your network",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/network-security"
                            },
                            {
                              id: 3,
                              title: "Cloud Security",
                              description: "Learn to secure your cloud infrastructure",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/cloud-security"
                            },
                            {
                              id: 4,
                              title: "Endpoint Security",
                              description: "Learn to secure your endpoints",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/endpoint-security"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/blockchain" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Blockchain Development"
                          description="Learn to build blockchain applications with Ethereum, Hyperledger, and more."
                          topics={[
                            "Blockchain Fundamentals",
                            "Ethereum Development",
                            "Hyperledger Development",
                            "Smart Contract Development",
                            "Blockchain Security",
                            "Blockchain Scalability",
                            "Blockchain Interoperability",
                            "Blockchain Use Cases"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Blockchain",
                              description: "Learn the basics of blockchain",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/blockchain-intro"
                            },
                            {
                              id: 2,
                              title: "Ethereum Fundamentals",
                              description: "Build blockchain applications with Ethereum",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/ethereum"
                            },
                            {
                              id: 3,
                              title: "Hyperledger Fundamentals",
                              description: "Build blockchain applications with Hyperledger",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/hyperledger"
                            },
                            {
                              id: 4,
                              title: "Smart Contract Development",
                              description: "Learn to develop smart contracts",
                              duration: "2.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/smart-contracts"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/data-structures" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Data Structures & Algorithms"
                          description="Learn to implement data structures and algorithms in your programming language of choice."
                          topics={[
                            "Data Structures Fundamentals",
                            "Arrays",
                            "Linked Lists",
                            "Stacks",
                            "Queues",
                            "Trees",
                            "Graphs",
                            "Algorithms"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Data Structures",
                              description: "Learn the basics of data structures",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/data-structures-intro"
                            },
                            {
                              id: 2,
                              title: "Arrays and Linked Lists",
                              description: "Learn to implement arrays and linked lists",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/arrays-linked-lists"
                            },
                            {
                              id: 3,
                              title: "Trees and Graphs",
                              description: "Explore tree and graph data structures",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/trees-graphs"
                            },
                            {
                              id: 4,
                              title: "Sorting Algorithms",
                              description: "Learn various sorting algorithms and their complexity",
                              duration: "2.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/sorting-algorithms"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/flutter" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Flutter Development"
                          description="Learn to build mobile apps with Flutter."
                          topics={[
                            "Flutter Fundamentals",
                            "Widget Development",
                            "Layout and Design",
                            "Navigation and Routing",
                            "State Management",
                            "API Integration",
                            "Testing and Debugging",
                            "Deployment"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Flutter",
                              description: "Learn the basics of Flutter",
                              duration: "1 hour",
                              completed: false,
                              videoUrl: "https://example.com/flutter-intro"
                            },
                            {
                              id: 2,
                              title: "Widget Development",
                              description: "Learn to build custom widgets",
                              duration: "1.5 hours",
                              completed: false,
                              videoUrl: "https://example.com/flutter-widgets"
                            },
                            {
                              id: 3,
                              title: "Layout and Design",
                              description: "Learn to design and layout your app",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/flutter-layout"
                            },
                            {
                              id: 4,
                              title: "Navigation and Routing",
                              description: "Learn to navigate and route your app",
                              duration: "2 hours",
                              completed: false,
                              videoUrl: "https://example.com/flutter-navigation"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/sql-database" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="SQL & Database Design"
                          description="Learn to design and implement databases with SQL."
                          topics={[
                            "SQL Fundamentals",
                            "Database Design",
                            "Data Modeling",
                            "Data Normalization",
                            "Querying and Indexing",
                            "Database Security",
                            "Database Performance",
                            "Database Scalability"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to SQL",
                              description: "Learn the basics of SQL",
                              videoUrl: "https://example.com/sql-intro",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Database Design",
                              description: "Learn to design databases",
                              videoUrl: "https://example.com/database-design",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Data Modeling",
                              description: "Learn to model data",
                              videoUrl: "https://example.com/data-modeling",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Querying and Indexing",
                              description: "Learn to query and index data",
                              videoUrl: "https://example.com/querying-indexing",
                              completed: false,
                              duration: "2 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/web3" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Web3 Development"
                          description="Learn to build decentralized applications with Web3 technologies."
                          topics={[
                            "Web3 Fundamentals",
                            "Blockchain Development",
                            "Smart Contract Development",
                            "Decentralized Finance",
                            "Non-Fungible Tokens",
                            "Decentralized Autonomous Organizations",
                            "Web3 Security",
                            "Web3 Scalability"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to Web3",
                              description: "Learn the basics of Web3",
                              videoUrl: "https://example.com/web3-intro",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Blockchain Development",
                              description: "Learn to build blockchain applications",
                              videoUrl: "https://example.com/blockchain-dev",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 3,
                              title: "Smart Contract Development",
                              description: "Learn to develop smart contracts",
                              videoUrl: "https://example.com/smart-contracts",
                              completed: false,
                              duration: "2.5 hours"
                            },
                            {
                              id: 4,
                              title: "Decentralized Finance",
                              description: "Learn about decentralized finance",
                              videoUrl: "https://example.com/decentralized-finance",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/video" element={
                      <ProtectedRoute>
                        <ChapterVideo />
                      </ProtectedRoute>
                    } />

                    <Route path="/courses/web-development" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Web Development Fundamentals"
                          description="Learn the basics of web development, including HTML, CSS, and JavaScript."
                          topics={[
                            "HTML Fundamentals",
                            "CSS Styling",
                            "JavaScript Basics",
                            "Responsive Design",
                            "Front-end Frameworks",
                            "Back-end Development",
                            "Database Integration",
                            "Web Security"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to HTML",
                              description: "Learn the basics of HTML structure and elements",
                              videoUrl: "https://example.com/intro-html",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "CSS Styling",
                              description: "Master CSS styling and layouts",
                              videoUrl: "https://example.com/css-styling",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "JavaScript Basics",
                              description: "Get started with JavaScript programming",
                              videoUrl: "https://example.com/js-basics",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Responsive Design",
                              description: "Create responsive websites that work on all devices",
                              videoUrl: "https://example.com/responsive",
                              completed: false,
                              duration: "1.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/data-structures-and-algorithms" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Data Structures and Algorithms"
                          description="Master the fundamental data structures and algorithms in computer science."
                          topics={[
                            "Data Structures Fundamentals",
                            "Arrays",
                            "Linked Lists",
                            "Stacks",
                            "Queues",
                            "Trees",
                            "Graphs",
                            "Algorithms"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Arrays and Strings",
                              description: "Understanding arrays and string manipulation",
                              videoUrl: "https://example.com/arrays",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Linked Lists",
                              description: "Learn about linked lists and their operations",
                              videoUrl: "https://example.com/linked-lists",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Trees and Graphs",
                              description: "Explore tree and graph data structures",
                              videoUrl: "https://example.com/trees",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Sorting Algorithms",
                              description: "Learn various sorting algorithms and their complexity",
                              videoUrl: "https://example.com/sorting",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/machine-learning-basics" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Machine Learning Basics"
                          description="Introduction to machine learning concepts and algorithms."
                          topics={[
                            "Machine Learning Fundamentals",
                            "Supervised Learning",
                            "Unsupervised Learning",
                            "Model Evaluation",
                            "Feature Engineering",
                            "Neural Networks",
                            "Deep Learning",
                            "Model Deployment"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to ML",
                              description: "Basic concepts and types of machine learning",
                              videoUrl: "https://example.com/intro-ml",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Linear Regression",
                              description: "Understanding linear regression and its applications",
                              videoUrl: "https://example.com/linear-regression",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Classification",
                              description: "Learn about classification algorithms",
                              videoUrl: "https://example.com/classification",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Neural Networks",
                              description: "Introduction to neural networks",
                              videoUrl: "https://example.com/neural-networks",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />

                    <Route path="/courses/system-design" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="System Design"
                          description="Learn how to design scalable systems and architectures."
                          topics={[
                            "System Design Fundamentals",
                            "Scalability",
                            "Performance",
                            "Reliability",
                            "Distributed Systems",
                            "Microservices",
                            "Load Balancing",
                            "Caching"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "System Design Basics",
                              description: "Fundamental concepts of system design",
                              videoUrl: "https://example.com/system-design-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Scalability",
                              description: "Understanding scalability patterns",
                              videoUrl: "https://example.com/scalability",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Database Design",
                              description: "Learn about database architecture and design",
                              videoUrl: "https://example.com/database-design",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Microservices",
                              description: "Introduction to microservices architecture",
                              videoUrl: "https://example.com/microservices",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/cloud-computing" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Cloud Computing"
                          description="Master cloud computing concepts and services."
                          topics={[
                            "Cloud Fundamentals",
                            "AWS Services",
                            "Azure Services",
                            "Cloud Security",
                            "Serverless",
                            "Containers",
                            "Cloud Storage",
                            "Cloud Networking"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Cloud Fundamentals",
                              description: "Basic concepts of cloud computing",
                              videoUrl: "https://example.com/cloud-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "AWS Services",
                              description: "Overview of key AWS services",
                              videoUrl: "https://example.com/aws-services",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Cloud Security",
                              description: "Understanding cloud security principles",
                              videoUrl: "https://example.com/cloud-security",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Serverless Computing",
                              description: "Introduction to serverless architecture",
                              videoUrl: "https://example.com/serverless",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/devops" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="DevOps Practices"
                          description="Learn modern DevOps practices and tools."
                          topics={[
                            "DevOps Fundamentals",
                            "CI/CD",
                            "Containers",
                            "Infrastructure as Code",
                            "Monitoring",
                            "Automation",
                            "Version Control",
                            "Configuration Management"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "DevOps Introduction",
                              description: "Understanding DevOps principles",
                              videoUrl: "https://example.com/devops-intro",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "CI/CD",
                              description: "Continuous Integration and Deployment",
                              videoUrl: "https://example.com/cicd",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Container Technologies",
                              description: "Docker and container orchestration",
                              videoUrl: "https://example.com/containers",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Infrastructure as Code",
                              description: "Learn about infrastructure automation",
                              videoUrl: "https://example.com/iac",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/mobile-development" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Mobile App Development"
                          description="Build mobile applications for iOS and Android."
                          topics={[
                            "Mobile Development Basics",
                            "UI/UX Design",
                            "React Native",
                            "Native Development",
                            "App Testing",
                            "App Publishing",
                            "App Security",
                            "App Monetization"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Mobile Development Basics",
                              description: "Introduction to mobile app development",
                              videoUrl: "https://example.com/mobile-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "UI/UX Design",
                              description: "Design principles for mobile apps",
                              videoUrl: "https://example.com/mobile-design",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "React Native",
                              description: "Cross-platform development with React Native",
                              videoUrl: "https://example.com/react-native",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "App Publishing",
                              description: "Publishing apps to app stores",
                              videoUrl: "https://example.com/app-publishing",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/cybersecurity" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Cybersecurity Fundamentals"
                          description="Learn essential cybersecurity concepts and practices."
                          topics={[
                            "Security Fundamentals",
                            "Network Security",
                            "Web Security",
                            "Cryptography",
                            "Ethical Hacking",
                            "Security Tools",
                            "Incident Response",
                            "Security Compliance"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Security Basics",
                              description: "Fundamental security concepts",
                              videoUrl: "https://example.com/security-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Network Security",
                              description: "Understanding network security",
                              videoUrl: "https://example.com/network-security",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Web Security",
                              description: "Web application security principles",
                              videoUrl: "https://example.com/web-security",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Ethical Hacking",
                              description: "Introduction to ethical hacking",
                              videoUrl: "https://example.com/ethical-hacking",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />

                    <Route path="/courses/ui-ux-design" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="UI/UX Design"
                          description="Master the principles of user interface and experience design."
                          topics={[
                            "Design Fundamentals",
                            "User Research",
                            "Wireframing",
                            "Prototyping",
                            "Visual Design",
                            "Interaction Design",
                            "Usability Testing",
                            "Design Systems"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Design Principles",
                              description: "Learn fundamental design principles and theory",
                              videoUrl: "https://example.com/design-principles",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "User Research",
                              description: "Master user research and analysis techniques",
                              videoUrl: "https://example.com/user-research",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Prototyping",
                              description: "Create interactive prototypes and wireframes",
                              videoUrl: "https://example.com/prototyping",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Design Systems",
                              description: "Build and maintain design systems",
                              videoUrl: "https://example.com/design-systems",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/blockchain" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Blockchain Development"
                          description="Learn to build decentralized applications and smart contracts."
                          topics={[
                            "Blockchain Basics",
                            "Smart Contracts",
                            "DApp Development",
                            "Web3",
                            "Solidity",
                            "Ethereum",
                            "NFTs",
                            "DeFi"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Blockchain Fundamentals",
                              description: "Understanding blockchain technology",
                              videoUrl: "https://example.com/blockchain-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Smart Contracts",
                              description: "Writing and deploying smart contracts",
                              videoUrl: "https://example.com/smart-contracts",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "DApp Development",
                              description: "Building decentralized applications",
                              videoUrl: "https://example.com/dapp-dev",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Web3 Integration",
                              description: "Integrating Web3 with applications",
                              videoUrl: "https://example.com/web3",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/game-development" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Game Development"
                          description="Create engaging games using modern game development frameworks."
                          topics={[
                            "Game Design",
                            "Unity",
                            "3D Graphics",
                            "Game Physics",
                            "Animation",
                            "Game AI",
                            "Sound Design",
                            "Multiplayer"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Game Design Basics",
                              description: "Learn game design principles",
                              videoUrl: "https://example.com/game-design",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Unity Fundamentals",
                              description: "Getting started with Unity",
                              videoUrl: "https://example.com/unity-basics",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Game Physics",
                              description: "Implementing game physics",
                              videoUrl: "https://example.com/game-physics",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Game AI",
                              description: "Creating intelligent game characters",
                              videoUrl: "https://example.com/game-ai",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/data-science" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Data Science"
                          description="Master data analysis, visualization, and statistical methods."
                          topics={[
                            "Data Analysis",
                            "Python",
                            "Statistics",
                            "Visualization",
                            "Pandas",
                            "NumPy",
                            "SQL",
                            "Big Data"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Data Analysis Fundamentals",
                              description: "Learn basic data analysis techniques",
                              videoUrl: "https://example.com/data-analysis",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Python for Data Science",
                              description: "Using Python for data analysis",
                              videoUrl: "https://example.com/python-data",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Data Visualization",
                              description: "Creating effective data visualizations",
                              videoUrl: "https://example.com/data-viz",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "Statistical Analysis",
                              description: "Applying statistical methods",
                              videoUrl: "https://example.com/statistics",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/artificial-intelligence" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Artificial Intelligence"
                          description="Explore AI concepts, neural networks, and deep learning."
                          topics={[
                            "AI Fundamentals",
                            "Neural Networks",
                            "Deep Learning",
                            "Computer Vision",
                            "NLP",
                            "TensorFlow",
                            "PyTorch",
                            "AI Ethics"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "AI Fundamentals",
                              description: "Understanding AI concepts",
                              videoUrl: "https://example.com/ai-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Neural Networks",
                              description: "Building neural networks",
                              videoUrl: "https://example.com/neural-networks",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Deep Learning",
                              description: "Advanced deep learning concepts",
                              videoUrl: "https://example.com/deep-learning",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "AI Applications",
                              description: "Real-world AI applications",
                              videoUrl: "https://example.com/ai-apps",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />
                    <Route path="/courses/software-testing" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="Software Testing"
                          description="Learn modern testing methodologies and automation frameworks."
                          topics={[
                            "Testing Basics",
                            "Test Automation",
                            "Unit Testing",
                            "Integration Testing",
                            "E2E Testing",
                            "Performance Testing",
                            "Security Testing",
                            "CI/CD Testing"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Testing Fundamentals",
                              description: "Learn software testing basics",
                              videoUrl: "https://example.com/testing-basics",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Test Automation",
                              description: "Automating software tests",
                              videoUrl: "https://example.com/test-automation",
                              completed: false,
                              duration: "1.5 hours"
                            },
                            {
                              id: 3,
                              title: "Integration Testing",
                              description: "Writing integration tests",
                              videoUrl: "https://example.com/integration-testing",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 4,
                              title: "E2E Testing",
                              description: "End-to-end testing strategies",
                              videoUrl: "https://example.com/e2e-testing",
                              completed: false,
                              duration: "2.5 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />

                    <Route path="/courses/:courseId" element={<CourseContent />} />

                    <Route path="/courses/ai-development" element={
                      <ProtectedRoute>
                        <CourseTemplate 
                          title="AI Development"
                          description="Learn to build AI-powered applications and understand core AI concepts."
                          topics={[
                            "AI Fundamentals",
                            "Machine Learning Basics",
                            "Neural Networks",
                            "Deep Learning",
                            "Natural Language Processing",
                            "Computer Vision",
                            "Reinforcement Learning",
                            "AI Ethics"
                          ]}
                          chapters={[
                            {
                              id: 1,
                              title: "Introduction to AI Development",
                              description: "Understanding core AI concepts and development principles",
                              videoUrl: "https://example.com/ai-dev-intro",
                              completed: false,
                              duration: "1 hour"
                            },
                            {
                              id: 2,
                              title: "Building ML Models",
                              description: "Learn to create and train machine learning models",
                              videoUrl: "https://example.com/ml-models",
                              completed: false,
                              duration: "2 hours"
                            },
                            {
                              id: 3,
                              title: "Neural Networks & Deep Learning",
                              description: "Implement neural networks and understand deep learning concepts",
                              videoUrl: "https://example.com/neural-networks-deep",
                              completed: false,
                              duration: "2.5 hours"
                            },
                            {
                              id: 4,
                              title: "Advanced AI Applications",
                              description: "Build practical AI applications with modern frameworks",
                              videoUrl: "https://example.com/advanced-ai",
                              completed: false,
                              duration: "2 hours"
                            }
                          ]}
                        />
                      </ProtectedRoute>
                    } />

                    {/* Course Routes */}
                    <Route path="/courses/*" element={<ProtectedRoute><CourseRoutes /></ProtectedRoute>} />

                    {/* Study Group Routes */}
                    <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
                    <Route path="/study-groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
                    <Route path="/study-groups/join" element={<ProtectedRoute><JoinGroup /></ProtectedRoute>} />
                    <Route path="/study-groups/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </Layout>
              <Chatbot />
              <ChittiAI />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;