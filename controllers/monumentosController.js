const Monumento = require('../models/Monumento');

exports.getAllMonumentos = async (req, res) => {
    try {
        const monumentos = await Monumento.find();
        res.json(monumentos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMonumento = async (req, res) => {
    const { name, description, location, photo } = req.body;
    const newMonumento = new Monumento({ name, description, location, photo });

    try {
        const savedMonumento = await newMonumento.save();
        res.status(201).json(savedMonumento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateMonumento = async (req, res) => {
    try {
        const updatedMonumento = await Monumento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMonumento);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMonumento = async (req, res) => {
    try {
        await Monumento.findByIdAndDelete(req.params.id);
        res.json({ message: 'Monumento deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
