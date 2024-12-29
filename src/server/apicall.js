const config = require('../config/config')

const query = async (route, method, headers, payload) => {
    console.log("🚀 ~ query ~ payload:", payload)
    const url = `${config.domain}/${config.version}/${route}`
    const response = await fetch(url, {
        method: method,
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
    })
    return await response.json()

}

module.exports = { query }