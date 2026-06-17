import { useState } from 'react';
import {
  useGetTailorCustomOrdersQuery,
  useAcceptCustomOrderMutation,
  useUpdateCustomOrderStatusMutation
} from '../../../services/customOrdersApi';
import { Scissors, FileText, Calendar, User, Phone, MapPin, Layers, Shirt, RefreshCw, CheckCircle, Truck, Clipboard, Activity } from 'lucide-react';
import './TailorOrders.css';

const TailorOrders = () => {
  const { data: ordersData, isLoading, refetch } = useGetTailorCustomOrdersQuery();
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptCustomOrderMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateCustomOrderStatusMutation();

  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned', 'progress', 'completed'
  const [noteFormId, setNoteFormId] = useState(null);
  const [statusNote, setStatusNote] = useState('');

  const handleAccept = async (id) => {
    try {
      await acceptOrder(id).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Failed to accept order.');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status, note: statusNote }).unwrap();
      setNoteFormId(null);
      setStatusNote('');
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Failed to update status.');
    }
  };

  const getFilteredOrders = () => {
    if (!ordersData?.orders) return [];

    return ordersData.orders.filter((order) => {
      if (activeTab === 'assigned') {
        return order.status === 'Assigned';
      }
      if (activeTab === 'progress') {
        return [
          'Accepted',
          'Fabric Received',
          'Cutting In Progress',
          'Stitching In Progress',
          'Quality Check'
        ].includes(order.status);
      }
      if (activeTab === 'completed') {
        return ['Completed', 'Delivered'].includes(order.status);
      }
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="tailor-orders-page">
      <div className="tailor-orders-header">
        <div>
          <h1 className="page-title">My Tailoring Jobs</h1>
          <p className="page-subtitle">Manage custom orders assigned to you, track sizing requirements, update status history, and deliver finished apparel.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tailor-tabs">
        <button
          className={`tab-btn ${activeTab === 'assigned' ? 'active' : ''}`}
          onClick={() => { setActiveTab('assigned'); setNoteFormId(null); }}
        >
          Directly Assigned ({ordersData?.orders?.filter(o => o.status === 'Assigned').length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => { setActiveTab('progress'); setNoteFormId(null); }}
        >
          Active Jobs ({ordersData?.orders?.filter(o => ['Accepted', 'Fabric Received', 'Cutting In Progress', 'Stitching In Progress', 'Quality Check'].includes(o.status)).length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('completed'); setNoteFormId(null); }}
        >
          Completed / Delivered ({ordersData?.orders?.filter(o => ['Completed', 'Delivered'].includes(o.status)).length || 0})
        </button>
      </div>

      {/* Orders List */}
      <div className="tailor-orders-container">
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Scissors size={48} className="empty-icon" />
            <h3>No Jobs Found</h3>
            <p>There are no tailoring orders in this status category.</p>
          </div>
        ) : (
          <div className="tailor-orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="tailor-order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-badge">{order.orderId}</span>
                    <span className={`priority-badge priority-${order.priority?.toLowerCase() || 'medium'}`}>
                      {order.priority || 'Medium'} Priority
                    </span>
                  </div>
                  <div className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </div>
                </div>

                <div className="tailor-order-body">
                  {/* Order Reference Details */}
                  <div className="info-block-wrapper client-info-details">
                    <h3 className="section-title-tag"><User size={14} /> Order Reference</h3>
                    <p><strong>Shipping Ref:</strong> {order.orderId}</p>
                    {order.clientDetails?.notes && <p className="text-muted"><em>Notes: {order.clientDetails.notes}</em></p>}
                  </div>

                  {/* Fabric Details Section */}
                  <div className="info-block-wrapper fabric-info-details">
                    <h3 className="section-title-tag"><Layers size={14} /> Fabric Provided</h3>
                    <p><strong>Fabric Type:</strong> {order.fabricDetails?.fabricType} | <strong>Quantity:</strong> {order.fabricDetails?.quantity || 'Not specified'}</p>
                    <p><strong>Description:</strong> {order.fabricDetails?.description}</p>
                    {order.fabricDetails?.notes && <p className="text-muted"><em>Fabric Notes: {order.fabricDetails.notes}</em></p>}
                  </div>

                  {/* Products Details List with Sizing Groups */}
                  <div className="info-block-wrapper products-info-details">
                    <h3 className="section-title-tag"><Shirt size={14} /> Products & Sizing Details</h3>
                    <div className="order-products-list">
                      {order.products?.map((prod, pIdx) => (
                        <div key={pIdx} className="product-summary-item">
                          <div className="product-item-header">
                            <span className="product-type-label">{prod.productType}</span>
                            <span className="product-qty-label">Total Qty: {prod.totalQuantity}</span>
                          </div>
                          
                          <div className="size-groups-summary">
                            {prod.sizeGroups?.map((sg, sgIdx) => (
                              <div key={sgIdx} className="size-group-summary-card">
                                <div className="sg-qty-header">Size Group #{sgIdx + 1} ({sg.quantity} items)</div>
                                <div className="sg-measurements-row">
                                  {Object.entries(sg.measurements || {}).map(([key, val]) => (
                                    <span key={key} className="measurement-bubble">
                                      {key}: {val}"
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design Requirements */}
                  {order.designRequirements && (Object.values(order.designRequirements).some(v => v)) && (
                    <div className="info-block-wrapper design-info-details">
                      <h3 className="section-title-tag"><FileText size={14} /> Design & Styling Requirements</h3>
                      {order.designRequirements.description && <p><strong>Description:</strong> {order.designRequirements.description}</p>}
                      {order.designRequirements.styleInstructions && <p><strong>Style Instructions:</strong> {order.designRequirements.styleInstructions}</p>}
                      {order.designRequirements.customInstructions && <p><strong>Custom Requests:</strong> {order.designRequirements.customInstructions}</p>}
                      {order.designRequirements.specialRequests && <p><strong>Special Requests:</strong> {order.designRequirements.specialRequests}</p>}
                      {order.designRequirements.referenceNotes && <p><strong>Reference Notes:</strong> {order.designRequirements.referenceNotes}</p>}
                    </div>
                  )}

                  {/* Date & Note block */}
                  <div className="meta-footer-info">
                    <div>
                      <strong>Expected Delivery:</strong> {formatDate(order.expectedDeliveryDate)}
                    </div>
                    {order.notes && (
                      <div>
                        <strong>Client Comments:</strong> {order.notes}
                      </div>
                    )}
                  </div>

                  {/* Activity Log */}
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="timeline-history">
                      <h4><Activity size={12} /> Activity Log</h4>
                      <ul>
                        {order.statusHistory.slice().reverse().map((hist, idx) => (
                          <li key={idx}>
                            <span className="timestamp">{formatDate(hist.timestamp)}:</span>{' '}
                            <strong>{hist.status}</strong> - {hist.note || 'Status updated'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Area */}
                  <div className="tailor-actions-section">
                    {order.status === 'Assigned' && (
                      <button
                        className="btn btn--primary"
                        onClick={() => handleAccept(order._id)}
                        disabled={isAccepting}
                      >
                        Accept Job & Await Fabric
                      </button>
                    )}

                    {['Accepted', 'Fabric Received', 'Cutting In Progress', 'Stitching In Progress', 'Quality Check', 'Completed'].includes(order.status) && (
                      <div className="workflow-action-box">
                        {noteFormId === order._id ? (
                          <div className="status-note-form">
                            <label className="form-label">Add progress note (optional):</label>
                            <input
                              type="text"
                              value={statusNote}
                              onChange={(e) => setStatusNote(e.target.value)}
                              placeholder="e.g. Fabric checked / pocket details started"
                              className="form-input"
                            />
                            <div className="form-actions-row">
                              <button
                                className="btn btn--secondary btn--sm"
                                onClick={() => { setNoteFormId(null); setStatusNote(''); }}
                              >
                                Cancel
                              </button>

                              {order.status === 'Accepted' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Fabric Received')}
                                  disabled={isUpdating}
                                >
                                  Mark Fabric Received
                                </button>
                              )}
                              {order.status === 'Fabric Received' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Cutting In Progress')}
                                  disabled={isUpdating}
                                >
                                  Start Cutting
                                </button>
                              )}
                              {order.status === 'Cutting In Progress' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Stitching In Progress')}
                                  disabled={isUpdating}
                                >
                                  Start Stitching
                                </button>
                              )}
                              {order.status === 'Stitching In Progress' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Quality Check')}
                                  disabled={isUpdating}
                                >
                                  Perform Quality Check
                                </button>
                              )}
                              {order.status === 'Quality Check' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Completed')}
                                  disabled={isUpdating}
                                >
                                  Complete Stitched Clothes
                                </button>
                              )}
                              {order.status === 'Completed' && (
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                  disabled={isUpdating}
                                >
                                  Deliver to Client
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <button
                            className="btn btn--primary"
                            onClick={() => setNoteFormId(order._id)}
                          >
                            <RefreshCw size={16} style={{ marginRight: '8px' }} />
                            {order.status === 'Accepted' && 'Mark Fabric Received...'}
                            {order.status === 'Fabric Received' && 'Start Cutting...'}
                            {order.status === 'Cutting In Progress' && 'Start Stitching...'}
                            {order.status === 'Stitching In Progress' && 'Send to Quality Check...'}
                            {order.status === 'Quality Check' && 'Mark Completed...'}
                            {order.status === 'Completed' && 'Deliver Order...'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TailorOrders;
