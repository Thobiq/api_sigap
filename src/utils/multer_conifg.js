const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
    console.log(`[Multer Config] Created uploads directory at: ${uploadsDir}`)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = /jpeg|jpg|png/
    const isMimeTypeAllowed = allowedMimeTypes.test(file.mimetype)
    const isExtnameAllowed = allowedMimeTypes.test(path.extname(file.originalname).toLowerCase())

    if (isMimeTypeAllowed && isExtnameAllowed) {
        cb(null, true)
    } else {
        cb(new Error('format gambar harus (JPEG, JPG, PNG, GIF)!'), false);
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, 
    fileFilter: fileFilter
});

module.exports = upload;