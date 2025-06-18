const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({success: false, message: 'access denied: no authentication token'})
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded

        next()
    } catch(err) {
        console.error('error : ', err.message)
        return res.status(403).json({success: false, message: 'access denied'})
    }
}

const isPelapor = (req, res, next) => {
    if(req.user && req.user.role === 'pelapor') {
        next()
    } else{
        res.status(403).json({success: false, message: 'access denied you are not pelapor'})
    }
}

const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        res.status(403).json({success: false, message: 'Access Denied : anda tidak memiliki izin sebagai admin'})

    }
}

const isResponder = (req, res, next) =>{
    if(req.user && req.user.role === 'responder'){
        next();
    } else{
        res.status(403).json({success: false, message: 'Acces Denied : anda tidak memiliki izin responder'})
    }
}

module.exports = {
    authenticateToken,
    isPelapor,
    isAdmin,
    isResponder
}