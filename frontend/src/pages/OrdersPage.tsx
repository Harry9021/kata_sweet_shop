import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShoppingBag, TrendingUp, Package } from 'lucide-react';

interface OrderItem {
    sweetId: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    userId: { _id: string; email: string } | string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
}

const OrdersPage: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ revenue: 0, totalOrders: 0 });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const endpoint = isAdmin ? '/orders/sales' : '/orders/my-orders';
            const response = await api.get(endpoint);

            if (isAdmin) {
                setOrders(response.data.data.orders);
                setStats({
                    revenue: response.data.data.totalRevenue,
                    totalOrders: response.data.data.totalOrders
                });
            } else {
                setOrders(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="orders-page container">
            <div className="page-header">
                <h2>{isAdmin ? 'Sales Dashboard' : 'My Purchase History'}</h2>
                {!isAdmin && <p>Track your sweet orders</p>}
            </div>

            {isAdmin && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon revenue"><TrendingUp size={24} /></div>
                        <div className="stat-info">
                            <h3>Total Revenue</h3>
                            <p className="stat-value">₹{stats.revenue.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orders"><Package size={24} /></div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p className="stat-value">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center">Loading records...</div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><ShoppingBag size={48} /></div>
                    <h3>No orders found</h3>
                    <p>{isAdmin ? 'No sales have been made yet.' : 'You haven\'t purchased any sweets yet.'}</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card card">
                            <div className="order-header">
                                <div className="order-meta">
                                    <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="order-total">
                                    Total: <strong>₹{order.totalAmount.toFixed(2)}</strong>
                                </div>
                            </div>

                            {isAdmin && typeof order.userId === 'object' && (
                                <div className="customer-info">
                                    Customer: <span>{(order.userId as { email: string }).email}</span>
                                </div>
                            )}

                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="item-quantity">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .orders-page {
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }
        
        .page-header {
          margin-bottom: var(--spacing-xl);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .stat-card {
          background-color: var(--color-surface);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-icon.revenue { background-color: #E8F8F5; color: #1ABC9C; }
        .stat-icon.orders { background-color: #E3F2FD; color: #2196F3; }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--color-text-main);
          margin: 0;
        }
        
        .stat-info h3 {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin: 0;
        }
        
        .orders-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .order-card {
          padding: var(--spacing-lg);
          border-left: 4px solid var(--color-primary);
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid #eee;
        }
        
        .order-id {
          font-family: monospace;
          background-color: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          margin-right: var(--spacing-md);
          font-weight: bold;
        }
        
        .order-date {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        
        .customer-info {
            font-size: 0.9rem;
            color: var(--color-text-muted);
            margin-bottom: var(--spacing-md);
        }
        
        .customer-info span {
            color: var(--color-text-main);
            font-weight: 500;
        }

        .order-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .order-item {
          display: flex;
          align-items: center;
          font-size: 0.95rem;
        }
        
        .item-quantity {
          font-weight: bold;
          margin-right: var(--spacing-md);
          min-width: 30px;
          color: var(--color-primary);
        }
        
        .item-name {
          flex: 1;
        }
        
        .item-price {
          font-weight: 500;
        }
        
        @media (max-width: 600px) {
          .order-header { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
        </div>
    );
};

export default OrdersPage;
