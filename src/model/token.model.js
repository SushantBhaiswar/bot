const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema(
    {
        accessToken: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },

        expires: {
            type: Date,
            required: true,
        },

        refreshToken: {
            type: String,
            required: true
        },

        expiry: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true,
    }
);


/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
