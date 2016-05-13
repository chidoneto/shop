var express = require('express'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

module.exports = function() {
	var app = express();

	if (process.env.NODE_ENV === 'development') {
		// DEV SETTING
	} else if (process.env.NODE_ENV === 'production') {
		// PROD SETTINGS
	} 
	
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	require('../app/routes/shop.server.routes.js')(app);
	return app;
};
