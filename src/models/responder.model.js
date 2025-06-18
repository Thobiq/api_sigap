const pool = require('../config/db.config')

const RESPONDER_TYPES = ['rumah sakit', 'pemadam kebakaran', 'polisi', 'admin']

const ensureRespondersTableExists = async ()=>{
    try{
        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE responder_type_enum AS ENUM (${RESPONDER_TYPES.map(type => `'${type}'`).join(', ')});
            EXCEPTION
                WHEN duplicate_object THEN NULL;
            END $$;
        `)

        const query = `
            CREATE TABLE IF NOT EXISTS responders (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                name VARCHAR(255),
                type responder_type_enum,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                address TEXT,
                phone_number VARCHAR(50),
                role VARCHAR(50) DEFAULT 'responder',
                fcm_token TEXT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP WITH TIME ZONE);
            CREATE INDEX IF NOT EXISTS idx_responders_location ON responders(latitude, longitude);
            CREATE INDEX IF NOT EXISTS idx_responders_type ON responders(type);
            CREATE INDEX IF NOT EXISTS idx_responders_role ON responders(role);
            `
        await pool.query(query)
        console.log('responders table created')
    } catch (err){
        console.error('error creating responders table', err.messagge)
        throw err
    }
} 

const getAllActiveResponders = async()=>{
    try{
        const result = await pool.query(`
            SELECT id, name, type, latitude, longitude, address, phone_number, cfm_token, role
            FROM responders
            WHERE is_active = TRUE
            AND type IN ('rumah sakit', 'polisi', 'pemadam kebakaran')
            AND latitude IS NOT NULL
            AND longitude IS NOT NULL
            AND fcm_token IS NOT NULL
        `)
        return result.rows
    } catch (err){
        console.error('error getting all active resonder : ', err.messagge);
        throw err
    }
}

const createResponders = async ({email, passwordHash, name, type, latitude, longitude, address, phoneNumber, role = 'responder'}) =>{
    try{
        const result = await pool.query(
            `INSERT INTO responders (email, password_hash, name, type, latitude, longitude, address, phone_number, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [email, passwordHash, name, type, latitude, longitude, address, phoneNumber, role]
        )

        return result.rows[0]
    } catch (err){
        console.error('error creating responder : ', err.messagge)
        throw err
    }
}
const findResponderByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT * FROM responders WHERE email = $1', [email])
        return result.rows[0]
    } catch (err) {
        console.error('Error finding responder by email:', err.message)
        throw err
    }
};

const updateResponderFcmToken = async (responderId, fcmToken) => {
    try{
        const result = await pool.query(
            `UPDATE responders SET fcm_token = $1, last_login = CURRENT_TIMESTAMP
            WHERE id = $2 RETURNING *`,
            [fcmToken, responderId]
        )
        return result.rows[0]
    } catch(err){
        console.error('error update responder FCM : ', err.messagge)
        throw err
    }
}

const updateResponderAvailability = async (responderId, isActive) => {
    try{
        const result = await pool.query(
            `UPDATE responders SET is_active = $1 WHERE id = $2 RETURNING *`,
            [isActive, responderId]
        )
        return result.rows[0]
    } catch(err){
        console.error('erro updating responder availability', err.massage)
        throw err
    }
}

module.exports = {
    ensureRespondersTableExists,
    getAllActiveResponders,
    createResponders,
    findResponderByEmail,
    updateResponderAvailability,
    RESPONDER_TYPES
}