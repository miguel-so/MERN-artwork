import React, { useState } from 'react';
import { Form, Button, Alert, Modal, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { contactAPI } from '../../services/api';
import { ContactForm as ContactFormType } from '../../types';

interface ContactFormProps {
  show: boolean;
  onHide: () => void;
  artworkId?: string;
  artistId?: string;
  artworkTitle?: string;
  artistName?: string;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
});

const ContactForm: React.FC<ContactFormProps> = ({
  show,
  onHide,
  artworkId,
  artistId,
  artworkTitle,
  artistName
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      subject: artworkTitle ? `Inquiry about "${artworkTitle}"` : '',
    }
  });

  const onSubmit = async (data: ContactFormType) => {
    setLoading(true);
    setError(null);

    try {
      await contactAPI.sendMessage({
        ...data,
        artworkId,
        artistId
      });
      
      setSuccess(true);
      reset();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    reset();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Contact {artistName || 'Artist'}
          {artworkTitle && (
            <small className="text-muted d-block">
              About: {artworkTitle}
            </small>
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {success ? (
          <div className="text-center py-4">
            <div className="mb-3">
              <i className="fa fa-check-circle fa-3x text-success"></i>
            </div>
            <h4 className="text-success">Message Sent!</h4>
            <p className="text-muted">
              Thank you for your interest. The artist will get back to you soon.
            </p>
            <Button variant="success" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('name')}
                    isInvalid={!!errors.name}
                    placeholder="Enter your full name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Email *</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email')}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                {...register('subject')}
                isInvalid={!!errors.subject}
                placeholder="Enter message subject"
              />
              <Form.Control.Feedback type="invalid">
                {errors.subject?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Message *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                {...register('message')}
                isInvalid={!!errors.message}
                placeholder="Tell the artist about your interest in their work..."
              />
              <Form.Control.Feedback type="invalid">
                {errors.message?.message}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Be specific about what you're interested in. This helps the artist provide better information.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="outline-secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fa fa-paper-plane me-2"></i>
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ContactForm;
