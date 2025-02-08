interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed?: boolean;
  videoUrl?: string;
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

interface CourseTemplate {
  path: string;
  title: string;
  description: string;
  topics: string[];
  chapters: Chapter[];
}

export const courseTemplates: CourseTemplate[] = [
  {
    path: "/courses/nodejs-backend",
    title: "Node.js Backend Development",
    description: "Learn to build scalable backend services with Node.js. Master Express.js, MongoDB, RESTful APIs, and more.",
    topics: [
      "Express.js Framework",
      "MongoDB & Mongoose",
      "RESTful API Design",
      "Authentication & Authorization",
      "Error Handling",
      "Testing & Debugging",
      "Deployment & DevOps",
      "Performance Optimization"
    ],
    chapters: [
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
            }
          ]
        }
      }
    ]
  }
];

export type { CourseTemplate, Chapter };
