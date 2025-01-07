const Property = require('../models/Property');

// @desc    Tüm ilanları getir
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const { status, type, minPrice, maxPrice, location } = req.query;
    
    // Filtre oluşturma
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const properties = await Property.find(filter).populate('user', 'name');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Tekil ilan getir
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('user', 'name');
    if (!property) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    İlan oluştur
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    İlan güncelle
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // İlan sahibi kontrolü
    if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    İlan sil
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // İlan sahibi kontrolü
    if (property.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    await property.remove();
    res.json({ message: 'İlan silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 