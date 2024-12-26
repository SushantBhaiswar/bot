const config = require('../config/config')

const query = async (route, method, username, payload) => {
    const url = `${config.domain}/${config.version}/${route}`
    console.log(url)
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        ...(payload ? { body: JSON.stringify(payload) } : {}),
    })
    console.log(response)
    return await response.json()

}

module.exports = { query }