import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddProductMutation } from '../../../services/vendorApi';

const AddProduct = () => {
  const navigate = useNavigate();
  const [addProduct, { isLoading: loading }] = useAddProductMutation();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'shirt',
    description: '',
    basePrice: '',
  });

  const [images, setImages] = useState([]);
  const [fabrics, setFabrics] = useState([
    { name: '', texture: '', description: '', surcharge: 0, available: true }
  ]);
  const [colors, setColors] = useState([
    { name: '', hex: '#000000', available: true }
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = 10 - images.length;
      const filesToAdd = newFiles.slice(0, remainingSlots);
      if (newFiles.length > remainingSlots) {
        alert(`You can only upload a maximum of 10 images. ${remainingSlots} images were added.`);
      }
      const newImages = filesToAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setImages(prev => [...prev, ...newImages]);
    }
    if (e.target) e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleFabricChange = (index, field, value) => {
    const updated = [...fabrics];
    updated[index][field] = value;
    setFabrics(updated);
  };

  const handleColorChange = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('basePrice', formData.basePrice);
      data.append('fabrics', JSON.stringify(fabrics.filter(f => f.name)));
      data.append('colors', JSON.stringify(colors.filter(c => c.name)));
      images.forEach(img => data.append('images', img.file));

      await addProduct(data).unwrap();
      navigate('/vendor/products');
    } catch (err) {
      setError(err?.data?.message || 'An error occurred while uploading.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '2rem' }}>Add New Product</h1>

      {error && <div className="card" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', marginBottom: '2rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Basic Info */}
        <section>
          <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Basic Details</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input type="text" name="name" required className="form-input" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-input" value={formData.category} onChange={handleInputChange}>
                <option value="shirt">Shirt</option>
                <option value="trousers">Trousers</option>
                <option value="suit">Suit</option>
                <option value="kurta">Kurta</option>
                <option value="blazer">Blazer</option>
                <option value="dress">Dress</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Base Price (&#8377;)</label>
            <input type="number" name="basePrice" required min="0" className="form-input" value={formData.basePrice} onChange={handleInputChange} />
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Description</label>
            <textarea name="description" required rows={4} className="form-textarea" value={formData.description} onChange={handleInputChange} />
          </div>
        </section>

        {/* Images */}
        <section>
          <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Product Images</h3>
          <div className="form-group">
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="form-input" disabled={images.length >= 10} />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              You can upload up to 10 images. The first image will be the primary image.
            </p>
          </div>
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <img src={img.preview} alt={`preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {idx === 0 && (
                    <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.65rem', textAlign: 'center', padding: '2px 0' }}>Primary</span>
                  )}
                  <button type="button" onClick={() => removeImage(idx)}
                    style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-error)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    &#10005;
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Fabrics */}
        <section>
          <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Available Fabrics</h3>
          {fabrics.map((fabric, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '1rem', marginBottom: '1rem', alignItems: 'end' }}>
              <div className="form-group">
                <label className="form-label">Fabric Name</label>
                <input type="text" className="form-input" placeholder="e.g. Egyptian Cotton" value={fabric.name} onChange={(e) => handleFabricChange(idx, 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Texture</label>
                <input type="text" className="form-input" placeholder="e.g. Smooth" value={fabric.texture} onChange={(e) => handleFabricChange(idx, 'texture', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Surcharge (&#8377;)</label>
                <input type="number" className="form-input" min="0" value={fabric.surcharge} onChange={(e) => handleFabricChange(idx, 'surcharge', Number(e.target.value))} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setFabrics([...fabrics, { name: '', texture: '', description: '', surcharge: 0, available: true }])} className="btn btn--outline btn--sm">
            Add Fabric
          </button>
        </section>

        {/* Colors */}
        <section>
          <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Available Colors</h3>
          {colors.map((color, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Color Name</label>
                <input type="text" className="form-input" placeholder="e.g. Midnight Blue" value={color.name} onChange={(e) => handleColorChange(idx, 'name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Hex Code</label>
                <input type="color" className="form-input" style={{ width: '60px', padding: '2px', height: '40px' }} value={color.hex} onChange={(e) => handleColorChange(idx, 'hex', e.target.value)} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setColors([...colors, { name: '', hex: '#000000', available: true }])} className="btn btn--outline btn--sm">
            Add Color
          </button>
        </section>

        <button type="submit" className="btn btn--primary" disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>
          {loading ? 'Publishing...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
