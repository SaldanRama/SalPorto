import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { WorkPage } from '@/pages/WorkPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { AboutPage } from '@/pages/AboutPage';
import { ExperiencePage } from '@/pages/ExperiencePage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'work',
        element: <WorkPage />,
      },
      {
        path: 'work/:slug',
        element: <ProjectDetailPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'experience',
        element: <ExperiencePage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
