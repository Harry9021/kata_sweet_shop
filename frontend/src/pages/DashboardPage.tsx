import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SweetCard from '../components/sweets/SweetCard';
import SweetModal from '../components/sweets/SweetModal';
import Button from '../components/common/Button';
import SuccessAnimation from '../components/common/SuccessAnimation';

interface Sweet {
    _id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    description?: string;
    createdAt: string;
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'purchase' | 'restock'>('create');
    const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: ''
    });

    const [transactionQuantity, setTransactionQuantity] = useState(1);

    useEffect(() => {
        fetchSweets();
    }, [searchQuery, categoryFilter]);

    const fetchSweets = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('name', searchQuery);
            if (categoryFilter) params.append('category', categoryFilter);

            const response = await api.get(`/sweets/search?${params.toString()}`);
            setSweets(response.data.data);
        } catch (error) {
            console.error('Error fetching sweets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode: 'create' | 'edit' | 'purchase' | 'restock', sweet?: Sweet) => {
        setModalMode(mode);
        setModalOpen(true);
        setSelectedSweet(sweet || null);

        if (sweet && (mode === 'edit')) {
            setFormData({
                name: sweet.name,
                category: sweet.category,
                price: sweet.price.toString(),
                quantity: sweet.quantity.toString(),
                description: sweet.description || ''
            });
        } else if (mode === 'create') {
            setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
        } else {
            setTransactionQuantity(1);
        }
    };

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            if (modalMode === 'create') {
                const payload = {
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity)
                };
                await api.post('/sweets', payload);
                setModalOpen(false);
            } else if (modalMode === 'edit' && selectedSweet) {
                const payload = {
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity)
                };
                await api.put(`/sweets/${selectedSweet._id}`, payload);
                setModalOpen(false);
            } else if (modalMode === 'purchase' && selectedSweet) {
                await api.post(`/sweets/${selectedSweet._id}/purchase`, { quantity: transactionQuantity });
                setShowSuccess(true);
                setFormLoading(false);
                fetchSweets();
                return;
            } else if (modalMode === 'restock' && selectedSweet) {
                await api.post(`/sweets/${selectedSweet._id}/restock`, { quantity: transactionQuantity });
                setModalOpen(false);
            }

            if (modalMode !== 'purchase') {
                fetchSweets();
            }
        } catch (error) {
            console.error('Action failed:', error);
            alert('Operation failed. Please try again.');
        } finally {
            if (modalMode !== 'purchase' || !showSuccess) {
                setFormLoading(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this sweet?')) {
            try {
                await api.delete(`/sweets/${id}`);
                fetchSweets();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    return (
        <div className="dashboard-page container">
            <div className="dashboard-header">
                <div>
                    <h2>Current Inventory</h2>
                    <p>Manage your sweets collection</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => handleOpenModal('create')}>
                        <Plus size={18} /> Add New Sweet
                    </Button>
                )}
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search sweets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <Filter size={20} className="filter-icon" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Candy">Candy</option>
                        <option value="Gummy">Gummy</option>
                        <option value="Hard Candy">Hard Candy</option>
                        <option value="Lollipop">Lollipop</option>
                        <option value="Toffee">Toffee</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : sweets.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon"><ShoppingBag size={48} /></div>
                    <h3>No sweets found</h3>
                    <p>Try adjusting your search or add some new sweets.</p>
                </div>
            ) : (
                <div className="sweets-grid">
                    {sweets.map(sweet => (
                        <SweetCard
                            key={sweet._id}
                            sweet={sweet}
                            onEdit={(s) => handleOpenModal('edit', s)}
                            onDelete={handleDelete}
                            onPurchase={(s) => handleOpenModal('purchase', s)}
                            onRestock={(s) => handleOpenModal('restock', s)}
                        />
                    ))}
                </div>
            )}

            <SweetModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={
                    modalMode === 'create' ? 'Add New Sweet' :
                        modalMode === 'edit' ? 'Edit Sweet' :
                            modalMode === 'purchase' ? `Purchase ${selectedSweet?.name}` :
                                `Restock ${selectedSweet?.name}`
                }
                onSubmit={handleSubmit}
                isLoading={formLoading}
                submitLabel={
                    modalMode === 'create' ? 'Create' :
                        modalMode === 'edit' ? 'Save Changes' :
                            modalMode === 'purchase' ? 'Confirm Purchase' :
                                'Confirm Restock'
                }
                hideFooter={showSuccess}
            >
                {(modalMode === 'create' || modalMode === 'edit') ? (
                    <div className="form-layout">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Chocolate">Chocolate</option>
                                <option value="Candy">Candy</option>
                                <option value="Gummy">Gummy</option>
                                <option value="Hard Candy">Hard Candy</option>
                                <option value="Lollipop">Lollipop</option>
                                <option value="Toffee">Toffee</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="transaction-form">
                        {showSuccess ? (
                            <SuccessAnimation
                                message="Purchase Successful!"
                                onComplete={() => {
                                    setShowSuccess(false);
                                    setModalOpen(false);
                                    setTransactionQuantity(1);
                                }}
                            />
                        ) : (
                            <>
                                <p className="mb-2">
                                    Current Stock: <strong>{selectedSweet?.quantity}</strong>
                                </p>
                                <div className="form-group">
                                    <label>Quantity to {modalMode === 'purchase' ? 'Purchase' : 'Restock'}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={modalMode === 'purchase' ? selectedSweet?.quantity : undefined}
                                        value={transactionQuantity}
                                        onChange={e => setTransactionQuantity(parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                                {modalMode === 'purchase' && selectedSweet && (
                                    <p className="total-cost mt-2">
                                        Total Cost: <strong>₹{(transactionQuantity * selectedSweet.price).toFixed(2)}</strong>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </SweetModal >

            <style>{`
        .dashboard-page {
          padding-top: var(--spacing-xl);
          padding-bottom: var(--spacing-2xl);
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .dashboard-header h2 {
          margin-bottom: var(--spacing-xs);
          color: var(--color-text-main);
        }
        
        .dashboard-header p {
          color: var(--color-text-muted);
        }
        
        .filters-bar {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
          background-color: var(--color-surface);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }
        
        .search-box, .filter-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-box { flex: 2; }
        .filter-box { flex: 1; }
        
        .search-icon, .filter-icon {
          position: absolute;
          left: 12px;
          color: var(--color-text-muted);
          pointer-events: none;
        }
        
        .filters-bar input, .filters-bar select {
          padding-left: 40px;
          border: 1px solid #eee;
          background-color: #f9f9f9;
        }
        
        .filters-bar input:focus, .filters-bar select:focus {
          background-color: white;
          border-color: var(--color-primary);
        }
        
        .sweets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          background-color: var(--color-surface);
          border-radius: var(--radius-lg);
          color: var(--color-text-muted);
        }
        
        .empty-icon {
          color: var(--color-primary-light);
          margin-bottom: var(--spacing-md);
        }
        
        .form-layout {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }
        
        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        textarea {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid #E0E0E0;
          border-radius: var(--radius-sm);
          font-family: inherit;
          resize: vertical;
        }
        
        textarea:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        
        .total-cost {
          font-size: 1.1rem;
          color: var(--color-text-main);
          text-align: right;
          border-top: 1px solid #eee;
          padding-top: var(--spacing-sm);
        }

        @media (max-width: 600px) {
          .filters-bar { flex-direction: column; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: var(--spacing-md); }
        }
      `}</style>
        </div >
    );
};

export default DashboardPage;
