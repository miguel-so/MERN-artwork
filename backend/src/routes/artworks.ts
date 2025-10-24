import express from 'express';
import {
  getArtworks,
  getArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getArtworksByArtist
} from '../controllers/artworkController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getArtworks);
router.get('/:id', getArtwork);
router.get('/artist/:artistId', getArtworksByArtist);

router.post('/', protect, authorize('artist'), createArtwork);
router.put('/:id', protect, updateArtwork);
router.delete('/:id', protect, deleteArtwork);

export default router;
