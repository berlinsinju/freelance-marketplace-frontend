import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthSuccess from './pages/OAuthSuccess';
import BrowseFreelancers from './pages/BrowseFreelancers';
import BrowseJobs from './pages/BrowseJobs';
import ServiceDetail from './pages/ServiceDetail';
import ServiceForm from './pages/ServiceForm';
import JobDetail from './pages/JobDetail';
import JobForm from './pages/JobForm';
import PublicProfile from './pages/PublicProfile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/Dashboard';
import ContractDetail from './pages/ContractDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/freelancers" element={<BrowseFreelancers />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/profile/:id" element={<PublicProfile />} />

          <Route path="/services/new" element={<PrivateRoute role="freelancer"><ServiceForm /></PrivateRoute>} />
          <Route path="/services/:id/edit" element={<PrivateRoute role="freelancer"><ServiceForm /></PrivateRoute>} />
          <Route path="/jobs/new" element={<PrivateRoute role="client"><JobForm /></PrivateRoute>} />
          <Route path="/jobs/:id/edit" element={<PrivateRoute role="client"><JobForm /></PrivateRoute>} />

          <Route path="/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/contracts/:id" element={<PrivateRoute><ContractDetail /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
