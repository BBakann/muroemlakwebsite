import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form gönderme işlemi burada yapılacak
    console.log('Form data:', formData);
    // Formu temizle
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    alert('Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.');
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1 className="contact-title">İletişim</h1>
        
        <div className="contact-content">
          <div className="contact-info">
            <h2>Bize Ulaşın</h2>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Adres</h3>
                <p>Çankaya, Ankara</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Telefon</h3>
                <p>0312 123 45 67</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>E-posta</h3>
                <p>info@okurlaremlak.com</p>
              </div>
            </div>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="contact-form">
            <h2>Mesaj Gönderin</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Adınız</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Adınız Soyadınız"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ornek@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mesajınız</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Mesajınızı buraya yazın..."
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="submit-button">
                <i className="fas fa-paper-plane"></i>
                <span>Gönder</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;