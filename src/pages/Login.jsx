import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Admin girişi isteği
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Token'ı ve admin durumunu localStorage'a kaydet
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', 'true');
      
      // Ana sayfaya yönlendir
      navigate('/');
      window.location.reload(); // Navbar'ı güncellemek için sayfayı yenile
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (error.response?.status === 401) {
        setError('Email veya şifre hatalı');
      } else {
        setError('Giriş yapılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <h1>Yönetici Girişi</h1>
          
          <div className="admin-info">
            <p><strong>Not:</strong> Bu sayfa sadece site yöneticisi içindir.</p>
            <p>Email: info@okurlaremlak.com</p>
            <p>Şifre: Okurlar2024!</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email adresinizi girin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Şifrenizi girin"
              />
            </div>

            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;