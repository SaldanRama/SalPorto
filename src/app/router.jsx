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
import { Suspense, lazy } from 'react';

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const StudioPage = lazy(() => import('@/pages/admin/StudioPage'));

const AdminFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#101112',
      color: '#8e96a4',
      fontFamily: 'sans-serif',
      fontSize: '0.95rem',
      letterSpacing: '0.02em',
    }}
  >
    <span>Loading Sanity Studio...</span>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      <Suspense fallback={<AdminFallback />}>
        <AdminDashboardPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/studio/*',
    element: (
      <Suspense fallback={<AdminFallback />}>
        <StudioPage />
      </Suspense>
    ),
  },
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
