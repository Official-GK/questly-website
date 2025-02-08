import { Topic } from '@/types/mockTest';

export const availableTopics: Topic[] = [
  {
    id: 'js',
    name: 'JavaScript',
    description: 'Core JavaScript concepts and modern features',
    subtopics: ['Basics', 'ES6+', 'Async Programming', 'DOM Manipulation']
  },
  {
    id: 'react',
    name: 'React',
    description: 'React fundamentals and advanced concepts',
    subtopics: ['Components', 'Hooks', 'State Management', 'Performance']
  },
  {
    id: 'ts',
    name: 'TypeScript',
    description: 'TypeScript fundamentals and best practices',
    subtopics: ['Types', 'Interfaces', 'Generics', 'Advanced Types']
  }
];
