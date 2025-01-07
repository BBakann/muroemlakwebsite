import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddProperty() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    size: '',
    rooms: '',
    bathrooms: '',
    status: 'sale', // 'sale' veya 'rent'
    features: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Admin kontrolü
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  // Özellikler listesi
  const availableFeatures = [
    'Otopark', 'Asansör', 'Güvenlik',
    'Merkezi Isıtma', 'Eşyalı', 'Havuz',
    'Spor Salonu', 'Bahçe', 'Teras'
  ];

  // Oda seçenekleri
  const roomOptions = ['1+1', '2+1', '3+1', '4+1', '5+1'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Dosya boyutu ve tip kontrolü
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Lütfen sadece JPG, PNG veya WebP formatında görsel yükleyin.');
        return false;
      }

      if (file.size > maxSize) {
        alert('Görsel boyutu 5MB\'dan küçük olmalıdır.');
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Geçerli dosyaları ekle
    setImageFiles(validFiles);

    // Önizleme URL'lerini oluştur
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(newPreviews);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => {
      // URL.revokeObjectURL kullanarak bellek sızıntısını önle
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Component unmount olduğunda önizleme URL'lerini temizle
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      // Görselleri yükle
      const imageUrls = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append('image', file);

          console.log('Görsel yükleniyor:', file.name);
          const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Görsel yüklendi:', uploadResponse.data.imageUrl);

          imageUrls.push(uploadResponse.data.imageUrl);
        }
      }

      console.log('Tüm görseller:', imageUrls);

      // İlan oluşturma
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        size: Number(formData.size),
        bathrooms: Number(formData.bathrooms),
        images: imageUrls
      };

      console.log('İlan verileri:', propertyData);

      const response = await axios.post('http://localhost:5000/api/properties', propertyData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      alert('İlan başarıyla eklendi!');
      navigate('/ilanlar');
    } catch (error) {
      console.error('Hata:', error);
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('Sunucuya bağlanılamadı');
      } else {
        setError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-property">
      <h1>Yeni İlan Ekle</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Temel Bilgiler</h2>
          
          <div className="form-group">
            <label htmlFor="title">İlan Başlığı</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">İlan Açıklaması</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Fiyat (₺)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Konum</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="size">Metrekare</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rooms">Oda Tipi</label>
            <select
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              {roomOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bathrooms">Banyo Sayısı</label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">İlan Tipi</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="sale">Satılık</option>
              <option value="rent">Kiralık</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Özellikler</h2>
          <div className="features-grid">
            {availableFeatures.map(feature => (
              <label key={feature} className="feature-checkbox">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
                <span>{feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Fotoğraflar</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Görseller
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {imagePreview.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreview.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Önizleme ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button" 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Ekleniyor...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                <span>İlan Ekle</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProperty;