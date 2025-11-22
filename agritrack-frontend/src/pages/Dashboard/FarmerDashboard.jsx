import { useNavigate } from "react-router-dom";
import { User, Sprout, Beef, Package, Wallet } from "lucide-react";
import "./FarmerDashboard.css";

export default function FarmerDashboard() {
  const navigate = useNavigate();

  const modules = [
    { icon: <User size={50} />, title: "Farmer Details", path: "/dashboard/farmer" },
    { icon: <Sprout size={50} />, title: "Crops", path: "/dashboard/crops" },
    { icon: <Beef size={50} />, title: "Livestock", path: "/dashboard/livestock" },
    { icon: <Package size={50} />, title: "Inventory", path: "/dashboard/inventory" },
    { icon: <Wallet size={50} />, title: "Finance", path: "/dashboard/finance" },
  ];

  return (
    <div className="dashboard-container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="overlay"></div>
      <div className="content text-center">
        <h2 className="fw-bold text-white mb-5">🌾 Farmer Dashboard</h2>

        <div className="row justify-content-center g-4 w-100 px-4">
          {modules.map((m, index) => (
            <div
              key={index}
              className="col-md-3 col-sm-6"
              onClick={() => navigate(m.path)}
              style={{ cursor: "pointer" }}
            >
              <div className="dashboard-card text-center p-4">
                <div className="icon-wrapper mb-3">{m.icon}</div>
                <h5 className="fw-semibold text-white">{m.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
