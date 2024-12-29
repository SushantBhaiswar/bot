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

    const { accessToken, refreshToken, expiry } = tokenData;

    // Check if the token is expired
    if (Date.now() >= expiry) {
        try {
            const response = await query(route.refreshToken, 'POST', null, { token: refreshToken });
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
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw new Error('Authentication required. Please log in again.');
        }
    }

    return tokenData;
}

async function storeTokens(interActionId, accessToken, refreshToken, expiresIn, userId) {
    console.log("🚀 ~ storeTokens ~ expiresIn:", expiresIn)
    const expiryDate = Date.now() + new Date(expiresIn) * 1000;
    console.log("🚀 ~ storeTokens ~ expiryDate:", expiryDate)

    const tokenData = { accessToken, userId: interActionId, refreshToken, expiry: expiryDate };

    console.log("🚀 ~ storeTokens ~ tokenData:", tokenData)
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
