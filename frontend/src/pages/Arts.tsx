import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { artworkAPI, categoryAPI } from '../services/api';
import { Artwork, Category } from '../types';
import ArtworkCard from '../components/Artwork/ArtworkCard';

const Arts: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sold: searchParams.get('sold') || 'all',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [artworksResponse, categoriesResponse] = await Promise.all([
          artworkAPI.getAll({
            search: filters.search || undefined,
            category: filters.category || undefined,
            sold: filters.sold === 'available' ? false : filters.sold === 'sold' ? true : undefined,
          }),
          categoryAPI.getAll()
        ]);
        
        setArtworks(artworksResponse.data.data.data);
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load artworks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') {
        newSearchParams.set(k, v);
      }
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', sold: 'all' });
    setSearchParams({});
  };

  return (
    <div className="py-5">
      <Container>
        <Row className="mb-5">
          <Col>
            <h1 className="display-4 fw-bold mb-3">Arts</h1>
            <p className="lead text-muted">
              Discover beautiful artworks from talented artists around the world
            </p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col>
            <Card className="p-3">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search artworks..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.sold}
                      onChange={(e) => handleFilterChange('sold', e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="available">Available</option>
                      <option value="sold">Sold</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
                    className="w-100"
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Results */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        {loading ? (
          <Row>
            <Col className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading artworks...</p>
            </Col>
          </Row>
        ) : artworks.length === 0 ? (
          <Row>
            <Col className="text-center py-5">
              <div className="text-muted">
                <i className="fa fa-search fa-3x mb-3"></i>
                <h4>No artworks found</h4>
                <p>Try adjusting your search criteria or browse all artworks.</p>
                <Button variant="primary" onClick={clearFilters}>
                  View All Artworks
                </Button>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                <p className="text-muted">
                  Showing {artworks.length} artwork{artworks.length !== 1 ? 's' : ''}
                </p>
              </Col>
            </Row>
            
            <Row className="g-4">
              {artworks.map((artwork) => (
                <Col key={artwork._id} lg={3} md={4} sm={6}>
                  <ArtworkCard artwork={artwork} showArtistInfo={true} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Arts;
