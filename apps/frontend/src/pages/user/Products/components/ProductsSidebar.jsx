const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'shirt', label: 'Shirts' },
  { value: 'trousers', label: 'Trousers' },
  { value: 'suit', label: 'Suits' },
  { value: 'kurta', label: 'Kurtas' },
  { value: 'blazer', label: 'Blazers' },
  { value: 'dress', label: 'Dresses' },
];

const ProductsSidebar = ({ category, onCategoryChange }) => (
  <aside className="products-sidebar">
    <div className="products-sidebar__section">
      <h4 className="products-sidebar__title">Categories</h4>
      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`category-filter ${category === cat.value ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  </aside>
);

export { CATEGORIES };
export default ProductsSidebar;
