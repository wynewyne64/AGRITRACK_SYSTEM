import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig.js";
import { Box, Package, Edit3, Trash2, PlusCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    date_added: "",
  });
  const [editItem, setEditItem] = useState(null);
  const token = localStorage.getItem("access_token");

  // Fetch Inventory
  useEffect(() => {
    if (!token) {
      toast.warning("No valid token found. Please log in again.");
      setLoading(false);
      return;
    }
    axiosInstance
      .get("http://127.0.0.1:8000/inventory/inventorys/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Fetched inventory:", res.data);
        setInventory(res.data);

        // Get farmer ID from the first item (if exists)
        if (res.data.length > 0 && res.data[0].farmer) {
          setFarmerId(res.data[0].farmer);
          console.log("Farmer ID from inventory:", res.data[0].farmer);
        }
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        if (err.response) {
          toast.error(`Failed to load inventory: ${err.response.status}`);
        } else {
          toast.error("Failed to load inventory. Check your connection.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Add Inventory Item
  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      toast.error("Farmer ID not found. Please add at least one item first or contact support.");
      return;
    }

    const data = { ...newItem, farmer: farmerId };

    console.log("=== ADDING INVENTORY ITEM ===");
    console.log("Data being sent:", data);

    try {
      const res = await axiosInstance.post(
        "http://127.0.0.1:8000/inventory/inventorys/",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInventory([...inventory, res.data]);
      setShowAddModal(false);
      setNewItem({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        date_added: "",
      });
      toast.success("Item added successfully!");
    } catch (err) {
      console.error("=== ADD INVENTORY ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to add item. ";
        if (typeof err.response.data === 'object') {
          Object.keys(err.response.data).forEach(key => {
            const value = Array.isArray(err.response.data[key])
              ? err.response.data[key].join(', ')
              : err.response.data[key];
            errorMessage += `${key}: ${value}. `;
          });
        } else {
          errorMessage += err.response.data;
        }

        toast.error(errorMessage);
      } else {
        toast.error("Failed to add item. Check your connection.");
      }
    }
  };

  // Edit Inventory Item
  const handleEditItem = async (e) => {
    e.preventDefault();

    if (!editItem || !editItem.id) {
      toast.error("Invalid item data. Please try again.");
      return;
    }

    const data = { ...editItem, farmer: editItem.farmer || farmerId };

    console.log("=== EDITING INVENTORY ITEM ===");
    console.log("Item ID:", editItem.id);
    console.log("Data being sent:", data);

    try {
      const res = await axiosInstance.put(
        `http://127.0.0.1:8000/inventory/inventorys/${editItem.id}/`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInventory(inventory.map((i) => (i.id === editItem.id ? res.data : i)));
      setShowEditModal(false);
      setEditItem(null);
      toast.success("Item updated successfully!");
    } catch (err) {
      console.error("=== EDIT INVENTORY ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to update item. ";
        if (typeof err.response.data === 'object') {
          Object.keys(err.response.data).forEach(key => {
            const value = Array.isArray(err.response.data[key])
              ? err.response.data[key].join(', ')
              : err.response.data[key];
            errorMessage += `${key}: ${value}. `;
          });
        } else {
          errorMessage += err.response.data;
        }

        toast.error(errorMessage);
      } else {
        toast.error("Failed to update item. Check your connection.");
      }
    }
  };

  // Delete Inventory Item
  const handleDeleteItem = async (id) => {
    console.log("=== DELETE BUTTON CLICKED ===");
    console.log("Item ID:", id);

    if (!id) {
      toast.error("Invalid item ID. Please try again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this record?")) return;

    console.log("=== DELETING INVENTORY ITEM ===");

    try {
      await axiosInstance.delete(
        `http://127.0.0.1:8000/inventory/inventorys/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInventory(inventory.filter((i) => i.id !== id));
      setSelectedItem(null);
      toast.success("Item deleted successfully!");
    } catch (err) {
      console.error("=== DELETE INVENTORY ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to delete item. ";
        if (typeof err.response.data === 'object') {
          Object.keys(err.response.data).forEach(key => {
            const value = Array.isArray(err.response.data[key])
              ? err.response.data[key].join(', ')
              : err.response.data[key];
            errorMessage += `${key}: ${value}. `;
          });
        } else {
          errorMessage += err.response.data;
        }

        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete item. Check your connection.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center mt-5 text-muted">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(240,240,245,1) 0%, rgba(210,220,235,1) 100%)",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <Package className="me-2" size={30} />
          Farm Inventory
        </h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="me-2" /> Add Item
        </button>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="text-center text-muted">
          <Box size={50} className="text-primary mb-3" />
          <p>No inventory items found. Add one to get started!</p>
        </div>
      ) : (
        <div className="row g-4">
          {inventory.map((item, index) => (
            <div key={item.id || `item-${index}`} className="col-md-4 col-sm-6">
              <div
                className="card border-0 shadow-sm p-4"
                style={{
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  transition: "transform 0.3s ease",
                }}
              >
                <h5 className="text-primary fw-bold">{item.name}</h5>
                <p className="text-muted mb-1">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="text-muted mb-1">
                  <strong>Quantity:</strong> {item.quantity} {item.unit}
                </p>
                <p className="text-muted">
                  <strong>Date Added:</strong> {item.date_added}
                </p>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Edit button clicked for item:", item);
                      setEditItem({
                        id: item.id,
                        farmer: item.farmer,
                        name: item.name,
                        category: item.category,
                        quantity: item.quantity,
                        unit: item.unit,
                        date_added: item.date_added,
                      });
                      setShowEditModal(true);
                    }}
                  >
                    <Edit3 size={16} className="me-1" /> Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete button clicked for item:", item);
                      handleDeleteItem(item.id);
                    }}
                  >
                    <Trash2 size={16} className="me-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Add Inventory Item</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddItem}>
                <div className="modal-body">
                  {["name", "category", "quantity", "unit", "date_added"].map(
                    (field) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label text-capitalize">
                          {field.replace("_", " ")}
                        </label>
                        <input
                          type={
                            field === "date_added"
                              ? "date"
                              : field === "quantity"
                              ? "number"
                              : "text"
                          }
                          step={field === "quantity" ? "0.01" : undefined}
                          className="form-control"
                          value={newItem[field]}
                          onChange={(e) =>
                            setNewItem({ ...newItem, [field]: e.target.value })
                          }
                          required
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Item
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && editItem && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Inventory Item</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditItem}>
                <div className="modal-body">
                  {["name", "category", "quantity", "unit", "date_added"].map(
                    (field) => (
                      <div className="mb-3" key={field}>
                        <label className="form-label text-capitalize">
                          {field.replace("_", " ")}
                        </label>
                        <input
                          type={
                            field === "date_added"
                              ? "date"
                              : field === "quantity"
                              ? "number"
                              : "text"
                          }
                          step={field === "quantity" ? "0.01" : undefined}
                          className="form-control"
                          value={editItem[field]}
                          onChange={(e) =>
                            setEditItem({ ...editItem, [field]: e.target.value })
                          }
                          required
                        />
                      </div>
                    )
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Update Item
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditItem(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}