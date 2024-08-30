import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './components/pages/MainPage';
import Rules from './components/pages/Rules';

function App(): JSX.Element {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <MainPage />,
        },
        {
          path: '/rules',
          element: <Rules />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
