import { Request, Response } from 'express';
import { Artwork, User } from '../models';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
export const getArtworks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Build query
    let whereClause: any = {};

    if (req.query.search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    if (req.query.category) {
      whereClause.category = req.query.category;
    }

    if (req.query.sold !== undefined) {
      whereClause.sold = req.query.sold === 'true';
    }

    const { count, rows: artworks } = await Artwork.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'artist',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // Pagination result
    const pagination: any = {};

    if (offset + limit < count) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (offset > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.json({
      success: true,
      data: {
        data: artworks,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        pagination
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
export const getArtwork = async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'artist',
          attributes: ['id', 'name', 'email', 'profileImage', 'contactInfo']
        }
      ]
    });

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    res.json({
      success: true,
      data: artwork
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new artwork
// @route   POST /api/artworks
// @access  Private (Artist)
export const createArtwork = async (req: AuthRequest, res: Response) => {
  try {
    // Add artistId to req.body
    req.body.artistId = req.user!.id;

    const artwork = await Artwork.create(req.body);

    res.status(201).json({
      success: true,
      data: artwork
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private (Artist/Owner or Super Admin)
export const updateArtwork = async (req: AuthRequest, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Make sure user is artwork owner or super admin
    if (artwork.artistId !== req.user!.id && req.user!.role !== 'super_admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this artwork'
      });
    }

    await Artwork.update(req.body, {
      where: { id: req.params.id }
    });

    const updatedArtwork = await Artwork.findByPk(req.params.id);

    res.json({
      success: true,
      data: updatedArtwork
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private (Artist/Owner or Super Admin)
export const deleteArtwork = async (req: AuthRequest, res: Response) => {
  try {
    const artwork = await Artwork.findByPk(req.params.id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Artwork not found'
      });
    }

    // Make sure user is artwork owner or super admin
    if (artwork.artistId !== req.user!.id && req.user!.role !== 'super_admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this artwork'
      });
    }

    await Artwork.destroy({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Artwork deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get artworks by artist
// @route   GET /api/artworks/artist/:artistId
// @access  Public
export const getArtworksByArtist = async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.findAll({
      where: { artistId: req.params.artistId },
      include: [
        {
          model: User,
          as: 'artist',
          attributes: ['id', 'name', 'email', 'profileImage']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: artworks
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
