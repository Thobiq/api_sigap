const pool = require('../config/db.config')

const REPORT_TYPES = ['kebakaran', 'kecelakaan', 'medis', 'kriminalitas', 'bencana alam', 'lainnya']
const REPORT_STATUSES = ['pending', 'diproses', 'selesai', 'ditolak']

const ensureEmergencyReportTableExist = async () => {
    try {
        await pool.query(
            `DO $$ BEGIN
                 CREATE TYPE report_type_enum AS ENUM (${REPORT_TYPES.map(type => `'${type}'`).join(', ')});
            EXCEPTION
                WHEN duplicate_object THEN NULL;
            END $$;`
        )

        await pool.query(`
            DO $$ BEGIN
                CREATE TYPE report_status_enum AS ENUM (${REPORT_STATUSES.map(status => `'${status}'`).join(', ')});
            EXCEPTION
                WHEN duplicate_object THEN NULL;
            END $$;
        `)

        const query = `
            CREATE TABLE IF NOT EXISTS emergency_reports(
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL REFERENCES users(id),
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                report_type report_type_enum NOT NULL,
                description TEXT,
                image_url TEXT,
                status report_status_enum DEFAULT 'pending',
                assigned_responder_id INT NULL REFERENCES responders(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_reports_user_id ON emergency_reports(user_id);
            CREATE INDEX IF NOT EXISTS idx_reports_location ON emergency_reports(latitude, longitude);
            CREATE INDEX IF NOT EXISTS idx_reports_status ON emergency_reports(status);
            
        `;
        await pool.query(query)
        console.log('emergency reports table created')
    }catch(err){
        console.error('error creating table emergency reports : ', err.message)
        throw err;
    }
}

const createEmergencyReport = async ({userId, latitude, longitude, reportType, description, image_url}) => {
    try {
        const result =  await pool.query(
            `INSERT INTO emergency_reports (user_id, latitude, longitude, report_type, description, image_url)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [userId, latitude, longitude,reportType, description, image_url]
        )
        return result.rows[0]
    } catch (err){
        console.error('erro creating emergency report :', err.message)
        throw err
    }
}

const deleteEmergencyReport = async (reportId, userId)=>{
    try{
        const result = await pool.query(
            `DELETE FROM emergency_reports WHERE id = $1 AND user_id = $2 AND status = "selesai" RETURNING *`,
            [reportId, userId]
        )
        return result.rows[0]
    } catch (err){
        console.error('error deleting report :', err.message)
        throw err
    }
}

const assignReportToResponder = async (reportId, responderId) => {
    try {
        const result = await pool.query(
            `UPDATE emergency_reports SET assigned_responder_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [responderId, reportId]
        )
        return result.rows[0]
    }catch(err){
        console.error('assigning report to responder: ', err.message)
        throw err
    }
}

const getReportsByUserId = async (userId) => {
    try{
        const result = await pool.query('SELECT * FROM emergency_reports WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        )
        return result.rows
    }catch(err){
        console.error('error getting reports by user id :', err.message)
        throw err
    }
}

const getReportById = async (reportId) => {
    try{
        const result = await pool.query('SELECT * FROM emergency_reports WHERE id=$1', [reportId])
        return result.rows[0]
    } catch(err){
        console.error('error getting report by id : ', err.message)
        throw err
    }
}

const getAllReports = async () => {
    try{
        const result = await pool.query('SELECT * FROM emergency_reports ORDER BY creted_at DESC')
        return result.rows
    } catch (err){
        console.error('error getting all reports : ', err.message)
        throw err
    }
}

const updateReportStatus = async (reportId, newStatus) => {
    try{
        const result = await pool.query(
            `UPDATE emergency_reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id=$2 RETURNING *`,
            [newStatus, reportId]
        )
        return result.rows[0]
    } catch (err){
        console.error('error update ststus report : ', err.message)
        throw err
    }
}

module.exports = {
    ensureEmergencyReportTableExist,
    createEmergencyReport,
    deleteEmergencyReport,
    assignReportToResponder,
    getReportsByUserId,
    getReportById,
    getAllReports,
    updateReportStatus,
    REPORT_STATUSES,
    REPORT_TYPES
}