const { query } = require('../server/apicall');
const route = require('../server/routes');
const { sendErrorMessage } = require('../utility/messageHandler')
const { Token } = require('../model/index')
const userTokens = new Map();

async function initializeTokens() {
    try {
        const tokens = await Token.find({});
        tokens.forEach(token => {
            userTokens.set(token.userId, {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expiry: token.expiry,
            });
        });
        return 'Memory tokens initialized from MongoDB';
    } catch (error) {
        throw error
    }

}

async function getToken(interaction) {
    const userId = interaction?.user?.id
    let tokenData = userTokens.get(userId);
    console.log("🚀 ~ getToken ~ tokenData:", tokenData)
    if (!tokenData) {
        const mongoToken = await Token.findOne({ userId });

        if (!mongoToken) {
            return sendErrorMessage(interaction, 'Restricted', 'Login to access!');
        }

        tokenData = {
            accessToken: mongoToken.accessToken,
            refreshToken: mongoToken.refreshToken,
            expiry: mongoToken.expiry,
        };

        userTokens.set(userId, tokenData);

    }

    let { accessToken, refreshToken, expiry } = tokenData;

    if (typeof expiry === "string") {
        expiry = parseInt(expiry, 10); // Convert string to number
    }

    // Compare expiry as a timestamp
    console.log("🚀 ~ getToken ~ Date.now() >= expir:", Date.now(), expiry)
    console.log("🚀 ~ getToken ~ Date.now() >= expir:", Date.now() >= new Date(expiry).getTime())
    if (Date.now() >= new Date(expiry).getTime()) {
        try {
            console.log("action token replaced")
            const response = await query(route.refreshToken, 'POST', null, { refreshToken });
            if (response.code === 200) {
                const updatedTokenData = {
                    accessToken: response.data.tokens.access.token,
                    refreshToken: response.data.tokens.refresh.token,
                    expiry: Date.now() + response.data.access.expires * 1000,
                };

                userTokens.set(userId, updatedTokenData);
                await Token.updateOne({ userId }, updatedTokenData);

                return updatedTokenData;
            } else {
                throw new Error(response.message || 'Session Timeout ! Please Login Again');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw new Error('Session Timeout ! Please Login Again');

        }
    }

    return tokenData;
}

async function storeTokens(interActionId, accessToken, refreshToken, expiresIn, userId) {

    const tokenData = { accessToken, userId: interActionId, refreshToken, expiry: expiresIn };

    userTokens.set(interActionId, tokenData);

    try {

        await Token.updateOne({ userId: interActionId }, tokenData, { upsert: true, new: true });
    } catch (error) {
        console.error('Error storing tokens:', error);
    }
}

async function removeTokens(userId) {
    userTokens.delete(userId);

    try {
        await Token.deleteOne({ userId });
    } catch (error) {
        console.error('Error removing tokens:', error);
    }
}

module.exports = { getToken, initializeTokens, storeTokens, removeTokens };