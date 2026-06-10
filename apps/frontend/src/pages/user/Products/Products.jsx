import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGetProductsQuery } from '../../../services/productsApi';
import ProductCard from './components/ProductCard';
import ProductsSidebar, { CATEGORIES } from './components/ProductsSidebar';
import ProductsSkeletons from './components/ProductsSkeletons';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(search);

  const queryArg = { page, limit: 12, ...(category && { category }), ...(search && { search }) };
  const { data, isLoading, isFetching } = useGetProductsQuery(queryArg);

  const products = data?.products || [];
  const pagination = data?.pagination || {};
  const loading = isLoading || isFetching;

  const setCategory = (cat) => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    if (search) p.set('search', search);
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (searchInput.trim()) p.set('search', searchInput.trim());
    setSearchParams(p);
  };

  const setPage = (pg) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', pg);
    setSearchParams(p);
  };

  return (
    <div className="products-page">
      <div className="page-hero">
        <div className="container">
          <h1>Our Collections</h1>
          <p>Every garment, crafted to your exact measurements</p>
        </div>
      </div>

      <div className="products-layout container">
        <ProductsSidebar category={category} onCategoryChange={setCategory} />

        <main className="products-main">
          <form onSubmit={handleSearch} className="products-search">
            <input className="form-input" placeholder="Search garments, styles…" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            <button type="submit" className="btn btn--primary">Search</button>
          </form>

          {!loading && (
            <p className="products-count">
              {pagination.total || 0} garments available
              {category && <span> in <strong>{CATEGORIES.find(c => c.value === category)?.label}</strong></span>}
              {search && <span> for "<strong>{search}</strong>"</span>}
            </p>
          )}

          {loading ? (
            <ProductsSkeletons />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><Search size={48} color="var(--color-border)" /></div>
              <h3 className="empty-state__title">No products found</h3>
              <p>Try adjusting your search or filter.</p>
              <button className="btn btn--outline" style={{ marginTop: '1rem' }} onClick={() => { setSearchParams({}); setSearchInput(''); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="products-pagination">
              <button className="btn btn--ghost btn--sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ArrowLeft size={14} /> Prev</button>
              <span className="products-pagination__info">Page {page} of {pagination.pages}</span>
              <button className="btn btn--ghost btn--sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next <ArrowRight size={14} /></button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
