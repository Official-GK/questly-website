import React from 'react';
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Courses from "@/pages/Courses";
import CourseContent from "@/pages/CourseContent";
import ChapterVideo from "@/pages/courses/ChapterVideo";
import CourseTemplate from "@/components/courses/CourseTemplate";
import { courseTemplates } from "@/data/courseTemplates";

const CourseRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Course Routes */}
      <Route index element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path=":courseId" element={<ProtectedRoute><CourseContent /></ProtectedRoute>} />
      <Route path=":courseId/chapter/:chapterId" element={<ProtectedRoute><ChapterVideo /></ProtectedRoute>} />

      {/* Course Template Routes */}
      {courseTemplates.map(template => (
        <Route 
          key={template.path}
          path={template.path.replace('/courses/', '')}
          element={
            <ProtectedRoute>
              <CourseTemplate 
                title={template.title}
                description={template.description}
                topics={template.topics}
                chapters={template.chapters}
              />
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
};

export default CourseRoutes;
