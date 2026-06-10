const ProductsSkeletons = () => (
  <div className="products-grid">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="product-card--skeleton card">
        <div className="skeleton" style={{ height: 260 }} />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ height: 12, width: '60%' }} />
          <div className="skeleton" style={{ height: 18, width: '80%' }} />
          <div className="skeleton" style={{ height: 14, width: '40%' }} />
        </div>
      </div>
    ))}
  </div>
);

export default ProductsSkeletons;
