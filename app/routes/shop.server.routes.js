module.exports = function(app) {
    var shop = require('../controllers/shop.server.controller');
    app.get('/shop/:listingId', isValidRequest, shop.shop);
    app.get('/shop/buynow',     isValidRequest, shop.buynow);
    app.get('/shop/checkout',   isValidRequest, shop.checkout);
    app.get('/shop/hello',      isValidRequest, shop.hello);
};

function isValidRequest(req, res, next) {
    var config = require('../../config/config');
    var log4js = require('log4js');
    log4js.configure(config.log4jsConfig);
    var logger = log4js.getLogger();

    if (true /*req.headers.key === config.parse.apiKey*/) {
        next();
    } else {
        var msg = "forbidden request";

        logger.warn(msg);
        res.status(403).json({
            "type":    req.query.type,
            "status":  "error",
            "message": msg
        });
        return;
    }
}