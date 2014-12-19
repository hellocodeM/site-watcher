var watcher = require("../src")
var sites = ["http://wanghuanming.com", 
			"http://coolshell.cn", 
			"http://ruanyifeng.com",
			"http://baidu.com",
			"http://mail.163.com",
			"https://github.com",
			"http://hellocode.tk",
			"http://cn.bing.com",
			"http://news.163.com"];

var options = {
	silent: false,
	interval: 5 * 1000
}

watcher.watch(sites, options, function(url) {
	
});
