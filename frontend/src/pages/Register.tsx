import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { RegisterCredentials } from '../types';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
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
                    <h2 className="h3 mb-2">Join Dulcinea-Art</h2>
                    <p className="text-muted">Create your artist account</p>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
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
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Bio (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself and your art..."
                        rows={3}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                            minLength={6}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="mb-4">
                      <Form.Text className="text-muted">
                        <small>
                          By registering, you agree to our Terms of Service and Privacy Policy. 
                          Your account will need to be approved by an administrator before you can start uploading artworks.
                        </small>
                      </Form.Text>
                    </div>

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
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    Sign in here
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

export default Register;
