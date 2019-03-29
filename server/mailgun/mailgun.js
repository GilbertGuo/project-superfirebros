const api_key = '1e866d5ba21ebe6a89a3eec0320e77e0-e51d0a44-f86f864b';
const mailgun = require("mailgun-js");
const verification = require('./verification');
const DOMAIN = 'www.superfirebros.com';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});

module.exports = {
    send: (email, token) =>
        new Promise((resolve, reject) => {
            const data = {
                from: 'Superfirebros <superfirebros@gmail.com>',
                to: email,
                subject: 'SuperFireBros account register verification',
                text: 'Your Verification Code is '+ token +'.',
            };

            mg.messages().send(data, (error) => {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        })
}
;
