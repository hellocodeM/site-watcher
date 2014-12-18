var request = require("request");

var sitesQueue = [];
var robotConfig = {
	interval : 10 * 1000
};

function bootstrap(sites, options, cb) {
	var now = new Date();
	sites.forEach(function(url) { 
		sitesQueue.push(new Site(url, now));
	});
	run(sitesQueue, cb);
}


function run(queue, cb) {
	var interval = setInterval(function() {
		queue.forEach(function (site) {
			fetch(site, cb);
		});
	}, robotConfig.interval);
}

/**
 * @desc: query a site use head method, if status code is 200, invoke the callback.
 */

function fetch(site, cb) {
	request.head(site, function(err, res) {
		if(!err && res.statusCode == 200) {
			site.headers['If-Modified-Since'] = res.headers['last-modified'] ||
												res.headers['Last-Modified'] || "";
			console.log(res.statusCode, site.headers['If-Modified-Since'], site.url);
			cb(site.url);
		} else {
			console.log(res.statusCode + ":\t" + site.url);
		}
	});
}

/**
 * @desc: each Site object has a url and last modified time, to judge if the site has modified.
 */

function Site(url, lastModified) {
	this.url = url;
	this.headers = {
		'If-Modified-Since': lastModified
	};
}

exports.watch = function(sites, options, cb) {
	if (arguments.length == 3) {
		bootstrap(sites, options, cb);
	} else if (arguments.length == 2) {
		bootstrap(sites, {}, options);
	} else {
		bootstrap(sites, {}, function(){});
	}
}
