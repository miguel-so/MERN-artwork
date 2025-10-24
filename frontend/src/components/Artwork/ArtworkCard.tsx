import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Artwork } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';

interface ArtworkCardProps {
  artwork: Artwork;
  showArtistInfo?: boolean;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, showArtistInfo = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleImageRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleImageDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <Card className="h-100 shadow-sm">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={artwork.image}
          alt={artwork.title}
          style={{ height: '250px', objectFit: 'cover' }}
          onContextMenu={handleImageRightClick}
          onDragStart={handleImageDragStart}
          draggable={false}
        />
        {artwork.sold && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            Sold
          </Badge>
        )}
        <Button
          variant="outline-danger"
          size="sm"
          className="position-absolute top-0 start-0 m-2"
          onClick={() => toggleFavorite(artwork._id)}
        >
          <i className={`fa fa-heart ${isFavorite(artwork._id) ? 'text-danger' : ''}`}></i>
        </Button>
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{artwork.title}</Card.Title>
        {showArtistInfo && artwork.artist && (
          <Card.Subtitle className="mb-2 text-muted">
            by {artwork.artist.name}
          </Card.Subtitle>
        )}
        <Card.Text className="text-muted small flex-grow-1">
          {artwork.description.length > 100 
            ? `${artwork.description.substring(0, 100)}...` 
            : artwork.description
          }
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">Size: {artwork.size}</small>
            {artwork.category && (
              <Badge bg="secondary" className="small">
                {artwork.category}
              </Badge>
            )}
          </div>
          
          <div className="d-flex gap-2">
            <Button
              as={Link}
              to={`/arts/${artwork._id}`}
              variant="primary"
              size="sm"
              className="flex-grow-1"
            >
              View Details
            </Button>
            {!artwork.sold && (
              <Button
                as={Link}
                to={`/arts/${artwork._id}/contact`}
                variant="success"
                size="sm"
              >
                Contact Artist
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCard;
