import express from 'express';
import {
  getAllUsers,
  toggleUserStatus,
  getAllArtworks,
  deleteArtwork
} from '../controllers/adminController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

// Artwork management routes
router.get('/artworks', getAllArtworks);
router.delete('/artworks/:id', deleteArtwork);

export default router;
