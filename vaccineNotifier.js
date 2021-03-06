require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


let pinCode = []
const PINCODE = process.env.PINCODE
pinCode.push(PINCODE)
if (process.env.PINCODE1) {
    pinCode.push(process.env.PINCODE1)
}
if (process.env.PINCODE2) {
    pinCode.push(process.env.PINCODE2)
}
if (process.env.PINCODE3) {
    pinCode.push(process.env.PINCODE3)
}

const EMAIL = process.env.EMAIL
const AGE = process.env.AGE

async function main() {
    try {
        cron.schedule('*/2 * * * *', async () => {
            await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability() {

    let datesArray = await fetchNext10Days();
    datesArray.map(date => {
        getSlotsForDate(date);
    })
}

function getSlotsForDate(DATE) {
    for (const iterator of pinCode) {
        let config = {
            method: 'get',
            url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + iterator + '&date=' + DATE,
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'hi_IN'
            }
        };

        axios(config)
            .then(function (slots) {
                let sessions = slots.data.sessions;
                let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE && slot.available_capacity > 0)
                console.log({ pincode: iterator, date: DATE, validSlots: validSlots.length })
                if (validSlots.length > 0) {
                    notifyMe(validSlots);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

async function notifyMe(validSlots) {
    let vaccineDate = validSlots.map(x => {
        return x.date
    })
    console.log("vaccineDate===>", vaccineDate);
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(EMAIL, `VACCINE AVAILABLE on ${vaccineDate}`, slotDetails, (err, result) => {
        if (err) {
            console.error({ err });
        }
    })
};

async function fetchNext10Days() {
    let dates = [];
    let today = moment();
    for (let i = 0; i < 10; i++) {
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => { console.log('Vaccine availability checker started.'); });
