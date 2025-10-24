import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { artworkAPI } from '../services/api';
import { Artwork } from '../types';
import ContactForm from '../components/Contact/ContactForm';

const ContactArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await artworkAPI.getById(id);
        setArtwork(response.data.data);
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setError('Failed to load artwork details.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <Alert variant="danger">
              {error || 'Artwork not found'}
            </Alert>
            <Button as={Link} to="/arts" variant="primary">
              Back to Gallery
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        <Row className="mb-4">
          <Col>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="mb-3"
            >
              <i className="fa fa-arrow-left me-2"></i>
              Back
            </Button>
          </Col>
        </Row>

        <Row>
          <Col lg={8} className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="h3 mb-3">Contact the Artist</h2>
                    <p className="text-muted">
                      Get in touch with {artwork.artist?.name} about "{artwork.title}"
                    </p>
                  </div>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Card className="h-100 border-0" style={{ background: '#f8f9fa' }}>
                        <Card.Body className="text-center">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                          <h5 className="mb-2">{artwork.title}</h5>
                          <p className="text-muted small mb-3">
                            {artwork.description.length > 100 
                              ? `${artwork.description.substring(0, 100)}...` 
                              : artwork.description
                            }
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">Size: {artwork.size}</small>
                            <small className={`badge ${artwork.sold ? 'bg-danger' : 'bg-success'}`}>
                              {artwork.sold ? 'Sold' : 'Available'}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <div className="h-100 d-flex flex-column justify-content-center">
                        <h5 className="mb-3">About the Artist</h5>
                        <p className="text-muted mb-3">
                          {artwork.artist?.bio || 'No bio available for this artist.'}
                        </p>
                        
                        {artwork.artist?.contactInfo && (
                          <div className="mb-3">
                            <h6 className="mb-2">Contact Information</h6>
                            {artwork.artist.contactInfo.phone && (
                              <p className="mb-1">
                                <i className="fa fa-phone me-2"></i>
                                {artwork.artist.contactInfo.phone}
                              </p>
                            )}
                            {artwork.artist.contactInfo.website && (
                              <p className="mb-1">
                                <i className="fa fa-globe me-2"></i>
                                <a href={artwork.artist.contactInfo.website} target="_blank" rel="noopener noreferrer">
                                  Visit Website
                                </a>
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-auto">
                          <Button
                            variant="success"
                            size="lg"
                            className="w-100"
                            onClick={() => setShowContactForm(true)}
                          >
                            <i className="fa fa-envelope me-2"></i>
                            Send Message to Artist
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <p className="text-muted small">
                      By contacting the artist, you agree to our Terms of Service and Privacy Policy.
                      The artist will receive your message and respond directly to you.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <ContactForm
        show={showContactForm}
        onHide={() => setShowContactForm(false)}
        artworkId={artwork._id}
        artistId={artwork.artistId}
        artworkTitle={artwork.title}
        artistName={artwork.artist?.name}
      />
    </div>
  );
};

export default ContactArtist;
