import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import { useGetProductByIdQuery } from '../../../services/productsApi';
import { useUpdateProductMutation } from '../../../services/vendorApi';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const product = data?.product;

  const [updateProduct, { isLoading: loading }] = useUpdateProductMutation();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ price: '', availability: true });

  useEffect(() => {
    if (product) {
      setFormData({
        price: product.basePrice || '',
        availability: product.isActive !== undefined ? product.isActive : true,
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateProduct({ id, price: Number(formData.price), availability: formData.availability }).unwrap();
      navigate('/vendor/products');
    } catch (err) {
      setError(err?.data?.message || 'An error occurred while updating.');
    }
  };

  if (isLoading) return <div className="spinner spinner--gold" style={{ margin: '4rem auto' }} />;
  if (isError || !product) return <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>Product not found.</div>;

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>Edit Product</h1>

      {error && <div className="card" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', marginBottom: '2rem' }}>{error}</div>}

      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-sm)' }}>
          {product.primaryImage ? (
            <img src={`${import.meta.env.VITE_BASE_URL}${product.primaryImage}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Shirt size={32} color="var(--color-gold-muted)" />
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{product.name}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{product.category}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Base Price (&#8377;)</label>
          <input type="number" name="price" required min="0" className="form-input" value={formData.price} onChange={handleInputChange} />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Update the base price of the product.</p>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="availability" name="availability" checked={formData.availability} onChange={handleInputChange}
            style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)' }} />
          <label htmlFor="availability" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Active (Available for purchase)</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => navigate('/vendor/products')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
