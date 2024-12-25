const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define and validate environment variables
const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('bot').required(),
        DISCORD_TOKEN: Joi.string().required(),
        BACKEND_DOMAIN: Joi.string().required(),
        VERSION: Joi.string().valid('v1').required(),
        CLIENT_ID: Joi.string().required(),
        PORT: Joi.number().default(3000),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    domain: envVars.BACKEND_DOMAIN,
    version: envVars.VERSION,
    discord: {
        token: envVars.DISCORD_TOKEN,
        clientId: envVars.CLIENT_ID,
    },
};
