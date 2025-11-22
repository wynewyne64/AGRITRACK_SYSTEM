import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Spinner } from "react-bootstrap";
import { CalendarDays, ShoppingBag, DollarSign, Package } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/market/orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f8f4f0", minHeight: "100vh" }}
    >
      <h2 className="text-center mb-5 fw-bold" style={{ color: "#5a3825" }}>
        <ShoppingBag size={30} className="me-2" />
        My Orders
      </h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted fs-5">
          You haven’t placed any orders yet.
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="fw-bold" style={{ color: "#5a3825" }}>
                      <Package size={18} className="me-2" />
                      Order #{order.id}
                    </h5>
                    <span
                      className={`badge ${
                        order.payment_status === "C"
                          ? "bg-success"
                          : order.payment_status === "F"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.payment_status === "P"
                        ? "Pending"
                        : order.payment_status === "C"
                        ? "Complete"
                        : "Failed"}
                    </span>
                  </div>

                  <div className="text-muted small mb-2">
                    <CalendarDays size={14} className="me-1" />
                    {new Date(order.placed_at).toLocaleString()}
                  </div>

                  <hr />

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-2"
                    >
                      <div>
                        <strong>{item.market.name}</strong>
                        <div className="text-muted small">
                          {item.quantity} × {item.market.price_per_unit} KSh
                        </div>
                      </div>
                      <div className="fw-bold text-secondary">
                        {(item.quantity * item.market.price_per_unit).toFixed(
                          2
                        )}{" "}
                        KSh
                      </div>
                    </div>
                  ))}

                  <hr />
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 text-secondary">Total</h6>
                    <h5 className="fw-bold" style={{ color: "#5a3825" }}>
                      <DollarSign size={16} className="me-1" />
                      {order.items
                        .reduce(
                          (total, i) =>
                            total + i.quantity * i.market.price_per_unit,
                          0
                        )
                        .toFixed(2)}{" "}
                      KSh
                    </h5>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
