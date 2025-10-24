import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Modal, Button, Row, Col } from 'react-bootstrap';

interface ImageGalleryProps {
  images: string[];
  title: string;
  show: boolean;
  onHide: () => void;
  initialIndex?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title, 
  show, 
  onHide, 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleImageRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      className="image-gallery-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <Row className="g-0">
          <Col md={9} className="position-relative">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={3}
              centerOnInit={true}
              wheel={{ step: 0.1 }}
              pinch={{ step: 5 }}
            >
              <TransformComponent>
                <img
                  src={images[currentIndex]}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  style={{
                    width: '100%',
                    height: '70vh',
                    objectFit: 'contain',
                    userSelect: 'none',
                  }}
                  onContextMenu={handleImageRightClick}
                  onDragStart={handleImageDragStart}
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
            
            {images.length > 1 && (
              <>
                <Button
                  variant="dark"
                  className="position-absolute top-50 start-0 translate-middle-y"
                  onClick={prevImage}
                  style={{ zIndex: 10 }}
                >
                  <i className="fa fa-chevron-left"></i>
                </Button>
                <Button
                  variant="dark"
                  className="position-absolute top-50 end-0 translate-middle-y"
                  onClick={nextImage}
                  style={{ zIndex: 10 }}
                >
                  <i className="fa fa-chevron-right"></i>
                </Button>
              </>
            )}
          </Col>
          
          {images.length > 1 && (
            <Col md={3} className="bg-light p-3">
              <div className="d-flex flex-column gap-2">
                <h6 className="mb-3">Gallery ({images.length} images)</h6>
                <div className="d-flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`img-thumbnail cursor-pointer ${
                        index === currentIndex ? 'border-primary' : ''
                      }`}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrentIndex(index)}
                      onContextMenu={handleImageRightClick}
                      onDragStart={handleImageDragStart}
                      draggable={false}
                    />
                  ))}
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="text-muted">
            {currentIndex + 1} of {images.length}
          </span>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={onHide}>
              Close
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageGallery;
