import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PropertyCard({ property, onSelect }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${property._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('İlan başarıyla silindi.');
        // İlan listesini güncelleme veya yönlendirme
      } catch (error) {
        console.error('İlan silinirken hata:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="property-card" onClick={() => onSelect(property)}>
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        <div className="property-type-badge">
          {property.category === 'satilik' ? 'Satılık' : 'Kiralık'}
        </div>
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={toggleFavorite}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-details">
          <div className="property-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>{property.location}</span>
          </div>
          <div className="property-detail">
            <i className="fas fa-vector-square"></i>
            <span>{property.area}</span>
          </div>
          <div className="property-detail">
            <i className="fas fa-door-open"></i>
            <span>{property.rooms}</span>
          </div>
        </div>
        <div className="property-price">{property.price}</div>
        <div className="property-actions">
          <button 
            className="action-button primary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(property);
            }}
          >
            <i className="fas fa-search"></i>
            <span>Detayları Gör</span>
          </button>
          <button 
            className="action-button secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ilan-guncelle/${property._id}`);
            }}
          >
            <i className="fas fa-edit"></i>
            <span>Güncelle</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;