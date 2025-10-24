import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">
              © Copyright 2030 - All Rights Reserved
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="#" className="text-white text-decoration-none">
                Privacy Policy
              </a>
              <a href="#" className="text-white text-decoration-none">
                Terms of Service
              </a>
              <a href="#" className="text-white text-decoration-none">
                Cookies Settings
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
