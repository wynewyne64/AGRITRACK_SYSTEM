import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
import {
  ShoppingCart,
  PlusCircle,
  Trash2,
  Edit3,
  Package,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Market() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price_per_unit: "",
    unit: "kg",
    available_quantity: "",
    farmer: 1,
    image: null,
  });

  const API_URL = "http://127.0.0.1:8000/market/markets/";
  const CART_URL = "http://127.0.0.1:8000/market/carts/";
  const loggedFarmerId = " ";

  const categoryImages = {
    crop: "https://cdn.pixabay.com/photo/2016/11/29/02/12/corn-1868340_1280.jpg",
    livestock: "https://cdn.pixabay.com/photo/2017/02/02/15/15/cow-2034603_1280.jpg",
    dairy: "https://cdn.pixabay.com/photo/2017/08/02/22/24/milk-2572436_1280.jpg",
    poultry: "https://cdn.pixabay.com/photo/2016/11/19/13/08/chicken-1836467_1280.jpg",
    other: "https://cdn.pixabay.com/photo/2017/01/06/19/15/market-1954780_1280.jpg",
  };

  useEffect(() => {
    fetchProducts();
    initializeCart();
  }, []);

  const initializeCart = async () => {
    let savedCartId = localStorage.getItem("cartId");
    if (savedCartId) {
      try {
        const res = await axios.get(`${CART_URL}${savedCartId}/`);
        setCart(res.data);
        setCartId(savedCartId);
      } catch {
        await createNewCart();
      }
    } else {
      await createNewCart();
    }
  };

  const createNewCart = async () => {
    try {
      const res = await axios.post(CART_URL);
      setCartId(res.data.id);
      setCart(res.data);
      localStorage.setItem("cartId", res.data.id);
    } catch (error) {
      console.error("Error creating cart:", error);
      toast.error("Failed to initialize cart");
    }
  };

  const fetchCart = async () => {
    if (!cartId) return;
    try {
      const res = await axios.get(`${CART_URL}${cartId}/`);
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filteredData = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (!category || p.category === category) &&
        parseFloat(p.price_per_unit) <= maxPrice
    );
    setFiltered(filteredData);
  }, [search, category, maxPrice, products]);

  const handleAddToCart = async (product) => {
    try {
      let id = localStorage.getItem("cartId");
      if (!id) {
        const res = await axios.post(CART_URL);
        id = res.data.id;
        localStorage.setItem("cartId", id);
        setCartId(id);
      }
      await axios.post(`${CART_URL}${id}/items/`, {
        market_id: product.id,
        quantity: 1,
      });
      toast.success("Item added to cart!");
      fetchCart();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleUpdateCartItem = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.patch(`${CART_URL}${cartId}/items/${itemId}/`, { quantity });
      await fetchCart();
      toast.info("Cart updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update cart item");
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await axios.delete(`${CART_URL}${cartId}/items/${itemId}/`);
      await fetchCart();
      toast.info("Item removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }
    setOrderLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/market/orders/", {
        cart_id: cartId,
      });
      toast.success("Order placed successfully!");
      localStorage.removeItem("cartId");
      await createNewCart();
      const offcanvas = bootstrap.Offcanvas.getInstance(
        document.getElementById("cartOffcanvas")
      );
      if (offcanvas) offcanvas.hide();
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleViewOrders = () => {
    window.location.href = "http://localhost:5173/my-orders";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newProduct).forEach(([k, v]) => v && formData.append(k, v));
    try {
      await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product added!");
      setNewProduct({
        name: "",
        category: "",
        price_per_unit: "",
        unit: "kg",
        available_quantity: "",
        farmer: 1,
        image: null,
      });
      fetchProducts();
      const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
      if (modal) modal.hide();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product, image: null });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newProduct).forEach(([k, v]) => v && formData.append(k, v));
    try {
      await axios.put(`${API_URL}${editingProduct.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated!");
      setEditingProduct(null);
      fetchProducts();
      const modal = bootstrap.Modal.getInstance(document.getElementById("addProductModal"));
      if (modal) modal.hide();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_URL}${id}/`);
      toast.info("Deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    new bootstrap.Modal(document.getElementById("productModal")).show();
  };

  const cartItemCount = cart?.items?.length || 0;
  const cartTotal = cart?.total_price || 0;

  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #fefce8 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="fw-bold text-success mb-2">🌾 Agri Market</h1>
            <p className="text-muted">
              Buy and sell agricultural products easily and securely.
            </p>
          </div>
          <button
            className="btn btn-success btn-lg"
            data-bs-toggle="modal"
            data-bs-target="#addProductModal"
            onClick={() => {
              setEditingProduct(null);
              setNewProduct({
                name: "",
                category: "",
                price_per_unit: "",
                unit: "kg",
                available_quantity: "",
                farmer: 1,
                image: null,
              });
            }}
          >
            <PlusCircle className="me-2" size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card shadow-sm p-3 mb-4 bg-light">
        <div className="row align-items-center">
          <div className="col-md-3 mb-2 mb-md-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3 mb-2 mb-md-0">
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="crop">Crop</option>
              <option value="livestock">Livestock</option>
              <option value="dairy">Dairy</option>
              <option value="poultry">Poultry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label text-muted mb-1">
              Max Price: Ksh {maxPrice}
            </label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2 text-center">
            <button
              className="btn btn-outline-success w-100"
              onClick={handleViewOrders}
            >
              <Package className="me-1" size={16} /> My Orders
            </button>
          </div>
          <div className="col-md-2 text-center">
            <button
              className="btn btn-success w-100 position-relative"
              data-bs-toggle="offcanvas"
              data-bs-target="#cartOffcanvas"
              onClick={fetchCart}
            >
              <ShoppingCart className="me-1" size={16} /> Cart
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="addProductModalLabel">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="crop">Crop</option>
                  <option value="livestock">Livestock</option>
                  <option value="dairy">Dairy</option>
                  <option value="poultry">Poultry</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Price per Unit (Ksh)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price_per_unit"
                  value={newProduct.price_per_unit}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Available Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  name="available_quantity"
                  value={newProduct.available_quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              >
                {editingProduct ? "Update Product" : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      {loading ? (
        <p className="text-center text-muted">Loading products...</p>
      ) : (
        <div className="row">
          {filtered.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div
                className="card shadow-sm border-0 h-100"
                onClick={() => handleProductClick(product)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    product.image
                      ? product.image
                      : categoryImages[product.category] || categoryImages.other
                  }
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-success">{product.name}</h5>
                  <p className="text-muted">
                    Ksh {product.price_per_unit} / {product.unit}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-success me-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                    {product.farmer === loggedFarmerId && (
                      <>
                        <button
                          className="btn btn-outline-warning me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product);
                            new bootstrap.Modal(document.getElementById("addProductModal")).show();
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            {selectedProduct && (
              <>
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title" id="productModalLabel">
                    {selectedProduct.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={
                          selectedProduct.image
                            ? selectedProduct.image
                            : categoryImages[selectedProduct.category] ||
                              categoryImages.other
                        }
                        alt={selectedProduct.name}
                        className="img-fluid rounded shadow-sm"
                      />
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-success fw-bold">
                        Ksh {selectedProduct.price_per_unit} /{" "}
                        {selectedProduct.unit}
                      </h4>
                      <p className="text-muted">
                        <strong>Category:</strong> {selectedProduct.category}
                      </p>
                      <p>
                        <strong>Available Quantity:</strong>{" "}
                        {selectedProduct.available_quantity}
                      </p>
                      <p>
                        <strong>Farmer ID:</strong> {selectedProduct.farmer}
                      </p>
                      <button
                        className="btn btn-success mt-3"
                        onClick={() => handleAddToCart(selectedProduct)}
                      >
                        <ShoppingCart size={16} className="me-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cart Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartOffcanvas"
        aria-labelledby="cartOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 id="cartOffcanvasLabel" className="fw-bold text-success">
            <ShoppingCart className="me-2" /> Your Cart
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          {cart?.items?.length ? (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
              >
                <div>
                  <h6 className="mb-1 text-success">{item.market.name}</h6>
                  <small>
                    {item.quantity} × Ksh {item.market.price_per_unit}
                  </small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() =>
                      handleUpdateCartItem(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary me-1"
                    onClick={() =>
                      handleUpdateCartItem(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-center">Your cart is empty.</p>
          )}
        </div>
        <div className="offcanvas-footer p-3 border-top">
          <div className="d-flex justify-content-between mb-3">
            <h6>Total:</h6>
            <h6 className="text-success">Ksh {cartTotal}</h6>
          </div>
          <button
            className="btn btn-success w-100"
            onClick={handleCheckout}
            disabled={orderLoading || !cart?.items?.length}
          >
            {orderLoading ? "Placing Order..." : "Checkout"}
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}