const PORT = (process.env.PORT || 3000)
		, VIEWS = __dirname + '/views'
		, PUBLIC = __dirname + '/public'
		, STYLUS = __dirname + '/stylus'
		, MANIFEST = __dirname + '/firefox_os/manifest.webapp'
		, MAXAGE = {maxAge: 60 * 60 * 1000}
		, GZIP = {level: 9, memLevel: 9}

var express = require('express')
	, site = require('./config.json')
	, fs = require('fs')
	, cron = require('./lib/cron_task')()
	, wms = require('./lib/web_modules_scrap')()
	, app = module.exports = express()
;

wms.update();

app.use(express.logger());
app.set('views', VIEWS);
app.set('view engine', 'ejs');
app.use(app.router);
app.use(express.compress(GZIP));
app.use(express.static(PUBLIC, MAXAGE));

app.get('/', function(req, res) {
	var domain = (req.protocol+'://'+req.host);
	wms.get(function(modules) {
		var params = {site: site
								, modules: modules
								, domain: domain};
		return res.render('application', params);
	});
});

app.listen(PORT, function() {
	console.log('Node web module running on port %d', PORT);
});