import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { artworkAPI } from '../services/api';
import { Artwork } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import ImageGallery from '../components/Artwork/ImageGallery';

const ArtworkDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

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

  const handleImageRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

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

  const images = artwork.images && artwork.images.length > 0 
    ? [artwork.image, ...artwork.images] 
    : [artwork.image];

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
          <Col lg={6} className="mb-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-sm">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={artwork.image}
                    alt={artwork.title}
                    style={{ height: '500px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setShowGallery(true)}
                    onContextMenu={handleImageRightClick}
                    onDragStart={handleImageDragStart}
                    draggable={false}
                  />
                  {artwork.sold && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 end-0 m-3"
                      style={{ fontSize: '1rem' }}
                    >
                      Sold
                    </Badge>
                  )}
                  <Button
                    variant="outline-danger"
                    size="lg"
                    className="position-absolute top-0 start-0 m-3"
                    onClick={() => toggleFavorite(artwork._id)}
                  >
                    <i className={`fa fa-heart ${isFavorite(artwork._id) ? 'text-danger' : ''}`}></i>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Col>

          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-100 border-0">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h1 className="h2 mb-0">{artwork.title}</h1>
                    {artwork.category && (
                      <Badge bg="secondary" className="fs-6">
                        {artwork.category}
                      </Badge>
                    )}
                  </div>

                  {artwork.artist && (
                    <p className="text-muted mb-3">
                      by <strong>{artwork.artist.name}</strong>
                    </p>
                  )}

                  <div className="mb-4">
                    <h5>Description</h5>
                    <p className="text-muted">{artwork.description}</p>
                  </div>

                  <Row className="mb-4">
                    <Col sm={6}>
                      <div className="mb-3">
                        <h6 className="text-muted">Size</h6>
                        <p className="mb-0">{artwork.size}</p>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="mb-3">
                        <h6 className="text-muted">Status</h6>
                        <p className="mb-0">
                          {artwork.sold ? (
                            <Badge bg="danger">Sold</Badge>
                          ) : (
                            <Badge bg="success">Available</Badge>
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {artwork.note && (
                    <div className="mb-4">
                      <h6 className="text-muted">Artist's Note</h6>
                      <p className="text-muted">{artwork.note}</p>
                    </div>
                  )}

                  {artwork.tags && artwork.tags.length > 0 && (
                    <div className="mb-4">
                      <h6 className="text-muted">Tags</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {artwork.tags.map((tag, index) => (
                          <Badge key={index} bg="light" text="dark" className="border">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-3 mt-4">
                    {!artwork.sold && (
                      <Button
                        as={Link}
                        to={`/arts/${artwork._id}/contact`}
                        variant="success"
                        size="lg"
                        className="flex-grow-1"
                      >
                        <i className="fa fa-envelope me-2"></i>
                        Contact Artist
                      </Button>
                    )}
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={() => setShowGallery(true)}
                    >
                      <i className="fa fa-search-plus me-2"></i>
                      Zoom
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Additional Images */}
        {artwork.images && artwork.images.length > 0 && (
          <Row className="mt-5">
            <Col>
              <h4 className="mb-4">Additional Images</h4>
              <Row className="g-3">
                {artwork.images.map((image, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <Card 
                      className="border-0 shadow-sm cursor-pointer"
                      onClick={() => setShowGallery(true)}
                    >
                      <Card.Img
                        variant="top"
                        src={image}
                        alt={`${artwork.title} - Image ${index + 2}`}
                        style={{ height: '200px', objectFit: 'cover' }}
                        onContextMenu={handleImageRightClick}
                        onDragStart={handleImageDragStart}
                        draggable={false}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={images}
        title={artwork.title}
        show={showGallery}
        onHide={() => setShowGallery(false)}
      />
    </div>
  );
};

export default ArtworkDetails;
