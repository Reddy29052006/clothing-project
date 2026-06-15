import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../store/slices/authSlice';
import {
  useGetClientCustomOrdersQuery,
  useGetTailorsQuery,
  useCreateCustomOrderMutation
} from '../../../services/customOrdersApi';
import { Scissors, Clock, FileText, User, ChevronRight, Plus, X, Phone, MapPin, Info, Shirt, Layers, AlertCircle, Calendar, ShieldAlert } from 'lucide-react';
import './CustomOrders.css';

const MEASUREMENT_FIELDS = {
  Shirt: ['Chest', 'Shoulder', 'Sleeve', 'Neck', 'Length', 'Waist'],
  Pant: ['Waist', 'Hip', 'Inseam', 'Outseam', 'Bottom'],
  Blouse: ['Bust', 'Waist', 'Sleeve', 'Neck', 'Length'],
  Dress: ['Bust', 'Waist', 'Hip', 'Length', 'Sleeve'],
  Suit: ['Chest', 'Shoulder', 'Sleeve', 'Waist', 'Length', 'Inseam'],
  Uniform: ['Chest', 'Waist', 'Length', 'Shoulder'],
  Other: ['Chest', 'Waist', 'Length']
};

const CustomOrders = () => {
  const user = useSelector(selectCurrentUser);
  const { data: ordersData, isLoading: ordersLoading, refetch } = useGetClientCustomOrdersQuery();
  const { data: tailorsData, isLoading: tailorsLoading } = useGetTailorsQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateCustomOrderMutation();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [expandedLogs, setExpandedLogs] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');

  const toggleLog = (orderId) => {
    setExpandedLogs(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const orders = ordersData?.orders || [];
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => !['Completed', 'Delivered'].includes(o.status) && o.tailorId).length;
  const completedOrders = orders.filter(o => ['Completed', 'Delivered'].includes(o.status)).length;
  const broadcastOrders = orders.filter(o => !o.tailorId).length;

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'Broadcasts') return !order.tailorId;
    if (activeFilter === 'Active') return !['Completed', 'Delivered'].includes(order.status) && order.tailorId;
    if (activeFilter === 'Completed') return ['Completed', 'Delivered'].includes(order.status);
    return true; // 'All'
  });

  // Form State
  const [clientDetails, setClientDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  });

  const [fabricDetails, setFabricDetails] = useState({
    fabricType: '',
    description: '',
    quantity: '',
    notes: '',
  });

  const [products, setProducts] = useState([
    {
      productType: 'Shirt',
      totalQuantity: 1,
      sizeGroups: [
        {
          quantity: 1,
          measurements: {
            Chest: '',
            Shoulder: '',
            Sleeve: '',
            Neck: '',
            Length: '',
            Waist: '',
          }
        }
      ]
    }
  ]);

  const [designRequirements, setDesignRequirements] = useState({
    description: '',
    styleInstructions: '',
    referenceNotes: '',
    customInstructions: '',
    specialRequests: '',
  });

  const [orderDetails, setOrderDetails] = useState({
    tailorId: '', // Empty means broadcast / open order
    expectedDeliveryDate: '',
    priority: 'Medium',
    notes: '',
  });

  // Event Handlers for Nested Client/Fabric/Order Details
  const handleClientDetailsChange = (e) => {
    setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
  };

  const handleFabricDetailsChange = (e) => {
    setFabricDetails({ ...fabricDetails, [e.target.name]: e.target.value });
  };

  const handleOrderDetailsChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleDesignRequirementsChange = (e) => {
    setDesignRequirements({ ...designRequirements, [e.target.name]: e.target.value });
  };

  // Products and Size Group Form Updates
  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        productType: 'Shirt',
        totalQuantity: 1,
        sizeGroups: [
          {
            quantity: 1,
            measurements: {
              Chest: '',
              Shoulder: '',
              Sleeve: '',
              Neck: '',
              Length: '',
              Waist: '',
            }
          }
        ]
      }
    ]);
  };

  const handleRemoveProduct = (pIdx) => {
    const updated = products.filter((_, idx) => idx !== pIdx);
    setProducts(updated);
  };

  const handleProductTypeChange = (pIdx, type) => {
    const updated = [...products];
    updated[pIdx].productType = type;
    
    // Reset size groups with the new dynamic fields
    const defaultFields = MEASUREMENT_FIELDS[type] || ['Chest', 'Waist', 'Length'];
    const defaultMeasurements = {};
    defaultFields.forEach(f => {
      defaultMeasurements[f] = '';
    });

    updated[pIdx].sizeGroups = [
      {
        quantity: updated[pIdx].totalQuantity,
        measurements: defaultMeasurements
      }
    ];
    setProducts(updated);
  };

  const handleProductTotalQtyChange = (pIdx, qty) => {
    const updated = [...products];
    const numericQty = parseInt(qty, 10) || 0;
    updated[pIdx].totalQuantity = numericQty;
    
    // If only one size group exists, automatically update its quantity to match total quantity
    if (updated[pIdx].sizeGroups.length === 1) {
      updated[pIdx].sizeGroups[0].quantity = numericQty;
    }
    setProducts(updated);
  };

  const handleAddSizeGroup = (pIdx) => {
    const updated = [...products];
    const type = updated[pIdx].productType;
    const defaultFields = MEASUREMENT_FIELDS[type] || ['Chest', 'Waist', 'Length'];
    const defaultMeasurements = {};
    defaultFields.forEach(f => {
      defaultMeasurements[f] = '';
    });

    updated[pIdx].sizeGroups.push({
      quantity: 1,
      measurements: defaultMeasurements
    });
    setProducts(updated);
  };

  const handleRemoveSizeGroup = (pIdx, sgIdx) => {
    const updated = [...products];
    updated[pIdx].sizeGroups = updated[pIdx].sizeGroups.filter((_, idx) => idx !== sgIdx);
    
    // If only one size group remains, reset its quantity to match total product quantity
    if (updated[pIdx].sizeGroups.length === 1) {
      updated[pIdx].sizeGroups[0].quantity = updated[pIdx].totalQuantity;
    }
    setProducts(updated);
  };

  const handleSizeGroupQtyChange = (pIdx, sgIdx, qty) => {
    const updated = [...products];
    updated[pIdx].sizeGroups[sgIdx].quantity = parseInt(qty, 10) || 0;
    setProducts(updated);
  };

  const handleMeasurementChange = (pIdx, sgIdx, field, val) => {
    const updated = [...products];
    updated[pIdx].sizeGroups[sgIdx].measurements[field] = parseFloat(val) || '';
    setProducts(updated);
  };

  // Submit Order Creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic Validation
    if (!clientDetails.name || !clientDetails.phone) {
      setError('Please provide Client Name and Contact Number.');
      return;
    }
    if (!fabricDetails.fabricType || !fabricDetails.description) {
      setError('Please fill in Fabric Type and Description.');
      return;
    }
    if (products.length === 0) {
      setError('Please add at least one product type to be stitched.');
      return;
    }

    // Sizing Validation: check if sum of size groups matches product total quantity
    for (let i = 0; i < products.length; i++) {
      const prod = products[i];
      if (prod.totalQuantity <= 0) {
        setError(`Product #${i + 1} (${prod.productType}) must have a total quantity greater than 0.`);
        return;
      }
      const sumGroups = prod.sizeGroups.reduce((acc, sg) => acc + (sg.quantity || 0), 0);
      if (sumGroups !== prod.totalQuantity) {
        setError(`Validation Error for ${prod.productType}: The sum of all size group quantities (${sumGroups}) must equal the total product quantity (${prod.totalQuantity}).`);
        return;
      }
    }

    // Construct Payload
    const payload = {
      clientDetails,
      fabricDetails,
      products: products.map(p => ({
        productType: p.productType,
        totalQuantity: p.totalQuantity,
        sizeGroups: p.sizeGroups.map(sg => {
          // Filter out empty measurements
          const measurementsMap = {};
          Object.entries(sg.measurements).forEach(([key, val]) => {
            if (val !== '') measurementsMap[key] = Number(val);
          });
          return {
            quantity: sg.quantity,
            measurements: measurementsMap
          };
        })
      })),
      designRequirements,
      expectedDeliveryDate: orderDetails.expectedDeliveryDate || undefined,
      priority: orderDetails.priority,
      tailorId: orderDetails.tailorId || undefined,
      notes: orderDetails.notes,
    };

    try {
      await createOrder(payload).unwrap();
      setSuccess('Bespoke custom clothing order placed successfully!');
      setShowModal(false);
      refetch();
      // Reset State
      setClientDetails({ name: user?.name || '', phone: user?.phone || '', address: '', notes: '' });
      setFabricDetails({ fabricType: '', description: '', quantity: '', notes: '' });
      setProducts([{
        productType: 'Shirt',
        totalQuantity: 1,
        sizeGroups: [{
          quantity: 1,
          measurements: { Chest: '', Shoulder: '', Sleeve: '', Neck: '', Length: '', Waist: '' }
        }]
      }]);
      setDesignRequirements({ description: '', styleInstructions: '', referenceNotes: '', customInstructions: '', specialRequests: '' });
      setOrderDetails({ tailorId: '', expectedDeliveryDate: '', priority: 'Medium', notes: '' });
    } catch (err) {
      setError(err?.data?.message || 'Failed to submit tailoring order. Please try again.');
    }
  };

  const getStatusStepClass = (currentStatus, stepStatus) => {
    const statusOrder = [
      'Created',
      'Assigned',
      'Accepted',
      'Fabric Received',
      'Cutting In Progress',
      'Stitching In Progress',
      'Quality Check',
      'Completed',
      'Delivered'
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentIndex >= stepIndex) {
      return 'step-completed';
    }
    return 'step-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="custom-orders-page">
      <div className="custom-orders-header">
        <div>
          <h1 className="page-title">Custom Tailoring Dashboard</h1>
          <p className="page-subtitle">Design your clothing, configure multiple sizes, select your tailor, and monitor real-time updates.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={16} style={{ marginRight: '8px' }} /> Place New Order
        </button>
      </div>

      {success && <div className="feedback-alert success">{success}</div>}

      {/* Stats Overview */}
      <div className="client-stats-row animate-fadeUp">
        <div className="client-stat-card">
          <div className="stat-card-icon-wrapper total-icon">
            <FileText size={20} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Total Orders</span>
            <span className="stat-card-value">{totalOrders}</span>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-card-icon-wrapper active-icon">
            <Scissors size={20} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Active Stitching</span>
            <span className="stat-card-value">{activeOrders}</span>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-card-icon-wrapper completed-icon">
            <Clock size={20} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Completed Stitches</span>
            <span className="stat-card-value">{completedOrders}</span>
          </div>
        </div>
        <div className="client-stat-card">
          <div className="stat-card-icon-wrapper broadcast-icon">
            <Layers size={20} />
          </div>
          <div className="stat-card-content">
            <span className="stat-card-label">Open Broadcasts</span>
            <span className="stat-card-value">{broadcastOrders}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="client-filters-bar animate-fadeUp">
        <div className="filters-left">
          {['All', 'Active', 'Broadcasts', 'Completed'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${activeFilter === tab ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab} Orders
            </button>
          ))}
        </div>
        <div className="filters-right">
          <span className="orders-count-indicator">Showing {filteredOrders.length} orders</span>
        </div>
      </div>

      <div className="orders-container">
        {ordersLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner" />
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state animate-fadeUp">
            <Scissors size={48} className="empty-icon" />
            <h3>No Custom Orders Yet</h3>
            <p>Provide your fabric, enter sizes or custom measurements, and broadcast your order for tailors to accept.</p>
            <button className="btn btn--primary" onClick={() => setShowModal(true)}>
              Place Your First Order
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state animate-fadeUp">
            <Scissors size={48} className="empty-icon" />
            <h3>No {activeFilter} Orders</h3>
            <p>You don't have any custom orders in the "{activeFilter}" status filter right now.</p>
            <button className="btn btn--secondary" onClick={() => setActiveFilter('All')}>
              Show All Orders
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card animate-fadeUp">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-badge">{order.orderId}</span>
                    <span className={`priority-badge priority-${order.priority.toLowerCase()}`}>
                      {order.priority} Priority
                    </span>
                  </div>
                  <div className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-card-grid-body">
                  {/* Left Column: Spec Sheet & Details */}
                  <div className="order-grid-column specs-column">
                    <div className="info-section">
                      <div className="info-section-title"><User size={14} /> Contact Details (For Delivery)</div>
                      <div className="info-section-content">
                        <p><strong>Name:</strong> {order.clientDetails?.name}</p>
                        <p><strong>Phone:</strong> {order.clientDetails?.phone}</p>
                        {order.clientDetails?.address && <p className="address-paragraph"><strong>Address:</strong> {order.clientDetails.address}</p>}
                        {order.clientDetails?.notes && <p className="spec-notes"><strong>Notes:</strong> {order.clientDetails.notes}</p>}
                      </div>
                    </div>

                    <div className="info-section">
                      <div className="info-section-title"><Layers size={14} /> Fabric Details</div>
                      <div className="info-section-content">
                        <p><strong>Material:</strong> {order.fabricDetails?.fabricType}</p>
                        <p><strong>Quantity:</strong> {order.fabricDetails?.quantity || 'Not specified'}</p>
                        <p className="spec-desc"><strong>Desc:</strong> {order.fabricDetails?.description}</p>
                        {order.fabricDetails?.notes && <p className="spec-notes"><strong>Fabric Notes:</strong> {order.fabricDetails.notes}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Products & Sizing Groups */}
                  <div className="order-grid-column sizing-column">
                    <div className="info-section">
                      <div className="info-section-title"><Shirt size={14} /> Products & Sizing Groups</div>
                      <div className="info-section-content product-section-container">
                        {order.products?.map((prod, pIdx) => (
                          <div key={pIdx} className="product-summary-block">
                            <div className="product-summary-header">
                              <span className="prod-badge">{prod.productType}</span>
                              <span className="prod-qty">Total Qty: {prod.totalQuantity}</span>
                            </div>
                            
                            <div className="size-group-summary-list">
                              {prod.sizeGroups?.map((sg, sgIdx) => (
                                <div key={sgIdx} className="sg-summary-block">
                                  <div className="sg-title">Size Group #{sgIdx + 1} ({sg.quantity} items)</div>
                                  <div className="sg-measurements-grid">
                                    {Object.entries(sg.measurements || {}).map(([key, val]) => (
                                      <div key={key} className="measurement-tag">
                                        <span className="m-key">{key}:</span>
                                        <span className="m-val">{val}"</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Design Instructions & Tailor Assignment */}
                  <div className="order-grid-column design-column">
                    {order.designRequirements && (Object.values(order.designRequirements).some(v => v)) && (
                      <div className="info-section">
                        <div className="info-section-title"><FileText size={14} /> Design Instructions</div>
                        <div className="info-section-content design-rules-content">
                          {order.designRequirements.description && <p><strong>Description:</strong> {order.designRequirements.description}</p>}
                          {order.designRequirements.styleInstructions && <p><strong>Style Instructions:</strong> {order.designRequirements.styleInstructions}</p>}
                          {order.designRequirements.customInstructions && <p><strong>Requests:</strong> {order.designRequirements.customInstructions}</p>}
                          {order.designRequirements.specialRequests && <p><strong>Special:</strong> {order.designRequirements.specialRequests}</p>}
                          {order.designRequirements.referenceNotes && <p><strong>Reference:</strong> {order.designRequirements.referenceNotes}</p>}
                        </div>
                      </div>
                    )}

                    <div className="info-section assignment-section">
                      <div className="info-section-title"><Calendar size={14} /> Assignment & Dates</div>
                      <div className="info-section-content">
                        <div className="assignment-detail-row">
                          <span className="row-label">Assigned Tailor:</span>
                          <span className="row-value">
                            {order.tailorId ? (
                              <span className="tailor-badge-pill">
                                {order.tailorId.shopName || 'Custom Tailor'}
                              </span>
                            ) : (
                              <span className="broadcast-badge-pill">Broadcast (Open)</span>
                            )}
                          </span>
                        </div>
                        <div className="assignment-detail-row">
                          <span className="row-label">Expected Delivery:</span>
                          <span className="row-value date-value">{formatDate(order.expectedDeliveryDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="order-timeline-footer">
                  <div className="timeline-title-row">
                    <span>Stitching Progress Tracker</span>
                    <span className="timeline-current-status">Current Status: <strong>{order.status}</strong></span>
                  </div>
                  
                  <div className="status-timeline-row">
                    {[
                      { label: 'Created', status: 'Created' },
                      { label: 'Accepted', status: 'Accepted' },
                      { label: 'Fabric Received', status: 'Fabric Received' },
                      { label: 'Cutting', status: 'Cutting In Progress' },
                      { label: 'Stitching', status: 'Stitching In Progress' },
                      { label: 'Completed', status: 'Completed' },
                      { label: 'Delivered', status: 'Delivered' }
                    ].map((step, idx, arr) => (
                      <div key={idx} className="timeline-step-node">
                        <div className={`step-dot ${getStatusStepClass(order.status, step.status)}`}>
                          {getStatusStepClass(order.status, step.status) === 'step-completed' ? '✓' : idx + 1}
                        </div>
                        <span className="step-label">{step.label}</span>
                        {idx < arr.length - 1 && (
                          <div className={`step-connector-line ${getStatusStepClass(order.status, arr[idx+1].status) === 'step-completed' ? 'connector-completed' : 'connector-pending'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible History Logs */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div className="activity-logs-collapsible">
                    <button 
                      type="button" 
                      className="btn btn--ghost btn--sm toggle-history-btn"
                      onClick={() => toggleLog(order._id)}
                    >
                      {expandedLogs[order._id] ? 'Hide Activity History' : 'Show Activity History'} ({order.statusHistory.length})
                    </button>
                    
                    {expandedLogs[order._id] && (
                      <div className="activity-history-panel">
                        <ul className="history-timeline-list">
                          {order.statusHistory.slice().reverse().map((hist, idx) => (
                            <li key={idx} className="history-item animate-fadeDown">
                              <span className="history-date">{formatDate(hist.timestamp)}:</span>
                              <span className="history-status">{hist.status}</span>
                              {hist.note && <span className="history-note"> — {hist.note}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE ORDER MODAL */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal wide-modal">
            <div className="modal-header">
              <h3>Place Custom Tailoring Order</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="feedback-alert error"><AlertCircle size={16} /> {error}</div>}

              {/* SECTION 1: Client Details */}
              <div className="form-section-card">
                <h4 className="section-title"><User size={16} /> 1. Client Contact Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={clientDetails.name}
                      onChange={handleClientDetailsChange}
                      placeholder="e.g. Rahul Sharma"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={clientDetails.phone}
                      onChange={handleClientDetailsChange}
                      placeholder="e.g. +91 9876543210"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address for Delivery (Optional)</label>
                  <textarea
                    name="address"
                    value={clientDetails.address}
                    onChange={handleClientDetailsChange}
                    placeholder="Enter your shipping/stitching delivery address..."
                    className="form-input text-area small-area"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Notes (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    value={clientDetails.notes}
                    onChange={handleClientDetailsChange}
                    placeholder="e.g., Gate code is 1234 / Call before delivery"
                    className="form-input"
                  />
                </div>
              </div>

              {/* SECTION 2: Fabric Details */}
              <div className="form-section-card">
                <h4 className="section-title"><Layers size={16} /> 2. Fabric Details (Provided by Client)</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fabric Type <span className="required">*</span></label>
                    <input
                      type="text"
                      name="fabricType"
                      value={fabricDetails.fabricType}
                      onChange={handleFabricDetailsChange}
                      placeholder="e.g. Cotton, Linen, Denim"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fabric Quantity (Optional)</label>
                    <input
                      type="text"
                      name="quantity"
                      value={fabricDetails.quantity}
                      onChange={handleFabricDetailsChange}
                      placeholder="e.g. 3.5 meters"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fabric Description <span className="required">*</span></label>
                  <input
                    type="text"
                    name="description"
                    value={fabricDetails.description}
                    onChange={handleFabricDetailsChange}
                    placeholder="e.g., Light blue self-striped Egyptian cotton"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Notes / Fabric Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={fabricDetails.notes}
                    onChange={handleFabricDetailsChange}
                    placeholder="e.g., Dropping off fabric at shop tomorrow morning"
                    className="form-input"
                  />
                </div>
              </div>

              {/* SECTION 3: Products & Sizing Groups */}
              <div className="form-section-card">
                <div className="section-header-flex">
                  <h4 className="section-title"><Shirt size={16} /> 3. Products & Sizing Groups</h4>
                  <button type="button" className="btn btn--secondary btn--sm" onClick={handleAddProduct}>
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                <div className="form-products-container">
                  {products.map((prod, pIdx) => (
                    <div key={pIdx} className="product-form-card">
                      <div className="product-form-header">
                        <h5>Product #{pIdx + 1}</h5>
                        {products.length > 1 && (
                          <button type="button" className="btn-icon-close" onClick={() => handleRemoveProduct(pIdx)}>
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-sub">Product Type <span className="required">*</span></label>
                          <select
                            value={prod.productType}
                            onChange={(e) => handleProductTypeChange(pIdx, e.target.value)}
                            className="form-input"
                            required
                          >
                            {['Shirt', 'Pant', 'Dress', 'Suit', 'Uniform', 'Blouse', 'Other'].map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label-sub">Total Quantity <span className="required">*</span></label>
                          <input
                            type="number"
                            min="1"
                            value={prod.totalQuantity}
                            onChange={(e) => handleProductTotalQtyChange(pIdx, e.target.value)}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>

                      {/* Size Groups */}
                      <div className="size-groups-form-section">
                        <div className="sg-form-header-flex">
                          <h6>Size Groups & Measurements</h6>
                          <button type="button" className="btn btn--secondary btn--sm btn-add-sg" onClick={() => handleAddSizeGroup(pIdx)}>
                            <Plus size={12} /> Add Size Group
                          </button>
                        </div>

                        <div className="size-groups-list">
                          {prod.sizeGroups.map((sg, sgIdx) => (
                            <div key={sgIdx} className="size-group-form-row">
                              <div className="sg-form-title-row">
                                <span>Size Group #{sgIdx + 1}</span>
                                {prod.sizeGroups.length > 1 && (
                                  <button type="button" className="btn-remove-sg" onClick={() => handleRemoveSizeGroup(pIdx, sgIdx)}>
                                    Remove Group
                                  </button>
                                )}
                              </div>

                              <div className="form-group qty-group">
                                <label className="form-label-sub">Quantity using this size <span className="required">*</span></label>
                                <input
                                  type="number"
                                  min="1"
                                  value={sg.quantity}
                                  onChange={(e) => handleSizeGroupQtyChange(pIdx, sgIdx, e.target.value)}
                                  className="form-input"
                                  disabled={prod.sizeGroups.length === 1}
                                  required
                                />
                              </div>

                              <div className="measurements-form-inputs">
                                {(MEASUREMENT_FIELDS[prod.productType] || ['Chest', 'Waist', 'Length']).map(field => (
                                  <div key={field} className="m-input-item">
                                    <label>{field} (in)</label>
                                    <input
                                      type="number"
                                      step="0.1"
                                      placeholder="--"
                                      value={sg.measurements[field] || ''}
                                      onChange={(e) => handleMeasurementChange(pIdx, sgIdx, field, e.target.value)}
                                      className="form-input text-center"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {prod.sizeGroups.length > 1 && (
                          <div className="sum-validation-label">
                            Sum of Size Groups:{' '}
                            <span className={prod.sizeGroups.reduce((acc, curr) => acc + (curr.quantity || 0), 0) === prod.totalQuantity ? 'text-success' : 'text-danger'}>
                              {prod.sizeGroups.reduce((acc, curr) => acc + (curr.quantity || 0), 0)}
                            </span>{' '}
                            / {prod.totalQuantity} total quantity
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Design & Style Instructions */}
              <div className="form-section-card">
                <h4 className="section-title"><FileText size={16} /> 4. Design & Style Requirements</h4>
                <div className="form-group">
                  <label className="form-label">Design Description</label>
                  <input
                    type="text"
                    name="description"
                    value={designRequirements.description}
                    onChange={handleDesignRequirementsChange}
                    placeholder="e.g. Slim fit office wear shirts"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Style Instructions</label>
                  <textarea
                    name="styleInstructions"
                    value={designRequirements.styleInstructions}
                    onChange={handleDesignRequirementsChange}
                    placeholder="Enter detailed style guidelines (collar style, cuffs, buttons, fit, pockets)..."
                    className="form-input text-area small-area"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Custom Instructions</label>
                    <input
                      type="text"
                      name="customInstructions"
                      value={designRequirements.customInstructions}
                      onChange={handleDesignRequirementsChange}
                      placeholder="e.g., Double stitching on side seams"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Requests</label>
                    <input
                      type="text"
                      name="specialRequests"
                      value={designRequirements.specialRequests}
                      onChange={handleDesignRequirementsChange}
                      placeholder="e.g., Monogram 'RS' inside collar"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Reference Notes (Link or Notes)</label>
                  <input
                    type="text"
                    name="referenceNotes"
                    value={designRequirements.referenceNotes}
                    onChange={handleDesignRequirementsChange}
                    placeholder="Reference links to visual styles or notes..."
                    className="form-input"
                  />
                </div>
              </div>

              {/* SECTION 5: Tailor & Order Details */}
              <div className="form-section-card">
                <h4 className="section-title"><Calendar size={16} /> 5. Assignment & Date Parameters</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assigned Tailor</label>
                    <select
                      name="tailorId"
                      value={orderDetails.tailorId}
                      onChange={handleOrderDetailsChange}
                      className="form-input"
                    >
                      <option value="">Broadcast to All Tailors (Open Order)</option>
                      {tailorsLoading ? (
                        <option disabled>Loading tailors list...</option>
                      ) : (
                        tailorsData?.tailors?.map((t) => (
                          <option key={t.userId?._id} value={t.userId?._id}>
                            {t.shopName} ({t.userId?.name})
                          </option>
                        ))
                      )}
                    </select>
                    <small className="help-text">If left empty, all active tailors will receive a real-time notification to accept the order.</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected Delivery Date</label>
                    <input
                      type="date"
                      name="expectedDeliveryDate"
                      value={orderDetails.expectedDeliveryDate}
                      onChange={handleOrderDetailsChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Order Priority</label>
                    <select
                      name="priority"
                      value={orderDetails.priority}
                      onChange={handleOrderDetailsChange}
                      className="form-input"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">General Notes / Comments</label>
                    <input
                      type="text"
                      name="notes"
                      value={orderDetails.notes}
                      onChange={handleOrderDetailsChange}
                      placeholder="Any general comments about this order..."
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions mt-3">
                <button type="button" className="btn btn--secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary btn--lg" disabled={isCreating}>
                  {isCreating ? <><span className="spinner" /> Placing order…</> : 'Place Custom Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrders;
