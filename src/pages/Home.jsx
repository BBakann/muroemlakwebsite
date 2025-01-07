import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import heroImage from '../assets/hero-image.png'; // Görsel yolunu buraya ekleyin

function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        // Son eklenen 6 ilanı al
        setFeaturedProperties(response.data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ₺';
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Hayalinizdeki Eve Bir Adım Uzaktasınız</h1>
          <p>Size özel seçilmiş gayrimenkul fırsatlarını keşfedin</p>
          <div className="search-box">
            <input
              type="text"
              placeholder="İlan ara... (örn: 3+1 daire, müstakil ev)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <i className="fas fa-search"></i>
              Ara
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-properties">
        <div className="section-header">
          <h2>Öne Çıkan İlanlar</h2>
          <p>En yeni ve öne çıkan gayrimenkul fırsatları</p>
        </div>
        
        <div className="properties-grid">
          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>İlanlar yükleniyor...</span>
            </div>
          ) : (
            featuredProperties.map((property) => (
              <div key={property._id} className="property-card">
                <div className="property-image">
                  <img src={property.images[0]} alt={property.title} />
                  <span className="property-badge">
                    {property.status === 'sale' ? 'Satılık' : 'Kiralık'}
                  </span>
                </div>
                <div className="property-details">
                  <h3>{property.title}</h3>
                  <p className="property-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {property.location}
                  </p>
                  <div className="property-features">
                    <span><i className="fas fa-ruler-combined"></i>{property.size} m²</span>
                    <span><i className="fas fa-bed"></i>{property.rooms}</span>
                    <span><i className="fas fa-bath"></i>{property.bathrooms}</span>
                  </div>
                  <div className="property-price">
                    <span>{formatPrice(property.price)}</span>
                    <Link to={`/property/${property._id}`} className="view-details">
                      İncele
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Link to="/ilanlar" className="view-all-button">
          Tüm İlanları Gör
          <i className="fas fa-arrow-right"></i>
        </Link>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="section-header">
          <h2>Hizmetlerimiz</h2>
          <p>Profesyonel gayrimenkul hizmetleri</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <i className="fas fa-home"></i>
            <h3>Emlak Alım Satım</h3>
            <p>Ev, arsa, daire alım ve satımında profesyonel danışmanlık</p>
          </div>
          <div className="service-card">
            <i className="fas fa-key"></i>
            <h3>Kiralama</h3>
            <p>Kiralık konut ve işyeri çözümleri</p>
          </div>
          <div className="service-card">
            <i className="fas fa-chart-line"></i>
            <h3>Yatırım Danışmanlığı</h3>
            <p>Gayrimenkul yatırımlarınız için uzman önerileri</p>
          </div>
          <div className="service-card">
            <i className="fas fa-file-contract"></i>
            <h3>Hukuki Danışmanlık</h3>
            <p>Gayrimenkul hukuku ve sözleşme süreçlerinde destek</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <i className="fas fa-home"></i>
          <h3>500+</h3>
          <p>Satılan Emlak</p>
        </div>
        <div className="stat-item">
          <i className="fas fa-users"></i>
          <h3>1000+</h3>
          <p>Mutlu Müşteri</p>
        </div>
        <div className="stat-item">
          <i className="fas fa-star"></i>
          <h3>15+</h3>
          <p>Yıllık Tecrübe</p>
        </div>
        <div className="stat-item">
          <i className="fas fa-award"></i>
          <h3>50+</h3>
          <p>Ödül & Başarı</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Gayrimenkulünüzü Değerinde Satın</h2>
          <p>Ücretsiz değerleme ve danışmanlık hizmetimizden faydalanın</p>
          <Link to="/contact" className="cta-button">
            Bize Ulaşın
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;