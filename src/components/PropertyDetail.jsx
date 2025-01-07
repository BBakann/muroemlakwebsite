import { useState, useEffect } from 'react';

function PropertyDetail({ property, onClose }) {
  useEffect(() => {
    // Modal açıldığında body scroll'u engelle
    document.body.style.overflow = 'hidden';
    return () => {
      // Modal kapandığında body scroll'u geri aç
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.className === 'property-detail-overlay') {
      onClose();
    }
  };

  return (
    <div className="property-detail-overlay" onClick={handleOverlayClick}>
      <div className="property-detail-modal">
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="property-detail-content">
          <div className="property-detail-image">
            <img src={property.image} alt={property.title} />
            <div className="property-type-badge">
              {property.category === 'satilik' ? 'Satılık' : 'Kiralık'}
            </div>
          </div>

          <div className="property-detail-info">
            <h2 className="property-detail-title">{property.title}</h2>
            
            <div className="property-detail-price">
              {property.price}
            </div>

            <div className="property-detail-specs">
              <div className="spec-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{property.location}</span>
              </div>
              <div className="spec-item">
                <i className="fas fa-vector-square"></i>
                <span>{property.area}</span>
              </div>
              <div className="spec-item">
                <i className="fas fa-door-open"></i>
                <span>{property.rooms}</span>
              </div>
              {property.type && (
                <div className="spec-item">
                  <i className="fas fa-home"></i>
                  <span>{property.type === 'konut' ? 'Konut' : 'İş Yeri'}</span>
                </div>
              )}
            </div>

            <div className="property-description">
              <h3>İlan Detayı</h3>
              <p>{property.description || 'Bu ilan için detaylı açıklama bulunmamaktadır.'}</p>
            </div>

            <div className="contact-section">
              <h3>İletişim</h3>
              <button className="contact-button phone">
                <i className="fas fa-phone"></i>
                <span>Telefon ile Ara</span>
              </button>
              <button className="contact-button whatsapp">
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp ile İletişim</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;
