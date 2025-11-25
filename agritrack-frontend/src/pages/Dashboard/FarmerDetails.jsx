import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig.js";
import { MapPin, Tractor, Ruler, Sprout } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FarmerDetails.css";

export default function FarmerDetails() {
  const [farmer, setFarmer] = useState(null);
  const [editingFarmer, setEditingFarmer] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const farmerId = localStorage.getItem("farmer_id") || 1;

  //  Fetch Farmer Data
  useEffect(() => {
  if (!token) {
    toast.warning("No valid token found. Please log in again.");
    return;
  }

  let isMounted = true;

  axiosInstance
    .get(`http://127.0.0.1:8000/Farmer/farmers/${farmerId}/`, {

    })
    .then((res) => {
      if (isMounted) {
        setFarmer(res.data);
        setEditingFarmer(res.data);
      }
    })
    .catch((err) => {
      console.error("Error loading farmer details:", err);
      toast.error("Failed to load farmer details.");
    });

  return () => {
    isMounted = false;
  };
}, [token, farmerId]);




  //  Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingFarmer((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;

         fetch(`${API_URL}/Farmer/farmers/${farmerId}/`)

        editingFarmer,

      );
      setFarmer(res.data);
      toast.success("Farmer details updated successfully!");
    } catch (err) {
      console.error("Error updating farmer:", err);
      toast.error("Failed to update farmer details.");
    } finally {
      setLoading(false);
    }
  };

  //  Loading State
  if (!farmer) {
    return (
      <div className="text-center mt-5 text-muted">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3">Loading farmer details...</p>
        <ToastContainer theme="colored" position="top-center" />
      </div>
    );
  }

  //  Modernized UI
  return (
    <div
      className="farmer-bg d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://www.publicdomainpictures.net/pictures/400000/velka/farmer-in-orchard-16188384012oi.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg border-0 p-5 bg-light bg-opacity-75"
        style={{
          width: "90%",
          maxWidth: "850px",
          borderRadius: "20px",
          backdropFilter: "blur(3px)",
        }}
      >
        <h2 className="fw-bold text-center text-success mb-4">
          <Tractor className="me-2" size={30} /> Farmer Profile
        </h2>

        <form onSubmit={handleUpdate}>
          <div className="row g-4">
            {/* Farm Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-success">
                <Tractor className="me-2" size={18} /> Farm Name
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                name="farm_name"
                value={editingFarmer.farm_name || ""}
                onChange={handleChange}
              />
            </div>

            {/* Location */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-success">
                <MapPin className="me-2" size={18} /> Location
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                name="location"
                value={editingFarmer.location || ""}
                onChange={handleChange}
              />
            </div>

            {/* Farm Size */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-success">
                <Ruler className="me-2" size={18} /> Farm Size (acres)
              </label>
              <input
                type="number"
                className="form-control form-control-lg rounded-3"
                name="farm_size"
                value={editingFarmer.farm_size || ""}
                onChange={handleChange}
              />
            </div>

            {/* Soil Type */}
            <div className="col-md-6">
              <label className="form-label fw-semibold text-success">
                <Sprout className="me-2" size={18} /> Soil Type
              </label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                name="soil_type"
                value={editingFarmer.soil_type || ""}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg rounded-3"
                name="email"
                value={editingFarmer.email || ""}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                className="form-control form-control-lg rounded-3"
                name="address"
                value={editingFarmer.address || ""}
                onChange={handleChange}
              />
            </div>

            {/* Experience */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Experience (years)
              </label>
              <input
                type="number"
                className="form-control form-control-lg rounded-3"
                name="experience_years"
                value={editingFarmer.experience_years || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="text-center mt-5">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-success px-5 py-3 fw-semibold rounded-pill shadow-sm"
              style={{ transition: "all 0.3s ease" }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              {loading ? "Updating..." : "Update Details"}
            </button>
          </div>
        </form>
      </div>

      {/*  Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
