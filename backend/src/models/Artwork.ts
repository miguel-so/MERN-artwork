import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface ArtworkAttributes {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[];
  size: string;
  note?: string;
  sold: boolean;
  artistId: number;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ArtworkCreationAttributes extends Optional<ArtworkAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Artwork extends Model<ArtworkAttributes, ArtworkCreationAttributes> implements ArtworkAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public image!: string;
  public images?: string[];
  public size!: string;
  public note?: string;
  public sold!: boolean;
  public artistId!: number;
  public category?: string;
  public tags?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Artwork.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000]
      }
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    sold: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [0, 50]
      }
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'Artwork',
    tableName: 'artworks',
    timestamps: true,
    indexes: [
      {
        fields: ['artistId']
      },
      {
        fields: ['sold']
      },
      {
        fields: ['category']
      },
      {
        type: 'FULLTEXT',
        fields: ['title', 'description']
      }
    ]
  }
);

// Define associations
User.hasMany(Artwork, { foreignKey: 'artistId', as: 'artworks' });
Artwork.belongsTo(User, { foreignKey: 'artistId', as: 'artist' });

export default Artwork;