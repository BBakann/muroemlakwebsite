import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('konut');
  const [status, setStatus] = useState('satilik');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [rooms, setRooms] = useState('');
  const [size, setSize] = useState('');
  const [floor, setFloor] = useState('');
  const [heating, setHeating] = useState('');
  const [buildingAge, setBuildingAge] = useState('');
  const [furnished, setFurnished] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        console.error('İlan ID bulunamadı');
        return;
      }

      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperty(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setType(response.data.type);
        setStatus(response.data.status);
        setPrice(response.data.price);
        setLocation(response.data.location);
        setRooms(response.data.rooms);
        setSize(response.data.size);
        setFloor(response.data.floor);
        setHeating(response.data.heating);
        setBuildingAge(response.data.buildingAge);
        setFurnished(response.data.furnished);
        setImages(response.data.images);
      } catch (error) {
        console.error('İlan yüklenirken hata:', error.response ? error.response.data : error.message);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:5000/api/properties/${id}`,
        {
          title,
          description,
          type,
          status,
          price,
          location,
          rooms,
          size,
          floor,
          heating,
          buildingAge,
          furnished,
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('İlan başarıyla güncellendi:', response.data);
      navigate(`/properties/${id}`); // Güncellenen ilan sayfasına yönlendir
    } catch (error) {
      console.error('İlan güncellenirken hata:', error.response.data);
    }
  };

  if (!property) return <div>Yükleniyor...</div>;

  return (
    <div>
      <h1>İlanı Güncelle</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Başlık" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="konut">Konut</option>
          <option value="isyeri">İşyeri</option>
          <option value="arsa">Arsa</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="satilik">Satılık</option>
          <option value="kiralik">Kiralık</option>
        </select>
        <input type="number" placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Konum" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="text" placeholder="Oda Sayısı" value={rooms} onChange={(e) => setRooms(e.target.value)} />
        <input type="number" placeholder="Büyüklük (m²)" value={size} onChange={(e) => setSize(e.target.value)} />
        <input type="text" placeholder="Kat" value={floor} onChange={(e) => setFloor(e.target.value)} />
        <input type="text" placeholder="Isıtma" value={heating} onChange={(e) => setHeating(e.target.value)} />
        <input type="number" placeholder="Bina Yaşı" value={buildingAge} onChange={(e) => setBuildingAge(e.target.value)} />
        <label>
          Eşyalı mı?
          <input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} />
        </label>
        <input type="text" placeholder="Görsel URL'leri (virgülle ayırarak)" value={images.join(',')} onChange={(e) => setImages(e.target.value.split(','))} />
        <button type="submit">İlanı Güncelle</button>
      </form>
    </div>
  );
}

export default EditProperty; 