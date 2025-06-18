const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bcrypt = require('bcryptjs')

require('./src/config/firebase')

const pool = require('./src/config/db.config')

const authRoutes = require('./src/routes/auth.routes')
const uploadRoutes = require('./src/routes/upload.routes')
const emergencyReportRoutes = require('./src/routes/emergency_report.routes')
const responderRoutes = require('./src/routes/responder.routes')
const adminRoutes = require('./src/routes/admin.routes')

const userModel = require('./src/models/user.model')
const responderModel = require('./src/models/responder.model')
const emergencyReportModel = require('./src/models/emergency_report.model')

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static('uploads'))
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/reports', emergencyReportRoutes)
app.use('/api/responders', responderRoutes)
app.use('/api/admin', adminRoutes)

app.use((err, req, res, next) => {
    console.error('global error handler : ', err.stack)
    res.status(500).json({success: false, message: 'internal server error', error: err.message})
})

const seedDefaultResponders = async () => {
    const defaultRespondersData = [
        { email: 'rsjemberklinik@sigap.com', password: 'password123', name: 'Rumah Sakit Perkebunan Jember Klinik', type: 'rumah sakit', latitude: -8.152865, longitude: 113.722956, address: 'Jl. Bedadung No.2, Jemberlor', phone_number: '+6285859209209' },
        { email: 'rsdkt@sigap.com', password: 'password123', name: 'Rumah Sakit Baladhika Husada (RS DKT) Jember', type: 'rumah sakit', latitude: -8.153434, longitude: 113.727503, address: 'Jl. Panglima Besar Sudirman No.45, Jemberlor', phone_number: '+62331484674' },
        { email: 'siloamjember@sigap.com', password: 'password123', name: 'Siloam Hospitals Jember', type: 'rumah sakit', latitude: -8.169106, longitude: 113.715378, address: 'Jl. Gajah Mada No.104, Jember Kidul', phone_number: '+623312861900' },
        { email: 'rsddrsoebandi@sigap.com', password: 'password123', name: 'Rumah Sakit Daerah (RSD) dr. Soebandi', type: 'rumah sakit', latitude: -8.130761, longitude: 113.723049, address: 'Jl. DR. Soebandi No.124, Patrang', phone_number: '+62331487441' },
        { email: 'rsparujember@sigap.com', password: 'password123', name: 'Rumah Sakit Paru Jember', type: 'rumah sakit', latitude: -8.140889, longitude: 113.723611, address: 'Jl. Nusa Indah No.28, Jemberlor', phone_number: '+62331411781' },
       
        { email: 'polresjember@sigap.com', password: 'password123', name: 'Kantor POLRES Jember', type: 'polisi', latitude: -8.148564, longitude: 113.719665, address: 'Jl. R.A. Kartini No.17, Kepatihan', phone_number: '+62331484285' },
        { email: 'polseksumbersari@sigap.com', password: 'password123', name: 'POLSEK Sumbersari - Jember', type: 'polisi', latitude: -8.181822, longitude: 113.708892, address: 'Jl. MT Haryono No.202, Wirolegi', phone_number: '+62331330647' },
        { email: 'polsekpatrang@sigap.com', password: 'password123', name: 'POLSEK Patrang - Jember', type: 'polisi', latitude: -8.139659, longitude: 113.720387, address: 'Jl. Slamet Riyadi No.48, Patrang', phone_number: '+62331422569' },
        

        { email: 'damkarjember@sigap.com', password: 'password123', name: 'Pemadam Kebakaran dan Penyelamatan Kabupaten Jember', type: 'pemadam kebakaran', latitude: -8.169305, longitude: 113.727503, address: 'Jl. Danau Toba No.16, Tegalgede', phone_number: '+62331326726' },
    ];

    try {
        for (const resData of defaultRespondersData) {
            const existing = await pool.query('SELECT id FROM responders WHERE email = $1', [resData.email]);
            if (existing.rows.length === 0) {
                const hashedPassword = await bcrypt.hash(resData.password, 10);
                await responderModel.createResponders({
                    email: resData.email,
                    passwordHash: hashedPassword,
                    name: resData.name,
                    type: resData.type,
                    latitude: resData.latitude,
                    longitude: resData.longitude,
                    address: resData.address,
                    phoneNumber: resData.phone_number
                });
                console.log(`[Seed] Inserted default responder (institution): ${resData.name}`);
            } else {
                console.log(`[Seed] Default responder (institution) already exists: ${resData.name}`);
            }
        }
        console.log(' responders seeding completed.');
    } catch (err) {
        console.error('error seeding responders :', err.message);
        throw err
    }
}

const seedAdminAccount = async () => {
    const adminEmail = 'admin@sigap.com'
    const adminPassword = 'adminpassword123'
    const adminName = 'Super Admin SIGAP'

    try {
        const existingAdmin = await responderModel.findResponderByEmail(adminEmail)
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await responderModel.createResponders({
                email: adminEmail,
                passwordHash: hashedPassword,
                name: adminName,
                type: 'admin', 
                latitude: 0, 
                longitude: 0,
                address: 'N/A',
                phoneNumber: 'N/A',
                role: 'admin' 
            });
            console.log(`Default admin account created: ${adminEmail}`)
        } else {
            console.log(`Default admin account already exists: ${adminEmail}`)
        }
    } catch (error) {
        console.error('Error seeding admin account:', error.message)
        throw error;
    }
}

const initializeApp = async () => {
    try{
        await userModel.ensureUserTableExists()
        await responderModel.ensureRespondersTableExists()
        await emergencyReportModel.ensureEmergencyReportTableExist()

        await seedDefaultResponders()
        await seedAdminAccount();

        app.listen(PORT, ()=>{
            console.log(`server is running on port ${PORT}`)
        })
    } catch (err){
        console.error('fatal error')
        console.error(err.message)
        process.exit(1)
    }
}

initializeApp()