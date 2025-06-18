const responderModel = require('../models/responder.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET =process.env.JWT_SECRET

const handleResponderAuth = async (req, res) => {
    const {email, password, fcmToken} = req.body
    
    if(!email || !password){
        return res.status(400).json({success: false, message: 'Email dan password wajib diis'})
    }

    try {
        const responder = await responderModel.findResponderByEmail(email);

        if(!responder){
            return res.status(401).json({success: false, message: 'Kredensial tidak valid'})
        }

        const isMatch = await bcrypt.compare(password, responder.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Kredensial tidak valid.' });
        }

        if (!responder.is_active) {
            return res.status(403).json({ success: false, message: 'Akun responden tidak aktif.' });
        }

        const appJwt = jwt.sign(
            {
                id: responder.id,
                email: responder.email,
                role: responder.role, 
                type: responder.type,
                name: responder.name
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        if (fcmToken) {
            await responderModel.updateResponderFcmToken(responder.id, fcmToken);
            responder.fcm_token = fcmToken
        }

        res.status(200).json({
            success: true,
            message: 'Login responden berhasil.',
            token: appJwt,
            responder: {
                id: responder.id,
                email: responder.email,
                name: responder.name,
                type: responder.type,
                address: responder.address,
                phoneNumber: responder.phone_number,
                fcmToken: responder.fcm_token,
                role: responder.role
            }
        })

    } catch (err){
        console.error('error during responder authentication : ', err.message)
        res.status(500).json({success: false, message: 'internal serber error'})
    }
    
}

const updateResponderFcmToken = async (req, res) => {
    const responderId = req.user.id; 
    const { fcmToken } = req.body;

    if (!fcmToken) {
        return res.status(400).json({ success: false, message: 'FCM Token wajib diisi.' });
    }

    try {
        const updatedResponder = await responderModel.updateResponderFcmToken(responderId, fcmToken);
        if (updatedResponder) {
            res.status(200).json({ success: true, message: 'FCM Token responden berhasil diperbarui.', responder: updatedResponder });
        } else {
            res.status(404).json({ success: false, message: 'Responden tidak ditemukan.' });
        }
    } catch (error) {
        console.error('Error updating responder FCM token:', error.message);
        res.status(500).json({ success: false, message: 'Gagal memperbarui FCM Token responden.', error: error.message });
    }
}

const updateResponderAvailability = async (req, res) => {
    const responderId = req.user.id; 
    const { isActive } = req.body; 

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Status ketersediaan tidak valid.' });
    }

    try {
        const updatedResponder = await responderModel.updateResponderAvailability(responderId, isActive);
        if (updatedResponder) {
            res.status(200).json({ success: true, message: 'Status ketersediaan responden berhasil diperbarui.', responder: updatedResponder });
        } else {
            res.status(404).json({ success: false, message: 'Responden tidak ditemukan.' });
        }
    } catch (error) {
        console.error('error updating responder availability:', error.message);
        res.status(500).json({ success: false, message: 'Gagal memperbarui status ketersediaan responden.', error: error.message });
    }
}

module.exports = {
    handleResponderAuth,
    updateResponderFcmToken,
    updateResponderAvailability
}