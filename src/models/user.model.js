const pool = require('../config/db.config')

const ensureUserTableExists = async () => {
    try{
        const query = `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            firebase_uid VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            phone_number VARCHAR(20),
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );`

        await pool.query(query);
        console.log('table user created')
    } catch (err){
        console.error('error creat user table: ',err.message )
        throw err
    }
}

const findUserByFirebaseUid = async (firebaseUid) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [firebaseUid])
        return result.rows[0]
    } catch (err){
        console.error('error fond user by firebase uid: ', err.message)
        throw err
    }
}

const createUser = async ({firebaseUid, email, name, phoneNumber, avatarUrl}) => {
    try{
        const result = await pool.query(
            'INSERT INTO users (firebase_uid, email, name, phone_number, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, firebase_uid, email, name, phone_number, avatar_url, created_at',
            [firebaseUid, email, name, phoneNumber, avatarUrl]
        )
        return result.rows[0]
    } catch (err){
        console.error('error : ', err.message)
        throw err
    }
}

const updateUser = async (firebaseUid, {name, phoneNumber, avatarUrl}) => {
    try{
        const result = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), phone_number = COALESCE($2, phone_humber), avatar_url = COALESCE($3, avatar_url) WHERE firebase_uid = $4 RETURNING id, firebase_uid, email, name, phone_number, avatar_url, created_at',
            [name, phoneNumber, avatarUrl, firebaseUid]
        )
        return result.rows[0]
    } catch (err){
        console.error('error : ', err.message)
        throw err
    }
}

module.exports = {
    ensureUserTableExists,
    findUserByFirebaseUid,
    createUser,
    updateUser
}