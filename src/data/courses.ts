export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  isPremium: boolean;
  image: string;
  videos: Video[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  quiz: Quiz;
}

interface Quiz {
  questions: Question[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const courses: Course[] = [
  {
    id: "test-course",
    title: "Test Course",
    description: "This is a test course",
    duration: "1 hour",
    level: "Beginner",
    instructor: "Test Instructor",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    videos: [
      {
        id: "test-1",
        title: "Test Video 1",
        description: "This is test video 1",
        videoUrl: "test",
        quiz: {
          questions: [
            {
              id: 1,
              question: "Is this a test?",
              options: ["Yes", "No", "Maybe", "Not sure"],
              correctAnswer: 0
            }
          ]
        }
      }
    ]
  },
  {
    id: "javascript-basics",
    title: "JavaScript Fundamentals",
    description: "Master the basics of JavaScript programming",
    duration: "4 hours",
    level: "Beginner",
    instructor: "John Smith",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `js-${i + 1}`,
      title: `JavaScript Lesson ${i + 1}`,
      description: "Learn essential JavaScript concepts",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is JavaScript?",
            options: ["Programming Language", "Database", "Operating System", "Web Browser"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "python-programming",
    title: "Python Programming",
    description: "Learn Python from scratch",
    duration: "6 hours",
    level: "Beginner",
    instructor: "Sarah Johnson",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `python-${i + 1}`,
      title: `Python Basics ${i + 1}`,
      description: "Master Python fundamentals",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is Python?",
            options: ["Programming Language", "Snake", "Game", "Tool"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "react-fundamentals",
    title: "React.js Essentials",
    description: "Build modern web apps with React",
    duration: "5 hours",
    level: "Intermediate",
    instructor: "Mike Wilson",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `react-${i + 1}`,
      title: `React Basics ${i + 1}`,
      description: "Learn React components and hooks",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is React?",
            options: ["JS Library", "Database", "Programming Language", "Server"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "web-design",
    title: "Web Design Masterclass",
    description: "Create beautiful and responsive websites",
    duration: "8 hours",
    level: "Beginner",
    instructor: "Emma Davis",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `design-${i + 1}`,
      title: `Design Principles ${i + 1}`,
      description: "Master web design fundamentals",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is responsive design?",
            options: ["Adapts to screen size", "Fast loading", "Uses images", "Has colors"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "data-science",
    title: "Data Science Basics",
    description: "Introduction to data analysis",
    duration: "10 hours",
    level: "Intermediate",
    instructor: "David Brown",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `data-${i + 1}`,
      title: `Data Analysis ${i + 1}`,
      description: "Learn data science concepts",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is data science?",
            options: ["Analysis of data", "Web design", "Programming", "Gaming"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "mobile-dev",
    title: "Mobile App Development",
    description: "Build iOS and Android apps",
    duration: "12 hours",
    level: "Advanced",
    instructor: "Lisa Chen",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `mobile-${i + 1}`,
      title: `Mobile Development ${i + 1}`,
      description: "Create mobile applications",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is React Native?",
            options: ["Mobile framework", "Database", "Programming Language", "Server"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Introduction to AI and ML",
    duration: "15 hours",
    level: "Advanced",
    instructor: "Alex Turner",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `ml-${i + 1}`,
      title: `ML Concepts ${i + 1}`,
      description: "Learn machine learning basics",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is machine learning?",
            options: ["AI subset", "Database", "Programming Language", "Web design"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Basics",
    description: "Learn network security",
    duration: "8 hours",
    level: "Intermediate",
    instructor: "Robert White",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `security-${i + 1}`,
      title: `Security Fundamentals ${i + 1}`,
      description: "Master cybersecurity concepts",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is encryption?",
            options: ["Data protection", "Web design", "Programming", "Database"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "game-development",
    title: "Game Development",
    description: "Create your own games",
    duration: "10 hours",
    level: "Intermediate",
    instructor: "Chris Anderson",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1556438064-2d7646166914",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `game-${i + 1}`,
      title: `Game Dev Basics ${i + 1}`,
      description: "Learn game development",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is Unity?",
            options: ["Game engine", "Database", "Programming Language", "Web browser"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "blockchain",
    title: "Blockchain Technology",
    description: "Understanding cryptocurrency",
    duration: "6 hours",
    level: "Advanced",
    instructor: "James Wilson",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `blockchain-${i + 1}`,
      title: `Blockchain Basics ${i + 1}`,
      description: "Learn blockchain concepts",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is blockchain?",
            options: ["Distributed ledger", "Database", "Programming Language", "Web design"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    description: "Master AWS and Azure",
    duration: "12 hours",
    level: "Intermediate",
    instructor: "Maria Garcia",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `cloud-${i + 1}`,
      title: `Cloud Services ${i + 1}`,
      description: "Learn cloud platforms",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is AWS?",
            options: ["Cloud platform", "Database", "Programming Language", "Web browser"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "devops",
    title: "DevOps Engineering",
    description: "Learn CI/CD and automation",
    duration: "10 hours",
    level: "Advanced",
    instructor: "Tom Harris",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `devops-${i + 1}`,
      title: `DevOps Practices ${i + 1}`,
      description: "Master DevOps tools",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is CI/CD?",
            options: ["Continuous Integration", "Database", "Programming", "Web design"],
            correctAnswer: 0
          }
        ]
      }
    }))
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description: "Create amazing user experiences",
    duration: "8 hours",
    level: "Beginner",
    instructor: "Sophie Lee",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    videos: Array(4).fill(null).map((_, i) => ({
      id: `design-${i + 1}`,
      title: `UI/UX Principles ${i + 1}`,
      description: "Learn design thinking",
      videoUrl: "video-url",
      quiz: {
        questions: [
          {
            id: 1,
            question: "What is UX?",
            options: ["User Experience", "Programming", "Database", "Web browser"],
            correctAnswer: 0
          }
        ]
      }
    }))
  }
];
