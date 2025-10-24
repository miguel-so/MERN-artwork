import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { artworkAPI, categoryAPI } from '../services/api';
import { Artwork, Category } from '../types';
import ArtworkCard from '../components/Artwork/ArtworkCard';

const Home: React.FC = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworksResponse, categoriesResponse] = await Promise.all([
          artworkAPI.getAll({ limit: 8 }),
          categoryAPI.getAll()
        ]);
        
        setFeaturedArtworks(artworksResponse.data.data.data);
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="py-5" 
        style={{ 
          background: 'linear-gradient(135deg, #f1ffe9 0%, #e7f3ff 100%)',
          minHeight: '70vh'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center text-lg-start">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold mb-4">
                  ✨ Dulcinea-Art
                </h1>
                <p className="lead mb-4">
                  Discover beautiful artworks from talented artists around the world. 
                  Find your next masterpiece and connect with the artists who create them.
                </p>
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <Button as={Link} to="/arts" variant="success" size="lg">
                    <i className="fa fa-paint-brush me-2"></i>
                    Explore Gallery
                  </Button>
                  <Button as={Link} to="/about" variant="outline-success" size="lg">
                    About Artists
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="/assets/images/new-692x528.png"
                  alt="Featured Artwork"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '500px' }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Artworks Gallery */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Art Gallery ✨</h2>
              <p className="lead text-muted">
                Discover our curated collection of stunning artworks
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {featuredArtworks.map((artwork, index) => (
              <Col key={artwork._id} lg={3} md={4} sm={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ArtworkCard artwork={artwork} showArtistInfo={true} />
                </motion.div>
              </Col>
            ))}
          </Row>
          
          <Row className="mt-5">
            <Col className="text-center">
              <Button as={Link} to="/arts" variant="outline-primary" size="lg">
                View All Artworks
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section 
        className="py-5"
        style={{ 
          background: 'linear-gradient(135deg, #efffe4 0%, #f0f8ff 100%)'
        }}
      >
        <Container>
          <Row className="mb-5">
            <Col className="text-center">
              <h2 className="display-5 fw-bold mb-3">Categories</h2>
              <p className="lead text-muted">
                Explore artworks by category
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {categories.map((category, index) => (
              <Col key={category._id} lg={3} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Img
                      variant="top"
                      src={category.image || '/assets/images/placeholder-category.jpg'}
                      alt={category.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="text-center">
                      <Card.Title className="h5">{category.name}</Card.Title>
                      <Card.Text className="text-muted">
                        {category.description}
                      </Card.Text>
                      <Button as={Link} to={`/arts?category=${category._id}`} variant="warning">
                        View Arts
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Artist Spotlight */}
      <section className="py-5">
        <Container>
          <Row className="mb-5">
            <Col>
              <h2 className="display-5 fw-bold mb-3">Artist Spotlight</h2>
              <p className="lead text-muted">
                Meet our featured artists and discover their latest works
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col lg={3} md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/assets/images/another20pnk-454x611.png"
                  alt="Featured Artist"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="primary">Design</Badge>
                    <small className="text-muted">27 Dec</small>
                  </div>
                  <Card.Title className="h6">
                    Featured Artist Work
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    Discover the latest creation from our featured artist
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/assets/images/pin-452x566.png"
                  alt="Featured Artist"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="success">Art</Badge>
                    <small className="text-muted">29 Dec</small>
                  </div>
                  <Card.Title className="h6">
                    New Artwork Release
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    Explore this stunning new piece from our gallery
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src="/assets/images/pink2-452x555.png"
                  alt="Featured Artist"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="info">Branding</Badge>
                    <small className="text-muted">30 Dec</small>
                  </div>
                  <Card.Title className="h6">
                    Artist Collection
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    A beautiful collection from one of our talented artists
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6}>
              <Card className="h-100 shadow-sm border-primary">
                <Card.Body className="d-flex flex-column justify-content-center text-center">
                  <h5 className="mb-3">View All Artists</h5>
                  <p className="text-muted mb-4">
                    Discover more talented artists and their amazing works
                  </p>
                  <Button as={Link} to="/arts" variant="primary">
                    Explore Gallery
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
