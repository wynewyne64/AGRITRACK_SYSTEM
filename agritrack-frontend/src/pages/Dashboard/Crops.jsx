import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig.js";
import {
  Leaf,
  Sprout,
  PlusCircle,
  Trash2,
  Edit3,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const cropImages = {
  orange: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg",
  mango: "https://upload.wikimedia.org/wikipedia/commons/9/90/Hapus_Mango.jpg",
  maize: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Corncobs.jpg",
  banana: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
  tomato: "https://upload.wikimedia.org/wikipedia/commons/8/88/Bright_red_tomato_and_cross_section02.jpg",
  wheat: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Wheat_close-up.JPG",
  default: "https://upload.wikimedia.org/wikipedia/commons/7/70/Fruit_Basket.jpg",
};

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const [newCrop, setNewCrop] = useState({
    name: "",
    planting_date: "",
    expected_harvest_date: "",
    yield_estimate: "",
    status: "planted",
    image: null,
  });
  const [editCrop, setEditCrop] = useState(null);

  const token = localStorage.getItem("access_token");

  //  Fetch Crops and Farmer ID
  useEffect(() => {
    if (!token) {
      toast.warning("No valid token found. Please log in again.");
      setLoading(false);
      return;
    }

    axiosInstance
      .get("http://127.0.0.1:8000/crops/cropss/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Fetched crops:", res.data);
        setCrops(res.data);

        // Get farmer ID from the first crop (if exists)
        if (res.data.length > 0 && res.data[0].farmer) {
          setFarmerId(res.data[0].farmer);
          console.log("Farmer ID from crops:", res.data[0].farmer);
        }
      })
      .catch((err) => {
        console.error("Error fetching crops:", err);
        if (err.response) {
          toast.error(`Failed to load crops: ${err.response.data?.detail || err.response.statusText}`);
        } else {
          toast.error("Failed to load crops. Check your connection.");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  //  Add Crop
  const handleAddCrop = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      toast.error("Farmer ID not found. Please ensure you have at least one crop or contact support.");
      return;
    }

    const formData = new FormData();

    // Add the farmer ID
    formData.append("farmer", farmerId);

    // Add other fields
    formData.append("name", newCrop.name);
    formData.append("planting_date", newCrop.planting_date);
    formData.append("expected_harvest_date", newCrop.expected_harvest_date);
    formData.append("yield_estimate", newCrop.yield_estimate);
    formData.append("status", newCrop.status);

    // Only append image if it exists
    if (newCrop.image && newCrop.image instanceof File) {
      formData.append("image", newCrop.image);
    }

    try {
      const res = await axiosInstance.post(
        "http://127.0.0.1:8000/crops/cropss/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCrops([...crops, res.data]);
      setShowAddModal(false);
      setNewCrop({
        name: "",
        planting_date: "",
        expected_harvest_date: "",
        yield_estimate: "",
        status: "planted",
        image: null,
      });
      toast.success("Crop added successfully!");
    } catch (err) {
      console.error("=== ADD CROP ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to add crop. ";
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
        toast.error("Failed to add crop. Check your connection.");
      }
    }
  };

  //  Edit Crop
  const handleEditCrop = async (e) => {
    e.preventDefault();

    if (!editCrop || !editCrop.id) {
      toast.error("Invalid crop data. Please try again.");
      return;
    }

    const formData = new FormData();

    // IMPORTANT: Include the farmer ID that's already stored in editCrop
    formData.append("farmer", editCrop.farmer);

    // Append all fields
    formData.append("name", editCrop.name);
    formData.append("planting_date", editCrop.planting_date);
    formData.append("expected_harvest_date", editCrop.expected_harvest_date);
    formData.append("yield_estimate", editCrop.yield_estimate);
    formData.append("status", editCrop.status);

    // Only append new image if one was selected
    if (editCrop.image && editCrop.image instanceof File) {
      formData.append("image", editCrop.image);
    }

    console.log("=== EDITING CROP ===");
    console.log("Crop ID:", editCrop.id);
    console.log("Farmer ID:", editCrop.farmer);
    console.log("Name:", editCrop.name);

    try {
      const res = await axiosInstance.put(
        `http://127.0.0.1:8000/crops/cropss/${editCrop.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCrops(crops.map((c) => (c.id === editCrop.id ? res.data : c)));
      setShowEditModal(false);
      setEditCrop(null);
      toast.success("Crop updated successfully!");
    } catch (err) {
      console.error("=== EDIT CROP ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to update crop. ";
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
        toast.error("Failed to update crop. Check your connection.");
      }
    }
  };

  //  Delete Crop
  const handleDeleteCrop = async (id) => {
    if (!id) {
      console.error("No crop ID provided to handleDeleteCrop");
      toast.error("Invalid crop ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this crop?")) return;

    console.log("=== DELETING CROP ===");
    console.log("Crop ID:", id);
    console.log("Token exists:", !!token);

    try {
      await axiosInstance.delete(`http://127.0.0.1:8000/crops/cropss/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(crops.filter((c) => c.id !== id));
      setSelectedCrop(null);
      toast.success("Crop deleted successfully!");
    } catch (err) {
      console.error("=== DELETE CROP ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to delete crop. ";
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
        toast.error("Failed to delete crop. Check your connection.");
      }
    }
  };

  //  Loading state
  if (loading) {
    return (
      <div className="text-center mt-5 text-muted">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3">Loading crops...</p>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(240,249,244,1) 0%, rgba(219,245,227,1) 100%)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-success">
          <Leaf className="me-2" size={30} /> My Crops
        </h2>
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="me-2" /> Add Crop
        </button>
      </div>

      {/*  Crop Grid */}
      <div className="row g-4">
        {crops.length === 0 ? (
          <div className="col-12 text-center text-muted">
            <p>No crops found. Click "Add Crop" to get started!</p>
          </div>
        ) : (
          crops.map((crop, index) => {
            const imageSrc =
              crop.image ||
              cropImages[crop.name?.toLowerCase()] ||
              cropImages.default;

            return (
              <div
                key={crop.id || `crop-${index}`}
                className="col-md-3 col-sm-6"
                onClick={() => {
                  console.log("Clicking crop:", crop);
                  setSelectedCrop(crop);
                }}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card shadow-sm border-0 overflow-hidden position-relative"
                  style={{
                    borderRadius: "20px",
                    height: "230px",
                    transition: "0.3s",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={crop.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 text-center text-white fw-bold py-2"
                    style={{
                      background: "rgba(40, 167, 69, 0.85)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {crop.name}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Crop Details Modal */}
      {selectedCrop && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedCrop(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <Sprout className="me-2" /> {selectedCrop.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedCrop(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <img
                  src={
                    selectedCrop.image ||
                    cropImages[selectedCrop.name?.toLowerCase()] ||
                    cropImages.default
                  }
                  alt={selectedCrop.name}
                  className="img-fluid rounded mb-3"
                  style={{ height: "250px", objectFit: "cover", width: "100%" }}
                />
                <ul className="list-unstyled">
                  <li>
                    <strong>Planting Date:</strong> {selectedCrop.planting_date}
                  </li>
                  <li>
                    <strong>Expected Harvest:</strong>{" "}
                    {selectedCrop.expected_harvest_date}
                  </li>
                  <li>
                    <strong>Yield Estimate:</strong>{" "}
                    {selectedCrop.yield_estimate} kg
                  </li>
                  <li>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-success">
                      {selectedCrop.status}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  className="btn btn-outline-danger d-flex align-items-center"
                  onClick={() => {
                    console.log("Delete button clicked, selectedCrop:", selectedCrop);
                    handleDeleteCrop(selectedCrop.id);
                  }}
                >
                  <Trash2 className="me-2" /> Delete
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  onClick={() => {
                    console.log("Selected crop for edit:", selectedCrop);
                    setEditCrop({
                      id: selectedCrop.id,
                      farmer: selectedCrop.farmer,
                      name: selectedCrop.name,
                      planting_date: selectedCrop.planting_date,
                      expected_harvest_date: selectedCrop.expected_harvest_date,
                      yield_estimate: selectedCrop.yield_estimate,
                      status: selectedCrop.status,
                      image: null,
                    });
                    setShowEditModal(true);
                    setSelectedCrop(null);
                  }}
                >
                  <Edit3 className="me-2" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Crop Modal */}
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
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Add New Crop</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddCrop}>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Crop Name"
                    value={newCrop.name}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="date"
                    className="form-control mb-3"
                    placeholder="Planting Date"
                    value={newCrop.planting_date}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, planting_date: e.target.value })
                    }
                    required
                  />
                  <input
                    type="date"
                    className="form-control mb-3"
                    placeholder="Expected Harvest Date"
                    value={newCrop.expected_harvest_date}
                    onChange={(e) =>
                      setNewCrop({
                        ...newCrop,
                        expected_harvest_date: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="form-control mb-3"
                    placeholder="Yield Estimate (kg)"
                    value={newCrop.yield_estimate}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, yield_estimate: e.target.value })
                    }
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, image: e.target.files[0] })
                    }
                  />
                  <select
                    className="form-select"
                    value={newCrop.status}
                    onChange={(e) =>
                      setNewCrop({ ...newCrop, status: e.target.value })
                    }
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" type="submit">
                    Add Crop
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

      {/*  Edit Crop Modal */}
      {showEditModal && editCrop && (
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
                <h5 className="modal-title">Edit Crop</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditCrop}>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Crop Name"
                    value={editCrop.name}
                    onChange={(e) =>
                      setEditCrop({ ...editCrop, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={editCrop.planting_date}
                    onChange={(e) =>
                      setEditCrop({
                        ...editCrop,
                        planting_date: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="date"
                    className="form-control mb-3"
                    value={editCrop.expected_harvest_date}
                    onChange={(e) =>
                      setEditCrop({
                        ...editCrop,
                        expected_harvest_date: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="form-control mb-3"
                    placeholder="Yield Estimate (kg)"
                    value={editCrop.yield_estimate}
                    onChange={(e) =>
                      setEditCrop({
                        ...editCrop,
                        yield_estimate: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) =>
                      setEditCrop({
                        ...editCrop,
                        image: e.target.files[0],
                      })
                    }
                  />
                  <select
                    className="form-select"
                    value={editCrop.status}
                    onChange={(e) =>
                      setEditCrop({ ...editCrop, status: e.target.value })
                    }
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditCrop(null);
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