const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lütfen ilan başlığını girin']
  },
  description: {
    type: String,
    required: [true, 'Lütfen ilan açıklamasını girin']
  },
  type: {
    type: String,
    required: [true, 'Lütfen ilan tipini seçin'],
    enum: ['konut', 'isyeri', 'arsa']
  },
  status: {
    type: String,
    required: [true, 'Lütfen ilan durumunu seçin'],
    enum: ['satilik', 'kiralik']
  },
  price: {
    type: Number,
    required: [true, 'Lütfen fiyat bilgisini girin']
  },
  location: {
    type: String,
    required: [true, 'Lütfen konum bilgisini girin']
  },
  rooms: String,
  size: Number,
  floor: String,
  heating: String,
  buildingAge: Number,
  furnished: Boolean,
  images: [String],
  features: [String],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema); 