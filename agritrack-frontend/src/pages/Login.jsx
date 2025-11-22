import { useState } from 'react';
import axiosInstance from "../api/axiosConfig.js";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('api/token/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.password2) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('api/register/', {
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });

      alert('Registration successful! Please log in.');
      setIsRegistering(false);
      setRegisterData({ username: '', email: '', password: '', password2: '' });
      setCredentials({ username: registerData.username, password: '' });
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        let errorMsg = '';
        if (errors.username) errorMsg += `Username: ${errors.username[0]}\n`;
        if (errors.email) errorMsg += `Email: ${errors.email[0]}\n`;
        if (errors.password) errorMsg += `Password: ${errors.password[0]}\n`;
        setError(errorMsg || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      {!isRegistering ? (
        <>
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleLogin} className="mx-auto" style={{maxWidth: '400px'}}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Username"
              value={credentials.username}
              onChange={e => setCredentials({...credentials, username: e.target.value})}
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={credentials.password}
              onChange={e => setCredentials({...credentials, password: e.target.value})}
            />
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                setIsRegistering(true);
                setError('');
              }}
            >
              Sign up here
            </button>
          </p>
        </>
      ) : (
        <>
          <h2 className="text-center">Register</h2>
          <form onSubmit={handleRegister} className="mx-auto" style={{maxWidth: '400px'}}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Username"
              value={registerData.username}
              onChange={e => setRegisterData({...registerData, username: e.target.value})}
              required
            />
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={registerData.email}
              onChange={e => setRegisterData({...registerData, email: e.target.value})}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={registerData.password}
              onChange={e => setRegisterData({...registerData, password: e.target.value})}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Confirm Password"
              value={registerData.password2}
              onChange={e => setRegisterData({...registerData, password2: e.target.value})}
              required
            />
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account?{' '}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                setIsRegistering(false);
                setError('');
              }}
            >
              Log in here
            </button>
          </p>
        </>
      )}
    </div>
  );
}