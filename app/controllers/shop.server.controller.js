var request = require('request');
var url = require('url');
var Promise = require("bluebird");
var util = require('util');
var log4js = require('log4js');
//var moment = require('moment-timezone');
var config = require('../../config/config');
var async = require('async');
var _ = require('underscore');

log4js.configure(config.log4jsConfig);

var logger = log4js.getLogger();

var URL_BASE         = "https://www.stubhub.com";
var URL_BUY_REVIEW   = URL_BASE + "/buy/review?ticket_id=1196433434&quantity_selected=1&event_id=9514727";
var URL_BUY_PURCHASE = URL_BASE + "/shape/purchase/carts/v2/";

var PROXY_URL = 'http://quotaguard2335:efd2cd5cc5bf@us-east-1-static-brooks.quotaguard.com:9293';


//var swayQueryFields = 'id,name,created,updated,starts,canceled,venue.fields(id,name,longitude,latitude,timezone),performers.fields(id,name)';
var unifiedQueryFields = 'id,status,title,name,eventUrl,eventDateLocal,eventDateUTC,imageUrl,venue,performers';

exports.hello = function(req, res){
    res.status(200).send("Tik!");
};

exports.shop = function(req, res) {
    var msg = "shop - ";
    logger.debug(msg + "Started");


    async.waterfall([
        function (callback) {
            logger.debug(msg + "getting listing");
            getListing(callback);
        },
        function (order, callback) {
var listingId = req.params.listingId;
if (listingId) order.listingId = listingId;
            logger.debug(msg + "getting cart");
            getCart(order, callback);
        },
        function (cart, callback) {
            logger.debug(msg + "checking out");
            checkOut(cart, callback);
        }
    ], function (error) {
        if (error) {
            logger.error(msg + "Error: " + JSON.stringify(error));
            res.status(500).json(error);
        } else {
            logger.debug(msg + "Finished!");
            res.status(200).json({status: "success"});
        }
    });
};

exports.buynow = function (req, res) {
    res.status(200).send("TBD");
};

exports.checkout = function (req, res) {
    res.status(200).send("TBD");
};

//eventId=9514727

//https://www.stubhub.com/shape/inventory/listings/v2/1196433434
// Post: {
//          "cart": {
//              "items": [{
//                  "listingId": "1196433434",
//                  "quantity": "1",
//                  "buyerSourceAppId": null
//              }],
//              "orderSourceId": 7,
//              "deleteIfExist": "Y"
//          }
//      }
//https://www.stubhub.com/shape/purchase/carts/v2/      //create cart
// ==>  {
//          "cart": {
//              "id": "5jT7GzGHmHGHbdX2"
//          }
//      }

//  get cart:
//https://www.stubhub.com/shape/purchase/carts/v2/5jT7GzGHmHGHbdX2?detail=long&_=1462487903459


function getListing(outterCallback) {
    var msg = "getListing() - ";
    logger.debug(msg + "Started");

return outterCallback(null, {
                "listingId": "1197830040",  //1197882103
                "quantity": 1,
                "buyerSourceAppId": null
            });      //OJO!!

    return shRequest("GET", URL_BUY_REVIEW, "", "", function(error, body) {
        if (error) logger.error(msg + "Error: " + JSON.stringify(error));
        logger.debug(msg + "Body: " + JSON.stringify(error));
    });

/**
    async.parallel([
        function (callback) {
            processCart(callback);
        },
        function (notifsByDevice, callback) {
            processOther(callback);
        }
    ], function (error) {
        if (error) {
            logger.error(msg + "Error: " + JSON.stringify(error));
            outterCallback(error);
        } else {
            logger.debug(msg + "Finished!");
            outterCallback(null);
        }
    });**/
}

