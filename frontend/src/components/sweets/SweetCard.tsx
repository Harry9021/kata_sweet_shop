import React from 'react';
import { Edit2, Trash2, ShoppingCart, PackagePlus } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: string) => void;
  onPurchase: (sweet: Sweet) => void;
  onRestock: (sweet: Sweet) => void;
}

const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onEdit,
  onDelete,
  onPurchase,
  onRestock
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div className="card sweet-card">
      <div className="card-image">
        <div className="placeholder-img" style={{
          backgroundColor: stringToColor(sweet.name),
        }}>
          {sweet.name.charAt(0)}
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <span className="category-tag">{sweet.category}</span>
          <h3 className="sweet-name">{sweet.name}</h3>
        </div>

        <div className="sweet-details">
          <div className="price-tag">₹{sweet.price.toFixed(2)}</div>
          <div className={`stock-tag ${isOutOfStock ? 'out' : isLowStock ? 'low' : ''}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} left`}
          </div>
        </div>

        {sweet.description && (
          <p className="description">{sweet.description}</p>
        )}

        <div className="card-actions">
          {isAdmin ? (
            <div className="admin-actions">
              <Button size="sm" variant="secondary" onClick={() => onEdit(sweet)} title="Edit">
                <Edit2 size={16} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onRestock(sweet)} title="Restock">
                <PackagePlus size={16} />
              </Button>
              <Button size="sm" variant="danger" onClick={() => onDelete(sweet._id)} title="Delete">
                <Trash2 size={16} />
              </Button>
            </div>
          ) : (
            <Button
              className="purchase-btn"
              onClick={() => onPurchase(sweet)}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={18} />
              Purchase
            </Button>
          )}
        </div>
      </div>

      <style>{`
        .sweet-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          padding: 0;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }
        
        .sweet-card:hover {
          transform: translateY(-4px);
        }
        
        .card-image {
          height: 160px;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .placeholder-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .card-content {
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .category-tag {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        
        .sweet-name {
          margin: var(--spacing-xs) 0 var(--spacing-md);
          font-size: 1.25rem;
        }
        
        .sweet-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .price-tag {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--color-primary);
        }
        
        .stock-tag {
          font-size: 0.875rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          background-color: #E8F8F5;
          color: #1ABC9C;
        }
        
        .stock-tag.low {
          background-color: #FFF8E1;
          color: #FFC107;
        }
        
        .stock-tag.out {
          background-color: #FFEBEE;
          color: #FF5252;
        }
        
        .description {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-lg);
          flex-grow: 1;
        }
        
        .card-actions {
          margin-top: auto;
        }
        
        .purchase-btn {
          width: 100%;
          justify-content: center;
        }
        
        .admin-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: var(--spacing-sm);
        }
        
        .admin-actions button {
          justify-content: center;
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
    </div>
  );
};

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 65%)`;
}

export default SweetCard;
