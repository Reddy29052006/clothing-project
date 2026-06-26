import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  useGetOpenCustomOrdersQuery,
  useAcceptCustomOrderMutation
} from '../../../services/customOrdersApi';
import { Scissors, FileText, Calendar, User, Phone, MapPin, Layers, Shirt, ClipboardCheck, AlertCircle, Info, Bell, X } from 'lucide-react';
import './OpenOrders.css';

const OpenOrders = () => {
  const { data: ordersData, isLoading, refetch } = useGetOpenCustomOrdersQuery();
  const [acceptOrder, { isLoading: isAccepting }] = useAcceptCustomOrderMutation();
  const [notifications, setNotifications] = useState([]);

  // Socket.io Real-time connection setup
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL, {
      transports: ['polling', 'websocket']
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to tailoring notification gateway');
    });

    socket.on('newCustomOrder', (newOrder) => {
      // Add custom toast notification
      const notificationId = Date.now();
      setNotifications((prev) => [
        ...prev,
        {
          id: notificationId,
          message: `New Order placed by ${newOrder.clientName || 'Client'}: ${newOrder.products}`
        }
      ]);

      // Auto-clear notification after 8 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter(n => n.id !== notificationId));
      }, 8000);

      // Refresh data
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  const handleAccept = async (id) => {
    try {
      await acceptOrder(id).unwrap();
      refetch();
    } catch (err) {
      alert(err?.data?.message || 'Failed to accept order.');
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="open-orders-page">
      {/* Toast Notifications Panel */}
      <div className="live-notifications-panel">
        {notifications.map((notif) => (
          <div key={notif.id} className="live-toast animate-slideIn">
            <div className="toast-content">
              <Bell size={18} className="toast-icon animate-bounce" />
              <span>{notif.message}</span>
            </div>
            <button className="toast-close" onClick={() => removeNotification(notif.id)}><X size={14} /></button>
          </div>
        ))}
      </div>

      <div className="open-orders-header">
        <div>
          <h1 className="page-title">Open Job Board</h1>
          <p className="page-subtitle">View tailoring jobs broadcasted by clients. Review measurements, fabric details, and expected delivery before accepting.</p>
        </div>
      </div>

      <div className="open-orders-container">
        {isLoading ? (
          <div className="loading-spinner-container">
            <div className="spinner" />
          </div>
        ) : !ordersData?.orders || ordersData.orders.length === 0 ? (
          <div className="empty-state">
            <Scissors size={48} className="empty-icon animate-pulse" />
            <h3>Job Board is Empty</h3>
            <p>There are no open custom tailoring orders available at the moment. As soon as a client posts a job, it will show up here in real-time.</p>
          </div>
        ) : (
          <div className="open-orders-grid">
            {ordersData.orders.map((order) => (
              <div key={order._id} className="open-order-card animate-fadeUp">
                <div className="order-card-header">
                  <div>
                    <span className="order-id-badge">{order.orderId}</span>
                    <span className={`priority-badge priority-${order.priority?.toLowerCase() || 'medium'}`}>
                      {order.priority || 'Medium'} Priority
                    </span>
                  </div>
                  <div className="broadcast-status-badge">
                    Waiting for Tailor
                  </div>
                </div>

                <div className="order-card-body">
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
                    <h3 className="section-title-tag"><Shirt size={14} /> Products & Sizing Requirements</h3>
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

                  {/* Delivery Parameters */}
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

                  {/* Acceptance Action */}
                  <div className="tailor-actions-section mt-3">
                    <button
                      className="btn btn--primary btn--lg w-full"
                      onClick={() => handleAccept(order._id)}
                      disabled={isAccepting}
                    >
                      <ClipboardCheck size={18} style={{ marginRight: '8px' }} />
                      {isAccepting ? 'Accepting Job...' : 'Accept Job & Add to Workspace'}
                    </button>
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

export default OpenOrders;
