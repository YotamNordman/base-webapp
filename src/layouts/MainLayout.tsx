import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../components/common/layout';

// Route wrapper component that applies the layout
const MainLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default MainLayout;