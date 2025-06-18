const uploadImage = async (req, res) => {
    if(!req.file){
        return res.status(400).json({success: false, message: 'file is empty'})
    }

    const imageUrl = `<span class="math-inline">\{req\.protocol\}\://</span>{req.get('host')}/uploads/${req.file.filename}`

    res.status(200).json({
        success: true,
        message: 'gambar berhasil diunggah',
        url: imageUrl
    })
}

module.exports = {
    uploadImage
}