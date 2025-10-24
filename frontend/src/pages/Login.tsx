import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <img
                      src="/assets/images/grayscale20on20transparent-169x128.png"
                      alt="Dulcinea-Art"
                      style={{ height: '4rem' }}
                      className="mb-3"
                    />
                    <h2 className="h3 mb-2">Welcome Back</h2>
                    <p className="text-muted">Sign in to your account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                    </Form.Group>

                    <div className="d-grid mb-3">
                      <Button
                        type="submit"
                        variant="success"
                        size="lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <Link to="/forgot-password" className="text-decoration-none">
                        Forgot your password?
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Sign up here
                  </Link>
                </p>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
