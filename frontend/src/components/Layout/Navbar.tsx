import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, isArtist, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" onClick={handleNavClick}>
          <img
            src="/assets/images/grayscale20on20transparent-169x128.png"
            alt="Dulcinea-Art"
            style={{ height: '3rem' }}
          />
          <span className="ms-2">Dulcinea-Art</span>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleNavClick}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleNavClick}>
              About Us
            </Nav.Link>
            <Nav.Link as={Link} to="/arts" onClick={handleNavClick}>
              Arts
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                {isArtist && (
                  <Nav.Link as={Link} to="/artist/dashboard" onClick={handleNavClick}>
                    My Dashboard
                  </Nav.Link>
                )}
                {isSuperAdmin && (
                  <Nav.Link as={Link} to="/admin" onClick={handleNavClick}>
                    Admin Panel
                  </Nav.Link>
                )}
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="outline-light" size="sm">
                    {user?.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="success" 
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
