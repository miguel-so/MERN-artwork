import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email/${verificationToken}`, {
        method: 'GET'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Email verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <Card.Header className="text-center">
                <h4>Email Verification</h4>
              </Card.Header>
              <Card.Body className="text-center">
                {loading && (
                  <div>
                    <Spinner animation="border" role="status" className="mb-3">
                      <span className="visually-hidden">Verifying...</span>
                    </Spinner>
                    <p>Verifying your email address...</p>
                  </div>
                )}

                {message && (
                  <Alert variant="success">
                    {message}
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                {!loading && !error && (
                  <div className="mt-3">
                    <Link to="/login" className="btn btn-primary">
                      Go to Login
                    </Link>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
