import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Market from './pages/Market';
import FarmerDashboard from "./pages/Dashboard/FarmerDashboard";
import FarmerDetails from './pages/Dashboard/FarmerDetails';
import Crops from './pages/Dashboard/Crops';
import Livestock from './pages/Dashboard/Livestock';
import Finance from './pages/Dashboard/Finance';
import Inventory from './pages/Dashboard/Inventory';
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-orders" element={<MyOrders />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
         />

        <Route
              path="/dashboard/farmer"
              element={
                <ProtectedRoute>
                  <FarmerDetails />
                </ProtectedRoute>
              }
            />
        <Route
          path="/dashboard/crops"
          element={<ProtectedRoute><Crops /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/livestock"
          element={<ProtectedRoute><Livestock /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/finance"
          element={<ProtectedRoute><Finance /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/inventory"
          element={<ProtectedRoute><Inventory /></ProtectedRoute>}
        />
      </Routes>
       {/* ✅ Global Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </Router>
  );
}

export default App;
