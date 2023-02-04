const scheduler = require('node-schedule');
const request = require('request');
const env = process.env;
const compServiceKey = env.CAMPSERVISEKEY;
const {
    Camps,
    CampAmenities,
    Envs,
    Types,
    Themes,
    Hosts,
} = require('../models');

let url = 'https://apis.data.go.kr/B551011/GoCamping/basedList?'; /*URL*/
let queryParams = encodeURIComponent('numOfRows') + '=' + 500;

queryParams += '&' + encodeURIComponent('pageNo') + '=' + 1;
queryParams += '&' + encodeURIComponent('MobileOS') + '=' + 'WIN';
queryParams += '&' + encodeURIComponent('MobileApp') + '=' + 'campfire';
queryParams +=
    '&' +
    'serviceKey' +
    '=' +
    encodeURIComponent(compServiceKey); /*Service Key*/
queryParams += '&' + encodeURIComponent('_type') + '=' + 'json';

const rule = new scheduler.RecurrenceRule();
rule.dayOfWeek = [1, 5];
rule.hour = 1;
rule.minute = 00;
rule.tz = 'Asia/Seoul';

const publicAPI = scheduler.scheduleJob(rule, function () {
    console.log(new Date());
    request(
        {
            url: url + queryParams,
            method: 'GET',
            rejectUnauthorized: false,
        },
        async function (error, response, body) {
            const obj = JSON.parse(body);
            const data = obj.response.body.items.item;

            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === undefined) continue;

                if (
                    data[i].bizrno.length === 12 &&
                    data[i].bizrno.indexOf(' ') === -1 &&
                    (data[i].tel.length === 12 || data[i].tel.length === 13) &&
                    data[i].tel.indexOf(' ') === -1
                ) {
                    const isExistHost = await Hosts.findOne({
                        where: { companyNumber: data[i].bizrno },
                    });
                    if (isExistHost) {
                        const { hostId } = isExistHost;
                        await Hosts.update(
                            {
                                companyNumber: data[i].bizrno,
                                phoneNumber: data[i].tel,
                            },
                            { where: { hostId } }
                        );
                        var dataHostId = hostId;
                    } else {
                        const { hostId } = await Hosts.create({
                            companyNumber: data[i].bizrno,
                            phoneNumber: data[i].tel,
                        });
                        var dataHostId = hostId;
                    }
                } else {
                    continue;
                }

                const isExistCampName = await Camps.findOne({
                    where: { campName: data[i].facltNm },
                });
                if (isExistCampName) {
                    const { campId } = isExistCampName;
                    await Camps.update(
                        {
                            campMainImage: data[i].firstImageUrl,
                            campSubImages: null,
                            campName: data[i].facltNm,
                            campAddress: data[i].addr1,
                            campDesc: data[i].intro,
                            checkIn: '15:00:00',
                            checkOut: '11:00:00',
                            mapX: data[i].mapX,
                            mapY: data[i].mapY,
                            premium: false,
                        },
                        { where: { campId } }
                    );
                    await CampAmenities.update(
                        {
                            campAmenities: data[i].sbrsCl,
                        },
                        { where: { campId } }
                    );
                    await Envs.update(
                        {
                            envLists: data[i].posblFcltyCl,
                        },
                        { where: { campId } }
                    );
                    await Types.update(
                        {
                            typeLists: data[i].induty,
                        },
                        { where: { campId } }
                    );
                    await Themes.update(
                        {
                            themeLists: data[i].themaEnvrnCl,
                        },
                        { where: { campId } }
                    );
                } else {
                    const createdCamp = await Camps.create({
                        hostId: dataHostId,
                        campMainImage: data[i].firstImageUrl,
                        campSubImages: null,
                        campName: data[i].facltNm,
                        campAddress: data[i].addr1,
                        campDesc: data[i].intro,
                        checkIn: '15:00:00',
                        checkOut: '11:00:00',
                        mapX: data[i].mapX,
                        mapY: data[i].mapY,
                        homepage: data[i].homepage,
                        premium: false,
                    });
                    const { campId } = createdCamp;
                    await CampAmenities.create({
                        campId,
                        campAmenities: data[i].sbrsCl,
                    });
                    await Envs.create({
                        campId,
                        envLists: data[i].posblFcltyCl,
                    });
                    await Types.create({
                        campId,
                        typeLists: data[i].induty,
                    });
                    await Themes.create({
                        campId,
                        themeLists: data[i].themaEnvrnCl,
                    });
                }
            }
            console.log(new Date());
            console.log('저장 완료');
        }
    );
});

module.exports = publicAPI;
