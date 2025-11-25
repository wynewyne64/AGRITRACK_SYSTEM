import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig.js";
import {
  PawPrint,
  PlusCircle,
  Edit3,
  Trash2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const animalImages = {
  cow: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg",
  goat: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Capra_aegagrus_hircus%2C_Neuss_%28DE%29_--_2022_--_0290.jpg/640px-Capra_aegagrus_hircus%2C_Neuss_%28DE%29_--_2022_--_0290.jpg",
  sheep: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Dagestan_sheep_3.jpg/640px-Dagestan_sheep_3.jpg",
  chicken: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Rooster_-_Gallus_gallus_domesticus.jpg/640px-Rooster_-_Gallus_gallus_domesticus.jpg",
  pig: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Pig_farm_Vampula_9.jpg/640px-Pig_farm_Vampula_9.jpg",
  default: "https://www.publicdomainpictures.net/pictures/470000/velka/farm-animals.png",
};

export default function Livestock() {
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [farmerId, setFarmerId] = useState(null);
  const [newAnimal, setNewAnimal] = useState({
    animal_type: "",
    breed: "",
    number_of_animals: "",
    health_status: "Healthy",
    production: "",
    total_production: "",
  });
  const [editAnimal, setEditAnimal] = useState(null);

  const token = localStorage.getItem("access_token");
  const API_URL = process.env.REACT_APP_API_URL;

  //  Fetch Livestock
  useEffect(() => {
    if (!token) {
      toast.warning("No valid token found. Please log in again.");
      setLoading(false);
      return;
    }

    axiosInstance
      .get("${API_URL}/livestock/livestocks/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Fetched livestock:", res.data);
        setLivestock(res.data);
        if (res.data.length > 0 && res.data[0].farmer) {
          setFarmerId(res.data[0].farmer);
          console.log("Farmer ID from livestock:", res.data[0].farmer);
        }
      })
      .catch((err) => {
        console.error("Error fetching livestock:", err);
        toast.error("Failed to load livestock. Please check your connection.");
      })
      .finally(() => setLoading(false));
  }, [token]);

  //  Add Animal
  const handleAddAnimal = async (e) => {
    e.preventDefault();

    if (!farmerId) {
      toast.error("Farmer ID not found. Please add at least one livestock first or contact support.");
      return;
    }

    const data = { ...newAnimal, farmer: farmerId };

    console.log("=== ADDING LIVESTOCK ===");
    console.log("Data being sent:", data);

    try {
      const res = await axiosInstance.post(
        "${API_URL}/livestock/livestocks/",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLivestock([...livestock, res.data]);
      setShowAddModal(false);
      setNewAnimal({
        animal_type: "",
        breed: "",
        number_of_animals: "",
        health_status: "Healthy",
        production: "",
        total_production: "",
      });
      toast.success("Livestock added successfully!");
    } catch (err) {
      console.error("=== ADD LIVESTOCK ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to add livestock. ";
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
        toast.error("Failed to add livestock. Check your connection.");
      }
    }
  };

  //  Edit Animal
  const handleEditAnimal = async (e) => {
    e.preventDefault();

    if (!editAnimal || !editAnimal.id) {
      toast.error("Invalid livestock data. Please try again.");
      return;
    }

    console.log("=== EDITING LIVESTOCK ===");
    console.log("Livestock ID:", editAnimal.id);
    console.log("Data:", editAnimal);

    try {
      const res = await axiosInstance.put(
        `${API_URL}/livestock/livestocks/${editAnimal.id}/`,
        editAnimal,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLivestock(
        livestock.map((a) => (a.id === editAnimal.id ? res.data : a))
      );
      setShowEditModal(false);
      setEditAnimal(null);
      toast.success("Livestock updated successfully!");
    } catch (err) {
      console.error("=== EDIT LIVESTOCK ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to update livestock. ";
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
        toast.error("Failed to update livestock. Check your connection.");
      }
    }
  };

  //  Delete Animal
  const handleDeleteAnimal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    console.log("=== DELETING LIVESTOCK ===");
    console.log("Livestock ID:", id);
    console.log("Token exists:", !!token);

    if (!id) {
      toast.error("Invalid livestock ID. Please try again.");
      return;
    }

    try {
      await axiosInstance.delete(
        `${API_URL}/livestock/livestocks/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLivestock(livestock.filter((a) => a.id !== id));
      setSelectedAnimal(null);
      toast.success("Livestock deleted successfully!");
    } catch (err) {
      console.error("=== DELETE LIVESTOCK ERROR ===");
      console.error("Full error:", err);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);

        let errorMessage = "Failed to delete livestock. ";
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
        toast.error("Failed to delete livestock. Check your connection.");
      }
    }
  };

  // 🌀 Loading
  if (loading) {
    return (
      <div className="text-center mt-5 text-muted">
        <div className="spinner-border text-secondary" role="status"></div>
        <p className="mt-3">Loading livestock...</p>
      </div>
    );
  }

  //  UI
  return (
    <div
      className="container py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #fdf6f0 0%, #f1e4d3 100%)",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-brown">
          <PawPrint className="me-2 text-brown" size={30} /> My Livestock
        </h2>
        <button
          className="btn btn-brown d-flex align-items-center"
          style={{ backgroundColor: "#795548", borderColor: "#795548", color: "white" }}
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle className="me-2" /> Add Livestock
        </button>
      </div>

      {/*  Animal Grid */}
      <div className="row g-3">
        {livestock.length === 0 ? (
          <div className="col-20 text-center text-muted">
            <p>No livestock found. Click "Add Livestock" to start!</p>
          </div>
        ) : (
          livestock.map((animal, index) => {
            const imageSrc =
              animalImages[animal.animal_type?.toLowerCase()] ||
              animalImages.default;

            return (
              <div
                key={animal.id || `animal-${index}`}
                className="col-md-3 col-sm-6"
                onClick={() => {
                  console.log("Selected animal:", animal);
                  setSelectedAnimal(animal);
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
                    alt={animal.animal_type}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 start-0 end-0 text-center text-white fw-bold py-2"
                    style={{
                      background: "rgba(121, 85, 72, 0.85)",
                      fontSize: "1.1rem",
                    }}
                  >
                    {animal.animal_type}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Animal Details Modal */}
      {selectedAnimal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedAnimal(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div
                className="modal-header text-white"
                style={{ background: "#795548" }}
              >
                <h5 className="modal-title">
                  {selectedAnimal.animal_type} Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedAnimal(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <ul className="list-unstyled">
                  <li>
                    <strong>Breed:</strong> {selectedAnimal.breed}
                  </li>
                  <li>
                    <strong>Number of Animals:</strong>{" "}
                    {selectedAnimal.number_of_animals}
                  </li>
                  <li>
                    <strong>Health Status:</strong>{" "}
                    {selectedAnimal.health_status}
                  </li>
                  <li>
                    <strong>Production:</strong> {selectedAnimal.production}
                  </li>
                  <li>
                    <strong>Total Production:</strong>{" "}
                    {selectedAnimal.total_production}
                  </li>
                </ul>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  className="btn btn-outline-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Delete button clicked for animal:", selectedAnimal);
                    handleDeleteAnimal(selectedAnimal.id);
                  }}
                >
                  <Trash2 className="me-2" /> Delete
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit button clicked for animal:", selectedAnimal);
                    setEditAnimal(selectedAnimal);
                    setShowEditModal(true);
                    setSelectedAnimal(null);
                  }}
                >
                  <Edit3 className="me-2" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  Add Modal */}
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
              <div className="modal-header text-white" style={{ background: "#795548" }}>
                <h5 className="modal-title">Add New Livestock</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddAnimal}>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Animal Type"
                    value={newAnimal.animal_type}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, animal_type: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Breed"
                    value={newAnimal.breed}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, breed: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Number of Animals"
                    value={newAnimal.number_of_animals}
                    onChange={(e) =>
                      setNewAnimal({
                        ...newAnimal,
                        number_of_animals: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    className="form-select mb-3"
                    value={newAnimal.health_status}
                    onChange={(e) =>
                      setNewAnimal({
                        ...newAnimal,
                        health_status: e.target.value,
                      })
                    }
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Sick">Sick</option>
                    <option value="Recovering">Recovering</option>
                  </select>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Production (e.g. 2 litres per goat)"
                    value={newAnimal.production}
                    onChange={(e) =>
                      setNewAnimal({
                        ...newAnimal,
                        production: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Total Production"
                    value={newAnimal.total_production}
                    onChange={(e) =>
                      setNewAnimal({
                        ...newAnimal,
                        total_production: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn text-white"
                    type="submit"
                    style={{ backgroundColor: "#795548" }}
                  >
                    Add Livestock
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

      {/*  Edit Modal */}
      {showEditModal && editAnimal && (
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
              <div className="modal-header text-white" style={{ background: "#6d4c41" }}>
                <h5 className="modal-title">Edit Livestock</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditAnimal}>
                <div className="modal-body p-4">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Animal Type"
                    value={editAnimal.animal_type}
                    onChange={(e) =>
                      setEditAnimal({ ...editAnimal, animal_type: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Breed"
                    value={editAnimal.breed}
                    onChange={(e) =>
                      setEditAnimal({ ...editAnimal, breed: e.target.value })
                    }
                    required
                  />
                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Number of Animals"
                    value={editAnimal.number_of_animals}
                    onChange={(e) =>
                      setEditAnimal({
                        ...editAnimal,
                        number_of_animals: e.target.value,
                      })
                    }
                    required
                  />
                  <select
                    className="form-select mb-3"
                    value={editAnimal.health_status}
                    onChange={(e) =>
                      setEditAnimal({
                        ...editAnimal,
                        health_status: e.target.value,
                      })
                    }
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Sick">Sick</option>
                    <option value="Recovering">Recovering</option>
                  </select>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Production"
                    value={editAnimal.production}
                    onChange={(e) =>
                      setEditAnimal({
                        ...editAnimal,
                        production: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Total Production"
                    value={editAnimal.total_production}
                    onChange={(e) =>
                      setEditAnimal({
                        ...editAnimal,
                        total_production: e.target.value,
                      })
                    }
                  />
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
                      setEditAnimal(null);
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

      {/* Toasts */}
      <ToastContainer position="top-center" theme="colored" />
    </div>
  );
}