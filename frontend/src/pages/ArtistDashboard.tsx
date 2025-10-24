import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  sold: boolean;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const ArtistDashboard: React.FC = () => {
  const { user } = useAuth();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    sold: false
  });

  useEffect(() => {
    if (user?.role !== 'artist') {
      setError('Access denied. Artist privileges required.');
      return;
    }
    fetchArtworks();
  }, [user]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/artist/artworks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch artworks');
      }

      const data = await response.json();
      setArtworks(data.data.artworks);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingArtwork 
        ? `/api/artist/artworks/${editingArtwork.id}`
        : '/api/artist/artworks';
      
      const method = editingArtwork ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        setShowModal(false);
        setEditingArtwork(null);
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          sold: false
        });
        fetchArtworks();
      }
    } catch (error) {
      console.error('Error saving artwork:', error);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price.toString(),
      category: artwork.category,
      sold: artwork.sold
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        const response = await fetch(`/api/artist/artworks/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          fetchArtworks();
        }
      } catch (error) {
        console.error('Error deleting artwork:', error);
      }
    }
  };

  const handleNewArtwork = () => {
    setEditingArtwork(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      sold: false
    });
    setShowModal(true);
  };

  if (user?.role !== 'artist') {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You do not have permission to access this page.</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header>
              <h5>Artist Panel</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={handleNewArtwork}
                >
                  Add New Artwork
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Card>
            <Card.Header>
              <h5>My Artworks ({artworks.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {artworks.map((artwork) => (
                    <motion.tr
                      key={artwork.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td>{artwork.title}</td>
                      <td>${artwork.price}</td>
                      <td>
                        <Badge bg={artwork.sold ? 'success' : 'primary'}>
                          {artwork.sold ? 'Sold' : 'Available'}
                        </Badge>
                      </td>
                      <td>{artwork.category}</td>
                      <td>{new Date(artwork.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(artwork)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(artwork.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Artwork Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Sold"
                    checked={formData.sold}
                    onChange={(e) => setFormData({ ...formData, sold: e.target.checked })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingArtwork ? 'Update' : 'Create'} Artwork
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ArtistDashboard;
