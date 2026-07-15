import React from 'react';
import { useAuth } from '../context/AuthContext';
import FreelancerDashboard from './FreelancerDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />;
};

export default Dashboard;
