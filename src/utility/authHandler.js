const { query } = require('../server/apicall');
const route = require('../server/routes');

const userTokens = new Map();

async function getToken(userId) {
    const tokenData = userTokens.get(userId);

    if (!tokenData) {
        throw new Error('User is not logged in.');
    }

    const { accessToken, refreshToken, expiry } = tokenData;

    // Check if the token is expired
    if (Date.now() >= expiry) {
        try {
            const response = await query(route.refreshToken, 'POST', null, { token: refreshToken });
            if (response.code === 200) {
                userTokens.set(userId, {
                    accessToken: response.data.newAccessToken,
                    refreshToken: response.data.newRefreshToken,
                    expiry: Date.now() + response.data.expiresIn * 1000,
                });
                return response.data.newAccessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            throw new Error('Authentication required. Please log in again.');
        }
    }

    return accessToken;
}

function storeTokens(interActionId, accessToken, refreshToken, expiresIn, userId) {
    userTokens.set(interActionId, {
        accessToken,
        refreshToken,
        userId,
        expiry: Date.now() + expiresIn * 1000,
    });
}

function removeTokens(userId) {
    userTokens.delete(userId);
}

module.exports = { getToken, storeTokens, removeTokens };
