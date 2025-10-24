import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  sold: boolean;
  category: string;
  artist: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'artworks'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      setError('Access denied. Super admin privileges required.');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersResponse, artworksResponse] = await Promise.all([
        fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch('/api/admin/artworks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (!usersResponse.ok || !artworksResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersResponse.json();
      const artworksData = await artworksResponse.json();

      setUsers(usersData.data);
      setArtworks(artworksData.data.artworks);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !user.isActive }
            : user
        ));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  if (user?.role !== 'super_admin') {
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
              <h5>Admin Panel</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('users')}
                >
                  Users ({users.length})
                </Button>
                <Button
                  variant={activeTab === 'artworks' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('artworks')}
                >
                  Artworks ({artworks.length})
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

          {activeTab === 'users' && (
            <Card>
              <Card.Header>
                <h5>Artist Management</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Email Verified</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={user.isActive ? 'success' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={user.isEmailVerified ? 'success' : 'warning'}>
                            {user.isEmailVerified ? 'Verified' : 'Pending'}
                          </Badge>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            size="sm"
                            variant={user.isActive ? 'outline-danger' : 'outline-success'}
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'artworks' && (
            <Card>
              <Card.Header>
                <h5>All Artworks</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Artist</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Created</th>
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
                        <td>{artwork.artist.name}</td>
                        <td>${artwork.price}</td>
                        <td>
                          <Badge bg={artwork.sold ? 'success' : 'primary'}>
                            {artwork.sold ? 'Sold' : 'Available'}
                          </Badge>
                        </td>
                        <td>{artwork.category}</td>
                        <td>{new Date(artwork.createdAt).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
