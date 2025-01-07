import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import sbrGroupLogo from '../assets/images/sbrgroup.png'; // Görsel yolunu buraya ekleyin

function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(!!token && adminStatus === 'true');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/');
    window.location.reload();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={sbrGroupLogo} alt="SBR Group Logo" className="navbar-logo-image" />
          <span className="navbar-logo-text">SBR EMLAK</span>
        </Link>

        {/* Mobil menü butonu */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* Ana menü */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="navbar-links">
            <Link to="/" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-home"></i>
              <span>Ana Sayfa</span>
            </Link>
            
            <Link to="/ilanlar?type=sale" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-building"></i>
              <span>Satılık</span>
            </Link>
            
            <Link to="/ilanlar?type=rent" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-key"></i>
              <span>Kiralık</span>
            </Link>
            
            <Link to="/hakkimizda" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-info-circle"></i>
              <span>Hakkımızda</span>
            </Link>
            
            <Link to="/iletisim" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="fas fa-phone"></i>
              <span>İletişim</span>
            </Link>
          </div>

          <div className="navbar-auth">
            {isAdmin ? (
              <>
                <Link to="/ilan-ekle" className="navbar-button add-property" onClick={() => setIsMobileMenuOpen(false)}>
                  <i className="fas fa-plus"></i>
                  <span>İlan Ekle</span>
                </Link>
                <button onClick={handleLogout} className="navbar-button logout">
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Çıkış Yap</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar-button login" onClick={() => setIsMobileMenuOpen(false)}>
                <i className="fas fa-user"></i>
                <span>Yönetici Girişi</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;