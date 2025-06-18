const admin = require('../config/firebase')
const userModel = require('../models/user.model')
const responderModel = require('../models/responder.model') 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const JWT_SECRET = process.env.JWT_SECRET

const handlePelaporAuth = async (req, res) => {
    const idToken = req.body.idToken;

    if(!idToken){
        return res.status(400).json({success: false, message: 'ID Token is required'})
    }

    try{
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        const {uid, email, name, picture} = decodedToken;

        let user = await userModel.findUserByFirebaseUid(uid);

        if(!user){
            user = await userModel.createUser({
                firebaseUid: uid,
                email: email,
                name: name || 'User SIGAP',
                avatarUrl: picture || null
            })
        } else{
            console.log(`existing user ${user.email}`)
        }

        const appJwt = jwt.sign(
            {
                id: user.id,
                firebaseUid: user.firebase_uid,
                email: user.email,
                role: 'pelapor'
            },
            JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.status(200).json({
            success: true,
            message: 'autentikasi berhasil',
            token: appJwt,
            user: {
                id: user.id,
                email: user.mail,
                name: user.name,
                phoneNumber: user.phone_number,
                avatarUrl: user.avatar_url,
                role: 'pelapor'
            }
        })

    } catch (err){
        console.error('error : ', err)
        if(err.code === 'auth/id-token-expired'){
            return res.status(401).json({success: false, message: 'authentication failed ID token expired'})
        }
        res.status(401).json({success: false, message: 'authentication failed', error: err.message})
    }
}

const loginAdmin = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({success: false, message: 'emali dan password wajib diisi'})
    }

    try {
        const adminUser = await responderModel.findResponderByEmail(email);

        if(!adminUser || adminUser.role !== 'admin'){
            return res.status(401).json({success: false, message: 'kredensial tidak valid'})
        }

        const isMatch = await bcrypt.compare(password, adminUser.password_hash)
        if(!isMatch){
            return res.status(401).json({success: false, message: 'kredensia; todak valid'})
        }
        
        const appJwt = jwt.sign(
            { id: adminUser.id, email: adminUser.email, role: 'admin' },
            JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.status(200).json({
            success: true,
            message: 'admin login successful',
            token: appJwt,
            user: {
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role
            }
        })
    } catch (err){
        console.error('error during admin login:', err.message)
        res.status(500).json({success: false, message: 'internal server error'})
    }
}

module.exports = {
    handlePelaporAuth,
    loginAdmin
}