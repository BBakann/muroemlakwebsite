import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaMoneyBillWave, FaTrash } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PropertyDetail = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        console.log('İlan detayı:', response.data);
        setProperty(response.data);
      } catch (error) {
        console.error('İlan detayı yüklenirken hata:', error);
        setError('İlan detayı yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Bu ilanı silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token bulunamadı');
        }

        console.log('İlan siliniyor:', id);
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('İlan silindi');
        alert('İlan başarıyla silindi!');
        navigate('/ilanlar');
      } catch (error) {
        console.error('İlan silinirken hata:', error);
        alert('İlan silinirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="container mx-auto p-4">Yükleniyor...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!property) return <div className="container mx-auto p-4">İlan bulunamadı</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Görsel Galerisi */}
        <div className="max-w-3xl mx-auto mb-6">
          {property.images && property.images.length > 0 ? (
            <Carousel
              showArrows={true}
              showThumbs={true}
              infiniteLoop={true}
              showStatus={false}
              className="property-carousel"
            >
              {property.images.map((image, index) => (
                <div key={index} className="h-[400px]">
                  <img
                    src={image}
                    alt={`${property.title} - Görsel ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="h-[400px] bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Görsel bulunamadı</span>
            </div>
          )}
        </div>

        {/* İlan Detayları */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-2xl font-bold text-green-700">
                <FaMoneyBillWave className="mr-2" />
                {property.price.toLocaleString('tr-TR')} ₺
                {property.status === 'sale' ? (
                  <span className="ml-3 text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Satılık
                  </span>
                ) : (
                  <span className="ml-3 text-sm font-medium px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Kiralık
                  </span>
                )}
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <FaTrash />
                <span>İlanı Sil</span>
              </button>
            )}
          </div>

          {/* Özellikler */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg shadow-sm mb-6">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <FaBed className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Oda Sayısı</p>
                <p className="font-semibold">{property.rooms}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <FaBath className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Banyo</p>
                <p className="font-semibold">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <FaRuler className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Alan</p>
                <p className="font-semibold">{property.size} m²</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <FaMapMarkerAlt className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Konum</p>
                <p className="font-semibold truncate">{property.location}</p>
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Açıklama</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Özellikler Listesi */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Özellikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
