const mongoose = require('mongoose');

const MonumentoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    photo: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Monumento', MonumentoSchema);
