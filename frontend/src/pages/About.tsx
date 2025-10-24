import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="py-5">
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-4 fw-bold mb-4">About Dulcinea-Art</h1>
              <p className="lead text-muted">
                Connecting artists with art lovers around the world
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <h2 className="h3 mb-4">Our Mission</h2>
                  <p className="lead mb-4">
                    Dulcinea-Art is a platform dedicated to showcasing the incredible talent 
                    of artists from around the world. We believe that art has the power to 
                    inspire, connect, and transform lives.
                  </p>
                  <p className="mb-4">
                    Our mission is to create a space where artists can share their work with 
                    a global audience, and where art lovers can discover and connect with 
                    the creators behind the pieces they love.
                  </p>
                  <p className="mb-0">
                    Whether you're an established artist looking to reach new audiences, 
                    or an art enthusiast searching for your next favorite piece, 
                    Dulcinea-Art is here to bring the art world together.
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="fa fa-palette fa-3x text-primary"></i>
                  </div>
                  <h4 className="h5 mb-3">For Artists</h4>
                  <p className="text-muted">
                    Showcase your artwork to a global audience, manage your portfolio, 
                    and connect directly with potential buyers and art enthusiasts.
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="fa fa-heart fa-3x text-danger"></i>
                  </div>
                  <h4 className="h5 mb-3">For Art Lovers</h4>
                  <p className="text-muted">
                    Discover amazing artworks from talented artists, save your favorites, 
                    and connect directly with artists to learn more about their work.
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-100 border-0 shadow-sm text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <i className="fa fa-shield-alt fa-3x text-success"></i>
                  </div>
                  <h4 className="h5 mb-3">Secure & Protected</h4>
                  <p className="text-muted">
                    All artworks are protected with right-click and download prevention, 
                    ensuring artists' intellectual property is respected and secured.
                  </p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="border-0" style={{ background: 'linear-gradient(135deg, #f1ffe9 0%, #e7f3ff 100%)' }}>
                <Card.Body className="p-5">
                  <h3 className="mb-4">Join Our Community</h3>
                  <p className="lead mb-4">
                    Whether you're an artist or an art lover, we'd love to have you 
                    as part of our growing community.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                    <a href="/register" className="btn btn-success btn-lg">
                      <i className="fa fa-user-plus me-2"></i>
                      Join as Artist
                    </a>
                    <a href="/arts" className="btn btn-outline-primary btn-lg">
                      <i className="fa fa-search me-2"></i>
                      Explore Gallery
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
