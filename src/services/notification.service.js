const admin = require('../config/firebase')

/**
 * @param {string[]}
 * @param {string}
 * @param {string}
 * @param {object}
 */

const sendPushNotification = async (fcmTokens, title, body, data = {}) => {
    const validTokens = fcmTokens.filter(token => token && typeof token === 'string')

    if(!validTokens.length){
        console.log('No valif FCM tokens')
        return { success: true, message: 'no valid token to sned'};

    }

    const message = {
        notification: {
            title: title,
            body, body,
        },
        data: data,
        tokens: validTokens,
    }

    try{
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log(`notification successfully sent ${response.successCount} message, failed ${response.failureCount}`)

        if(response.failureCount > 0){
            response.responses.forEach((resp, idx)=>{
                if(!resp.success){
                    console.warn(`notification failed to send message to token ${validTokens[idx]}: ${resp.exception}`)
                }
            })
        }
    return {success: true, ...response}
    } catch (err){
        console.error('notification error sending push notification:', err)
        return {success: false, message: 'failed to send notif', error}
    }
}

module.exports = {
    sendPushNotification
}