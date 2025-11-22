import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axiosConfig.js";
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Edit3,
  Trash2,
} from "lucide-react";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  //  Include all backend-required fields
  const [formData, setFormData] = useState({
    id: null,
    transaction_type: "income",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const API_URL = "http://127.0.0.1:8000/finance/finances/";

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Fetch all transactions
  const fetchFinanceData = async () => {
    try {
      const res = await axiosInstance.get(API_URL);
      setTransactions(res.data);

      const incomeTotal = res.data
        .filter((t) => t.transaction_type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const expenseTotal = res.data
        .filter((t) => t.transaction_type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setTotals({ income: incomeTotal, expense: expenseTotal });
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  // Open Add/Edit Modal
  const handleShowModal = (transaction = null) => {
    if (transaction) {
      setFormData({
        id: transaction.id,
        farmer: transaction.farmer,
        transaction_type: transaction.transaction_type,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
      });
      setEditing(true);
    } else {
      setFormData({
        id: null,
        farmer: "",
        transaction_type: "income",
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditing(false);
    }
    setShowModal(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Save or Update Transaction
  const handleSave = async () => {
    try {
      if (editing) {
        await axiosInstance.put(`${API_URL}${formData.id}/`, formData);
      } else {
        await axiosInstance.post(API_URL, formData);
      }
      fetchFinanceData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving transaction:", error.response?.data || error);
      alert("Failed to save transaction. Check console for details.");
    }
  };

  //  Delete Transaction
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await axiosInstance.delete(`${API_URL}${id}/`);
        fetchFinanceData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const COLORS = ["#00C49F", "#FF8042"];
  const chartData = [
    { name: "Income", value: totals.income },
    { name: "Expense", value: totals.expense },
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Finance Dashboard</h2>

      {/* ===== Summary Cards ===== */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Card className="shadow-sm text-center p-3 border-success">
            <Card.Body>
              <TrendingUp color="green" size={30} />
              <h5>Total Income</h5>
              <h4 className="text-success">Ksh {totals.income.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm text-center p-3 border-danger">
            <Card.Body>
              <TrendingDown color="red" size={30} />
              <h5>Total Expense</h5>
              <h4 className="text-danger">Ksh {totals.expense.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="shadow-sm text-center p-3 border-primary">
            <Card.Body>
              <h5>Net Balance</h5>
              <h4
                className={
                  totals.income - totals.expense >= 0
                    ? "text-success"
                    : "text-danger"
                }
              >
                Ksh {(totals.income - totals.expense).toFixed(2)}
              </h4>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div className="row mb-5">
        <div className="col-md-6 text-center">
          <h5>Income vs Expense</h5>
          <PieChart width={350} height={300}>
            <Pie
              data={chartData}
              cx={180}
              cy={150}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="col-md-6 text-center">
          <h5>Transactions Overview</h5>
          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* ===== Transaction Table ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>All Transactions</h4>
        <Button variant="success" onClick={() => handleShowModal()}>
          <PlusCircle size={18} /> Add Transaction
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount (Ksh)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, index) => (
            <tr key={t.id || index}>
              <td>{index + 1}</td>
              <td
                className={
                  t.transaction_type === "income"
                    ? "text-success"
                    : "text-danger"
                }
              >
                {t.transaction_type}
              </td>
              <td>{t.description}</td>
              <td>{parseFloat(t.amount).toFixed(2)}</td>
              <td>{t.date}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(t)}
                >
                  <Edit3 size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/*  Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? "Edit Transaction" : "Add Transaction"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount (Ksh)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Finance;
