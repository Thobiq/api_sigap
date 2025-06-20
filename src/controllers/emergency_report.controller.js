const emergencyReportModel = require('../models/emergency_report.model')
const responderModel = require('../models/responder.model')
const locationHelpers = require('../utils/location_helpers')
const notificationService = require('../services/notification.service')
const e = require('express')

const createReport = async (req, res) => {
    const userId = req.user.id;

    const {latitude, longitude, reportType, description, imageUrl} = req.body

    if(latitude == null || longitude == null || !reportType){
        return res.status(400).json({success: false, message: 'latitude longitude, dan tipe laporan wajib diiisi'})

    }

    if(!emergencyReportModel.REPORT_TYPES.includes(reportType)){
        return res.status(400).json({success: false, message: 'tipe laporan tidak valid'})
    }

    if(typeof latitude !== 'number' || typeof longitude !== 'number'){
        return res.status(400).json({success: false, message: 'Latitude dan Longitude harus berupa angka'})
    }

    try{
        const newReport = await emergencyReportModel.createEmergencyReport({
            userId,
            latitude,
            longitude,
            reportType,
            description,
            imageUrl
        })

        const getAllActiveResponders = await responderModel.getAllActiveResponders();

        let relevantResponderType;
        if(reportType === 'kebakaran'){
            relevantResponderType = 'pemadam kebakaran';
        } else if( reportType === 'kecelakaan' || reportType === 'kriminalitas'){
            relevantResponderType = 'polisi'
        } else if(reportType === 'medis'){
            relevantResponderType = 'rumah sakit'
        }

        const responderWithDistance = getAllActiveResponders.
            map(res=> {
                const distance = locationHelpers.haversineDistance(
                    latitude, longitude, res.latitude, res.longitude
                )
                return {responder: res, distance}
            }).
            filter(item => {
                const isTypeMatch = relevantResponderType ? item.responder.type === relevantResponderType : true
                const isWithinRange = item.distance <= 500
                return isTypeMatch && isWithinRange
            })
        responderWithDistance.sort((a,b) => a.distance - b.distance)
        const closestResponders = responderWithDistance.slice(0,3)

        console.log(`[Create Report] Found ${closestResponders.length} closest relevant responders for report ${newReport.id}:`);
        closestResponders.forEach(r => console.log(` - ${r.responder.name} (${r.responder.type}), Distance: ${r.distance.toFixed(2)} km`));

        const fcmTokenToNotify = closestResponders
            .map(item => item.responder.fcm_token)
            .filter(token => token)

        if (fcmTokenToNotify.length > 0) {
            const uniqueFcmTokens = [...new Set(fcmTokenToNotify)];

            await notificationService.sendPushNotification(
                uniqueFcmTokens,
                "Laporan Darurat Baru",
                `Tipe: ${reportType} di lokasi Anda. respobder terdekat: ${closestResponders[0]?.responder.name} berjarak ${closestResponders[0]?.distance.toFixed(2) ?? '-'} km.`,
                {
                    report_id: newReport.id.toString(),
                    report_type: reportType,
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    responder_id: closestResponders[0]?.responder.id.toString() ?? '',
                    responder_name: closestResponders[0]?.responder.name ?? '',
                    responder_type: closestResponders[0]?.responder.type ?? '',
                }
            );
            console.log(`[Create Report] Sent notification to ${uniqueFcmTokens.length} unique FCM tokens.`);
        } else {
            console.log('[Create Report] No FCM tokens found for closest relevant responders. Notification skipped.');
        }

        res.status(201).json({success: true, message: 'Laporan darurat berhasil dibuat dan responden terdekat telah dinotifikasi.', report: newReport})

    } catch(err){
        console.error('error creating emergenci report: ', err.message)
        res.status(500).json({success: false, message: 'Gagal membuat laporan darurat.', error: err.message})
    }
}

const getMyReports = async (req, res) => {
    const userId = req.user.id

    try {
        const reports = await emergencyReportModel.getReportsByUserId(userId)
        res.status(200).json({ success: true, reports: reports })
    } catch (error) {
        console.error('Error getting user reports:', error.message)
        res.status(500).json({ success: false, message: 'Gagal mendapatkan riwayat laporan.', error: error.message });
    }
}

const getReportDetail = async (req, res) => {
    const reportId = req.params.id
    const userId = req.user.id

    try {
        const report = await emergencyReportModel.getReportById(reportId)

        if (!report) {
            return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan.' })
        }

        if (report.user_id !== userId) {
            return res.status(403).json({ success: false, message: 'Akses Ditolak: Anda tidak memiliki izin untuk melihat laporan ini.' })
        }

        res.status(200).json({ success: true, report: report })
    } catch (error) {
        console.error('Error getting report detail:', error.message)
        res.status(500).json({ success: false, message: 'Gagal mendapatkan detail laporan.', error: error.message })
    }
}

module.exports = {
    createReport,
    getMyReports,
    getReportDetail
}