function getCart(order, outterCallback) {
    var msg = "getCart(" + order.listingId + ") - ";
    logger.debug(msg + "Started");

    var body = {
        "cart": {
            "items": [{
                "listingId": order.listingId,
                "quantity": order.quantity,
                "buyerSourceAppId": order.buyerSourceAppId
            }],
            "orderSourceId": 7,
            "deleteIfExist": "Y"
        }
    };


    return shRequest("POST", URL_BUY_PURCHASE, "", body, function(error, body) {
        if (error) logger.error(msg + "Error: " + JSON.stringify(error));
        logger.debug(msg + "Body: " + JSON.stringify(error));
    });

/**    async.parallel([
        function (callback) {
            getCart(callback);
        },
        function (notifsByDevice, callback) {
            processOther(callback);
        }
    ], function (error) {
        if (error) {
            logger.error(msg + "Error: " + JSON.stringify(error));
            outterCallback(error);
        } else {
            logger.debug(msg + "Finished!");
            outterCallback(null);
        }
    });*/
}

function checkOut(cart, callback) {

    callback(null);
}

/****
Cookie  TLTSID=FF4F4598163E1016BD83EE23C7CDB35C; DC=lvs01; akavpau_ddos_us_domain=1462837350~id=bd3712c06559746915f850988d8a35a8; AMCV_1AEC46735278551A0A490D45%40AdobeOrg=1304406280%7CMCMID%7C78754896556850714312260721558649549383%7CMCIDTS%7C16931%7CMCAID%7CNONE%7CMCAAMLH-1463441851%7C9%7CMCAAMB-1463441851%7Chmk_Lq6TPIBMW925SPhw3Q; _br_uid_2=uid%3D1427494804072%3Av%3D11.8%3Ats%3D1462837052362%3Ahc%3D1; __uvt=; xdVisitorId=12F1mIxiUInU4FzN1xfnxlMeY14OuQNtSNb3zue1dkFxe5QF933; atgRecVisitorId=12F1mIxiUInU4FzN1xfnxlMeY14OuQNtSNb3zue1dkFxe5QF933; atgRecSessionId=awuX4gh8-9--IoQXleuy2J45QcC9VEcTzvheYnjkOZ7S_Ly-OccF!2033468134!564941919; uvts=4WQWTLwtnUwUcJ07; SH_AT=1XNOHCPxzhOmYfQsadRFfX%2FOMRCZ0KKzhzQg%2BzAtaxxW5pfv1Rx11KOIF7aMprwAKC8gacKtSJAoIBx1rCj26tRDS%2F%2FaXcM2NhU6KPBuUM4%3D; fsr.s={"v2":-2,"v1":1,"rid":"de358f9-93053134-651e-15a6-a7b50","cp":{"Unified_StubHub":"N","TLSessionID":"FF4F4598163E1016BD83EE23C7CDB35C","campaign_name":"UEEP023: Quantity Question Non-GA V2 (PROD)","campaign_recipe_name":"UEEP023: Control"},"to":3.2,"c":"http://www.stubhub.com/flume-tickets-flume-san-francisco-bill-graham-civic-auditorium-9-23-2016/event/9578558/","pv":2,"lc":{"d3":{"v":2,"s":false}},"cd":3,"f":1462837086570}; mbox=session#1462837051313-383734#1462838948|PC#1462837051313-383734.28_48#1497051488; session:loginStatus=0; session:sessionId=9457CD46EC9D4F42A9E82CABC355551E; session:userGUID=DBD1434615DC6AFAE0440021286899D6; track_session_userGUID=DBD1434615DC6AFAE0440021286899D6; session_uAuthenticated=1; session:CSRFtoken=ftojXebp4tAZ7R9rBXt6VUmq1OaJMh84fHNd1dNArQ5pbxSJm8cqkHJ5u/5qXbrzhQFpigjJjcmOtH4VdPiKqg==; S_ACCT=stubhub; SH_VI=15e3c5f69b2b4e88b4a434e0f6afb824; s_pers=%20s_dfa%3Dstubhub%7C1462838887168%3B%20s_vs%3D1%7C1462838899567%3B%20s_nr%3D1462837099571-New%7C1496965099571%3B; s_sess=%20s_cpc%3D0%3B%20s_cc%3Dtrue%3B%20s_sq%3D%3B; TLTHID=1C7D7CB6163F10169ED39D995E4E57B9; SH_UT=22ZcbMVUhVeOD6%2F7h05tH9TuFjOd%2BjAYA30F8IDpZsW18sR69ts1ghhUzb59wX7g4PWpLlzZ2wBG7iCDo%2FHz5pL8OM4cXC%2B9NbE7aLq6eA%2F6oQnImCqLv%2Fr4bWen7GLnZ8wK3I%2FK1yIDhI7LK5Piz2ykmWMGZ7SgQn47NB3WpvcQsa85prpgzItWEm7b7MwHnz53jhEkCghhYGmaiNSc5LB8mxTKt7%2B8P%2Bx2VtmZOYhaLFQyFlLJVqv%2B%2B3Be8olA
Origin  https://www.stubhub.com
Accept-Encoding gzip, deflate
x-csrf-token    ftojXebp4tAZ7R9rBXt6VUmq1OaJMh84fHNd1dNArQ5pbxSJm8cqkHJ5u/5qXbrzhQFpigjJjcmOtH4VdPiKqg==
Host    www.stubhub.com
Accept-Language en-us
User-Agent  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36
TARGET_HOST stubhub
Content-Type    application/json
Accept  application/json
Referer https://www.stubhub.com/buy/review?ticket_id=1197830040&quantity_selected=1&event_id=9578558
X-Requested-With    XMLHttpRequest
Connection  keep-alive
Content-Length  124
======
Cookie  TLTSID=0F845EB2186A1018E064E9864F24E57F; DC=lvs01; akavpau_ddos_us_domain=1463075748~id=4bd752c2caff06ba883161fec19b7f6f; AMCV_1AEC46735278551A0A490D45%40AdobeOrg=1304406280%7CMCIDTS%7C16934%7CMCMID%7C15941329986180209663013202697581476536%7CMCAAMLH-1463680249%7C9%7CMCAAMB-1463680249%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7CNONE; _br_uid_2=uid%3D9886621714643%3Av%3D11.8%3Ats%3D1463075449878%3Ahc%3D1; __uvt=; xdVisitorId=12F1Yo_4j-Pz_2smN4keSZ39To1MDinmag1UcstmsDeosoQ19BD; __gads=ID=c776f7c09577c56d:T=1463075451:S=ALNI_MbLOZzJFWOceNmrbJ69E3O6ATBHug; atgRecVisitorId=12F1Yo_4j-Pz_2smN4keSZ39To1MDinmag1UcstmsDeosoQ19BD; atgRecSessionId=4XmmF7FgFaxFPDyW3eBRjeH8wvuM9xosIh7dzYS_-s5BM85YAO6I!2033468134!564941919; uvts=4X7Sjvj77E4fw48n; SH_AT=1XNOHCPxzhOmYfQsadRFfX%2FOMRCZ0KKzhzQg%2BzAtaxxW5pfv1Rx11KOIF7aMprwAKC8gacKtSJAoIBx1rCj26mK6uR2BiR2XI8%2FJ6GPs5V8%3D; fsr.s={"v2":-2,"v1":1,"rid":"de358f9-93450802-14e6-b09c-c587a","cp":{"Unified_StubHub":"N","TLSessionID":"0F845EB2186A1018E064E9864F24E57F"},"to":3,"c":"http://www.stubhub.com/disclosure-tickets-disclosure-san-francisco-bill-graham-civic-auditorium-5-20-2016/event/9514727/","pv":2,"lc":{"d3":{"v":2,"s":false}},"cd":3,"f":1463075478573}; mbox=session#1463075449033-606266#1463077339|PC#1463075449033-606266.28_14#1497289881; session:loginStatus=0; session:sessionId=4E61ACB8B64D4DFE9A1F60B22EF55F9D; session:userGUID=DBD1434615DC6AFAE0440021286899D6; track_session_userGUID=DBD1434615DC6AFAE0440021286899D6; session_uAuthenticated=1; session:CSRFtoken=RpM3EEbK7Z775mXFRCoSodyln2Vjrob8v5g5FmG2KblWM8X4TutfQ91p2Z5g3neaj2V4VmaPCz+HcJ2rB1S2XWfz7CO0tkwtHobk2CRAe44=; S_ACCT=stubhub; SH_VI=6827618f156b45b19c6955dd26073173; s_pers=%20s_dfa%3Dstubhub%7C1463077278871%3B%20s_vs%3D1%7C1463077288618%3B%20s_nr%3D1463075488622-New%7C1497203488622%3B; s_sess=%20s_cpc%3D0%3B%20s_cc%3Dtrue%3B%20s_sq%3D%3B; TLTHID=275CB4C6186A1018AAA9DF5E837AFFA5; SH_UT=XH8PvpzBWtVx5oE8LlaVrVsYo3JCS5jdlZr40qYvCLk6TQo0Mtgy7JKLeqYsgP7k6NUsL%2BAZFdgH8toxhHTlIfzYAJUC4%2FNEHWCGhfzHWoML6KkW1sJvqSLk9DonafYPkDNyBnUHEuy79KqeLxzMba7Mg3vHe9XepypnoMek0%2Bnl6zjyGMMgiBc1Y8Ylam1bCHk53z1TmDreN66LY57O8FEghoVlWGsPeNnHUQ5eTrX97%2FvbTXji203X1JI1N7o7
Origin  https://www.stubhub.com
Accept-Encoding gzip, deflate
x-csrf-token    RpM3EEbK7Z775mXFRCoSodyln2Vjrob8v5g5FmG2KblWM8X4TutfQ91p2Z5g3neaj2V4VmaPCz+HcJ2rB1S2XWfz7CO0tkwtHobk2CRAe44=
Host    www.stubhub.com
Accept-Language en-us
User-Agent  Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36
TARGET_HOST stubhub
Content-Type    application/json
Accept  application/json
Referer https://www.stubhub.com/buy/review?ticket_id=1197882103&quantity_selected=1&event_id=9514727
X-Requested-With    XMLHttpRequest
Connection  keep-alive
Content-Length  124
***/

