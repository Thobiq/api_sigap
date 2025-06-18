const responderModel = require('../models/responder.model');
const bcrypt = require('bcryptjs');
const { RESPONDER_TYPES } = require('../models/responder.model'); 

const addResponderInstitution = async (req, res) => {
    const { email, password, name, type, latitude, longitude, address, phoneNumber } = req.body;

    if (!email || !password || !name || !type || latitude == null || longitude == null) {
        return res.status(400).json({ success: false, message: 'Data responden tidak lengkap.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Format email tidak valid.' });
    }
    if (!RESPONDER_TYPES.includes(type)) {
        return res.status(400).json({ success: false, message: `Tipe responder tidak valid. Pilihan: ${RESPONDER_TYPES.join(', ')}` });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
    }

    try {
        const existingResponder = await responderModel.findResponderByEmail(email);
        if (existingResponder) {
            return res.status(409).json({ success: false, message: 'Email sudah terdaftar untuk responden lain.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const newResponder = await responderModel.createResponder({
            email,
            passwordHash: hashedPassword,
            name,
            type,
            latitude,
            longitude,
            address,
            phoneNumber,
            role: 'responder'
        });

        res.status(201).json({ success: true, message: 'Institusi responden berhasil ditambahkan.', responder: newResponder });
    } catch (error) {
        console.error('❌ Error adding new responder institution:', error.message);
        res.status(500).json({ success: false, message: 'Gagal menambahkan institusi responden.', error: error.message });
    }
};

module.exports = {
    addResponderInstitution
};