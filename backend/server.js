const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS ve JSON ayarları
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/emlakwebsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
});

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Uploads klasörü ayarları
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Statik dosya sunumu
app.use('/uploads', express.static(uploadsDir));

// Test endpoint'i
app.get('/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Model tanımlamaları
const Property = mongoose.model('Property', {
  title: String,
  description: String,
  price: Number,
  location: String,
  size: Number,
  rooms: String,
  bathrooms: Number,
  status: String,
  features: [String],
  images: [String]
});

const Admin = mongoose.model('Admin', {
  email: String,
  password: String
});

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token gerekli' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
};

// Görsel yükleme endpoint'i
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Görsel seçilmedi' });
    }
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    res.status(500).json({ message: 'Görsel yüklenirken hata oluştu' });
  }
});

// İlan oluşturma endpoint'i
app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('İlan oluşturma hatası:', error);
    res.status(500).json({ message: 'İlan oluşturulurken hata oluştu' });
  }
});

// Admin girişi endpoint'i
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email, isAdmin: true }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, isAdmin: true });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// İlanları listeleme endpoint'i
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error('İlan listeleme hatası:', error);
    res.status(500).json({ message: 'İlanlar listelenirken hata oluştu' });
  }
});

// Tekil ilan detayı endpoint'i
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    res.json(property);
  } catch (error) {
    console.error('İlan detayı hatası:', error);
    res.status(500).json({ message: 'İlan detayı getirilirken hata oluştu' });
  }
});

// İlan silme endpoint'i
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // İlanı sil
    await Property.findByIdAndDelete(req.params.id);

    // İlana ait görseli de sil
    if (property.images && property.images.length > 0) {
      property.images.forEach(imageUrl => {
        const filename = imageUrl.split('/').pop();
        const imagePath = path.join(uploadsDir, filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    res.json({ message: 'İlan başarıyla silindi' });
  } catch (error) {
    console.error('İlan silme hatası:', error);
    res.status(500).json({ message: 'İlan silinirken hata oluştu' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log('Uploads klasörü:', uploadsDir);
});