var defHeaders = {
    "Cookie":           'TLTSID=0F845EB2186A1018E064E9864F24E57F; DC=lvs01; akavpau_ddos_us_domain=1463075748~id=4bd752c2caff06ba883161fec19b7f6f; AMCV_1AEC46735278551A0A490D45%40AdobeOrg=1304406280%7CMCIDTS%7C16934%7CMCMID%7C15941329986180209663013202697581476536%7CMCAAMLH-1463680249%7C9%7CMCAAMB-1463680249%7CNRX38WO0n5BH8Th-nqAG_A%7CMCAID%7CNONE; _br_uid_2=uid%3D9886621714643%3Av%3D11.8%3Ats%3D1463075449878%3Ahc%3D1; __uvt=; xdVisitorId=12F1Yo_4j-Pz_2smN4keSZ39To1MDinmag1UcstmsDeosoQ19BD; __gads=ID=c776f7c09577c56d:T=1463075451:S=ALNI_MbLOZzJFWOceNmrbJ69E3O6ATBHug; atgRecVisitorId=12F1Yo_4j-Pz_2smN4keSZ39To1MDinmag1UcstmsDeosoQ19BD; atgRecSessionId=4XmmF7FgFaxFPDyW3eBRjeH8wvuM9xosIh7dzYS_-s5BM85YAO6I!2033468134!564941919; uvts=4X7Sjvj77E4fw48n; SH_AT=1XNOHCPxzhOmYfQsadRFfX%2FOMRCZ0KKzhzQg%2BzAtaxxW5pfv1Rx11KOIF7aMprwAKC8gacKtSJAoIBx1rCj26mK6uR2BiR2XI8%2FJ6GPs5V8%3D; fsr.s={"v2":-2,"v1":1,"rid":"de358f9-93450802-14e6-b09c-c587a","cp":{"Unified_StubHub":"N","TLSessionID":"0F845EB2186A1018E064E9864F24E57F"},"to":3,"c":"http://www.stubhub.com/disclosure-tickets-disclosure-san-francisco-bill-graham-civic-auditorium-5-20-2016/event/9514727/","pv":2,"lc":{"d3":{"v":2,"s":false}},"cd":3,"f":1463075478573}; mbox=session#1463075449033-606266#1463077339|PC#1463075449033-606266.28_14#1497289881; session:loginStatus=0; session:sessionId=4E61ACB8B64D4DFE9A1F60B22EF55F9D; session:userGUID=DBD1434615DC6AFAE0440021286899D6; track_session_userGUID=DBD1434615DC6AFAE0440021286899D6; session_uAuthenticated=1; session:CSRFtoken=RpM3EEbK7Z775mXFRCoSodyln2Vjrob8v5g5FmG2KblWM8X4TutfQ91p2Z5g3neaj2V4VmaPCz+HcJ2rB1S2XWfz7CO0tkwtHobk2CRAe44=; S_ACCT=stubhub; SH_VI=6827618f156b45b19c6955dd26073173; s_pers=%20s_dfa%3Dstubhub%7C1463077278871%3B%20s_vs%3D1%7C1463077288618%3B%20s_nr%3D1463075488622-New%7C1497203488622%3B; s_sess=%20s_cpc%3D0%3B%20s_cc%3Dtrue%3B%20s_sq%3D%3B; TLTHID=275CB4C6186A1018AAA9DF5E837AFFA5; SH_UT=XH8PvpzBWtVx5oE8LlaVrVsYo3JCS5jdlZr40qYvCLk6TQo0Mtgy7JKLeqYsgP7k6NUsL%2BAZFdgH8toxhHTlIfzYAJUC4%2FNEHWCGhfzHWoML6KkW1sJvqSLk9DonafYPkDNyBnUHEuy79KqeLxzMba7Mg3vHe9XepypnoMek0%2Bnl6zjyGMMgiBc1Y8Ylam1bCHk53z1TmDreN66LY57O8FEghoVlWGsPeNnHUQ5eTrX97%2FvbTXji203X1JI1N7o7',
    "x-csrf-token":     'RpM3EEbK7Z775mXFRCoSodyln2Vjrob8v5g5FmG2KblWM8X4TutfQ91p2Z5g3neaj2V4VmaPCz+HcJ2rB1S2XWfz7CO0tkwtHobk2CRAe44=',
    "Origin":           URL_BASE,
    "Accept-Encoding": "gzip, deflate",
    "Host":             "www.stubhub.com",
    "Accept-Language":  "en-us",
    "User-Agent":       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36",
    "TARGET_HOST":      "stubhub",
    "Content-Type":     "application/json",
    "Accept":           "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Connection":       "keep-alive"
};

