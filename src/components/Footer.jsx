import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section">
          <h3 className="footer-logo">SBR EMLAK</h3>
          <p className="footer-description">
            Hayalinizdeki evi bulmanız için en iyi hizmeti sunuyoruz. Güvenilir ve profesyonel çözümlerle yanınızdayız.
          </p>
          <div className="footer-social-icons">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Hızlı Linkler</h4>
          <ul className="footer-links">
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/ilanlar">İlanlar</a></li>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/iletisim">İletişim</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="footer-title">İletişim</h4>
          <ul className="footer-contact">
            <li><FaPhoneAlt /> +90 (541) 866 88 49</li>
            <li><FaEnvelope /> muratokur@gmail.com</li>
            <li><FaMapMarkerAlt /> Sincan, Ankara</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SBR EMLAK. Tüm hakları saklıdır.</p>
        <div className="footer-bottom-links">
          <a href="#">Gizlilik</a>
          <a href="#">Kullanım Şartları</a>
          <a href="#">KVKK</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
