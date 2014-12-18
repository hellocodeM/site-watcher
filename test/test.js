var watcher = require("../src")
var sites = ["http://wanghuanming.com", "http://coolshell.cn", "http://ruanyifeng.com"]


watcher.watch(sites, function(site) {
	console.log("updated:\t" + site);
});
