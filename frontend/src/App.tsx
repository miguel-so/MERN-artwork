import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import { AuthProvider } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Arts from './pages/Arts';
import ArtworkDetails from './pages/ArtworkDetails';
import ContactArtist from './pages/ContactArtist';
import Login from './pages/Login';
import Register from './pages/Register';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/arts" element={<Layout><Arts /></Layout>} />
              <Route path="/arts/:id" element={<Layout><ArtworkDetails /></Layout>} />
              <Route path="/arts/:id/contact" element={<Layout><ContactArtist /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes - Artist Dashboard */}
              <Route path="/artist/dashboard" element={<Layout><div>Artist Dashboard - Coming Soon</div></Layout>} />
              
              {/* Protected Routes - Admin Panel */}
              <Route path="/admin" element={<Layout><div>Admin Panel - Coming Soon</div></Layout>} />
              
              {/* 404 Route */}
              <Route path="*" element={<Layout><div>Page Not Found</div></Layout>} />
            </Routes>
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;