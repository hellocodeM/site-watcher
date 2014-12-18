var request = require('request');
var color = require('colors');

var sitesQueue = [];
var robotConfig = {
	interval : 10 * 1000,
	silent: false
};

function bootstrap(sites, options, cb) {
	// initialize configuration
	if (options.interval) robotConfig.interval = options.interval;
	if (options.silent) robotConfig.silent = options.silent;

	// push all urls into the sitesQueue
	var now = new Date();
	sites.forEach(function(url) { 
		sitesQueue.push(new Site(url, now));
	});

	// run the watcher
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
		site.headers['If-Modified-Since'] = res.headers['last-modified'] ||
											res.headers['Last-Modified'] || new Date().toString();
		var color = "";
		switch(res.statusCode) {
			case 200:
				color = "green"; break;
			case 304:
				color = "yellow"; break;
			default:
				color = "red";
		}

		if (!robotConfig.silent) 
			console.log(String(res.statusCode)[color], site.headers['If-Modified-Since'][color], site.url);
		if(!err && res.statusCode == 200) {
			cb(site.url);
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
