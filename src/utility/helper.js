
const getuserMessagessEn = require('../lang/en/userMessages.json');
const geterrorMessagessEn = require('../lang/en/errorMessages.json');




const getuserMessagess = (messageKey, lang = 'en') => {
    let apiMessagesSource;
    if (lang === 'en') {
        apiMessagesSource = getuserMessagessEn;
    }


    const messageKeyArr = messageKey.split('.');
    const sourceMessageObjKey = messageKeyArr[0];
    const tempMessageKey = messageKeyArr[1];

    if (tempMessageKey in apiMessagesSource[sourceMessageObjKey]) {
        return apiMessagesSource[sourceMessageObjKey][tempMessageKey];
    }
    return 'No appropriate message found for api.';
};

const geterrorMessagess = (messageKey, lang = 'en') => {
    try {
        let apiMessagesSource;
        if (lang === 'en') {
            apiMessagesSource = geterrorMessagessEn;
        }


        const messageKeyArr = messageKey.split('.');
        const sourceMessageObjKey = messageKeyArr[0];
        const tempMessageKey = messageKeyArr[1];

        if (tempMessageKey in apiMessagesSource[sourceMessageObjKey]) {
            return apiMessagesSource[sourceMessageObjKey][tempMessageKey];
        }
        return 'No appropriate message found for api.';

    } catch (error) {
        console.log(error)
        return 'No appropriate message found for api.';
    }
};






module.exports = {
    getuserMessagess,
    geterrorMessagess,
};
