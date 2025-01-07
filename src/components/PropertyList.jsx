import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        setError('İlanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Henüz ilan bulunmuyor</h2>
        <p className="text-gray-500 mt-2">İlk ilanı eklemek için "İlan Ekle" butonunu kullanın</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Link
            key={property._id}
            to={`/ilan/${property._id}`}
            className="card property-card hover:shadow-lg transition-all duration-300 bg-white rounded-lg overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Görsel yok</span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {property.status === 'sale' ? 'Satılık' : 'Kiralık'}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {property.title}
              </h3>
              
              <div className="flex items-center text-green-600 font-bold text-xl mb-3">
                {property.price.toLocaleString('tr-TR')} ₺
              </div>

              <div className="grid grid-cols-2 gap-3 text-gray-600 text-sm mb-3">
                <div className="flex items-center">
                  <FaBed className="mr-2" />
                  <span>{property.rooms} Oda</span>
                </div>
                <div className="flex items-center">
                  <FaBath className="mr-2" />
                  <span>{property.bathrooms} Banyo</span>
                </div>
                <div className="flex items-center">
                  <FaRuler className="mr-2" />
                  <span>{property.size} m²</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {property.description}
              </p>

              <div className="pt-3 border-t border-gray-200">
                <button className="w-full text-center text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Detayları Görüntüle
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