function shRequest(method, url, headers, body, callback) {

    var options = {
        method: method,
        url: url,
        headers: defHeaders,    //tbd: concat headers if any
        json: true,
        gzip: true,
        body: body
    };
    
    request(options, function reqCallback(error, res, body) {
        if (error || res.statusCode != 200) {
            error = error || new Error(body.description);
            error.statusCode    = res && res.statusCode;
            error.statusMessage = res && res.statusMessage;
            error.code = body && body.code;
            error.data = body;
            return callback(error);
        }
        return callback(error, body);
    });
}


//  https://www.slcq011.com//?eventId=9436014&sectionStats=true&zoneStats=true&start=0&allSectionZoneStats=true&pricingSummary=true&rows=20&sort=listingPrice%2Basc%2Cvalue%2Bdesc&priceType=listingPrice&valuePercentage=true
//  https://www.stubhub.com/shape/inventory/listings/v2/1196885705
//  https://www.stubhub.com/shape/catalog/events/v3/9519081/?mode=internal

//  https://www.stubhub.com/shape/inventory/listings/v2/1196433434
//  https://www.stubhub.com/shape/purchase/carts/v2/
//  in=> {
//          "cart": {
//              "items": [{
//                  "listingId": "1196433434",
//                  "quantity": "1",
//                  "buyerSourceAppId": null
//              }],
//              "orderSourceId": 7,
//              "deleteIfExist": "Y"
//          }
//      }
// out=> {
//          "cart": {
//              "id": "5jT7GzGHmHGHbdX2"
//          }
//      }
//  https://www.stubhub.com/shape/purchase/carts/v2/5jT7GzGHmHGHbdX2?detail=long&_=1462487903459

