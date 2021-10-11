var https = require("http");
var fs = require("fs");

var qs = require("querystring");

var options = {
  method: "POST",
  hostname: "ptb-api.test",
  path: "/api/proxies",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie:
      "XSRF-TOKEN=eyJpdiI6IjVKM0Evc0JlWmM0dTg0MDlBeFU4amc9PSIsInZhbHVlIjoiQXMzRUIyaFRUNFcxNDJ5NmR0aUluTkdBVVFtK3RNMStjdFhyelpDL2gzaGNCbnM2ZnlLV2VyY2R6QlJVRkdRUWRCNlNpZFp6djdYeWo1UHQ0UVdnMTNQeEpIbyt5dWV5bUM1MGJzVlZURGNWaG9OOFhaYWtqWHNWeXBKNWtLSm4iLCJtYWMiOiJkNjZmYzMyOGYyZmFjMDNmOWViZGIyNGVlMTkwZjdlM2E4Yzg3Yjc1ZDc1ZDNhOThjNTU3NWE2YTE4MWE4OTZjIiwidGFnIjoiIn0%3D; ptb_api_session=eyJpdiI6ImRITk1lbUI0MFk3d2NmMWNRWGh6Q3c9PSIsInZhbHVlIjoiV3c0KzNlaS9DcitTamRaajhUWTNDeDJYT2pvLzFmMFNWdFEvTXd6V1JJdUliYlRXeUE0ZWw2d05jUk12UHNHbXlCdnlXNGdmTTZHU3JaZGtqRStzS0MvbkViMVJVUi9UNDFQcU5ZWnhTTFBJWWFoc2pXbEpUU0J1MFloUEJ6MWIiLCJtYWMiOiI0NDk3MzVkZTljN2JlOTkyYTljYjNiYmFhZTljZTQwNWZhNjQ1YTZlNDdjOThkNjRhYTc5ODRmMzIxMmY0MTU4IiwidGFnIjoiIn0%3D",
  },
  maxRedirects: 20,
};

let proxies = [
  { location: "Singapore", ip: "182.54.239.149", port: "8166" },
  { location: "Singapore", ip: "182.54.239.214", port: "8231" },
  { location: "Singapore", ip: "182.54.239.138", port: "8155" },
  { location: "Singapore", ip: "182.54.239.216", port: "8233" },
  { location: "Singapore", ip: "182.54.239.84", port: "8101" },
  { location: "Singapore", ip: "182.54.239.54", port: "8071" },
  { location: "Singapore", ip: "182.54.239.185", port: "8202" },
  { location: "Singapore", ip: "182.54.239.27", port: "8044" },
  { location: "Singapore", ip: "182.54.239.98", port: "8115" },
  { location: "Singapore", ip: "182.54.239.159", port: "8176" },
  { location: "Singapore", ip: "182.54.239.151", port: "8168" },
  { location: "Singapore", ip: "182.54.239.64", port: "8081" },
  { location: "Singapore", ip: "182.54.239.63", port: "8080" },
  { location: "Singapore", ip: "182.54.239.92", port: "8109" },
  { location: "Singapore", ip: "182.54.239.140", port: "8157" },
  { location: "Singapore", ip: "182.54.239.122", port: "8139" },
  { location: "Singapore", ip: "182.54.239.165", port: "8182" },
  { location: "Singapore", ip: "182.54.239.175", port: "8192" },
  { location: "Singapore", ip: "182.54.239.125", port: "8142" },
  { location: "Singapore", ip: "182.54.239.97", port: "8114" },
  { location: "United States", ip: "104.144.99.95", port: "7128" },
  { location: "United States", ip: "192.186.172.2", port: "9002" },
  { location: "United States", ip: "192.241.116.113", port: "8667" },
  { location: "United States", ip: "192.241.94.50", port: "7605" },
  { location: "United States", ip: "198.20.191.234", port: "7290" },
  { location: "United States", ip: "185.245.26.150", port: "6667" },
  { location: "United States", ip: "104.227.222.65", port: "9129" },
  { location: "United States", ip: "104.227.223.209", port: "8296" },
  { location: "United States", ip: "23.236.255.82", port: "7133" },
  { location: "United States", ip: "154.13.71.151", port: "6547" },
  { location: "United States", ip: "107.152.165.210", port: "7729" },
  { location: "United States", ip: "23.229.101.245", port: "8769" },
  { location: "United States", ip: "154.21.39.201", port: "6039" },
  { location: "United States", ip: "45.158.184.186", port: "9262" },
  { location: "United States", ip: "144.168.220.171", port: "8217" },
  { location: "United States", ip: "104.227.223.218", port: "8305" },
  { location: "United States", ip: "45.57.253.33", port: "7570" },
  { location: "United States", ip: "104.227.76.149", port: "6246" },
  { location: "United States", ip: "23.229.122.120", port: "8148" },
  { location: "United States", ip: "23.229.110.160", port: "8688" },
  { location: "Germany", ip: "185.102.51.106", port: "7445" },
  { location: "Germany", ip: "45.152.208.229", port: "8260" },
  { location: "Germany", ip: "45.152.208.63", port: "8094" },
  { location: "Germany", ip: "45.152.208.175", port: "8206" },
  { location: "Germany", ip: "193.8.94.82", port: "9127" },
  { location: "Germany", ip: "45.137.195.76", port: "6091" },
  { location: "Germany", ip: "185.102.51.197", port: "7536" },
  { location: "Germany", ip: "45.8.134.209", port: "7225" },
  { location: "Germany", ip: "91.246.193.54", port: "6311" },
  { location: "Germany", ip: "154.85.100.23", port: "5064" },
  { location: "Germany", ip: "193.27.10.125", port: "6210" },
  { location: "Germany", ip: "185.102.51.172", port: "7511" },
  { location: "Germany", ip: "185.102.48.211", port: "6293" },
  { location: "Germany", ip: "91.246.193.79", port: "6336" },
  { location: "Germany", ip: "45.8.134.116", port: "7132" },
  { location: "Germany", ip: "193.8.94.108", port: "9153" },
  { location: "Germany", ip: "193.8.94.187", port: "9232" },
  { location: "Germany", ip: "185.102.50.85", port: "7168" },
  { location: "Germany", ip: "45.8.134.218", port: "7234" },
  { location: "Germany", ip: "154.85.100.208", port: "5249" },
  { location: "Canada", ip: "192.198.126.151", port: "7194" },
  { location: "Canada", ip: "138.128.59.238", port: "9167" },
  { location: "Canada", ip: "5.154.253.94", port: "8352" },
  { location: "Canada", ip: "192.198.126.31", port: "7074" },
  { location: "Canada", ip: "192.198.126.150", port: "7193" },
  { location: "Canada", ip: "154.95.32.206", port: "5259" },
  { location: "Canada", ip: "5.154.253.207", port: "8465" },
  { location: "Canada", ip: "5.154.253.141", port: "8399" },
  { location: "Canada", ip: "138.128.59.147", port: "9076" },
  { location: "Canada", ip: "192.198.126.161", port: "7204" },
  { location: "Canada", ip: "192.198.126.99", port: "7142" },
  { location: "Canada", ip: "5.154.253.214", port: "8472" },
  { location: "Canada", ip: "192.198.126.24", port: "7067" },
  { location: "Canada", ip: "154.95.32.70", port: "5123" },
  { location: "Canada", ip: "192.198.126.21", port: "7064" },
  { location: "Canada", ip: "154.95.32.119", port: "5172" },
  { location: "Canada", ip: "154.95.32.112", port: "5165" },
  { location: "Canada", ip: "154.95.32.38", port: "5091" },
  { location: "Canada", ip: "192.198.126.242", port: "7285" },
  { location: "Canada", ip: "154.95.32.159", port: "5212" },
  { location: "Switzerland", ip: "138.128.59.217", port: "9146" },
  { location: "Switzerland", ip: "192.198.126.75", port: "7118" },
  { location: "Switzerland", ip: "5.154.253.185", port: "8443" },
  { location: "Switzerland", ip: "192.198.126.131", port: "7174" },
  { location: "Switzerland", ip: "192.198.126.120", port: "7163" },
  { location: "Switzerland", ip: "192.198.126.111", port: "7154" },
  { location: "Switzerland", ip: "5.154.253.29", port: "8287" },
  { location: "Switzerland", ip: "192.198.126.90", port: "7133" },
  { location: "Switzerland", ip: "45.86.15.151", port: "8698" },
  { location: "Switzerland", ip: "154.95.32.237", port: "5290" },
  { location: "Switzerland", ip: "154.95.32.227", port: "5280" },
  { location: "Switzerland", ip: "154.95.32.101", port: "5154" },
  { location: "Switzerland", ip: "192.198.126.104", port: "7147" },
  { location: "Switzerland", ip: "5.154.253.61", port: "8319" },
  { location: "Switzerland", ip: "45.86.15.70", port: "8617" },
  { location: "Switzerland", ip: "192.198.126.22", port: "7065" },
  { location: "Switzerland", ip: "5.154.253.195", port: "8453" },
  { location: "Switzerland", ip: "192.198.126.116", port: "7159" },
  { location: "Switzerland", ip: "154.95.32.29", port: "5082" },
  { location: "Switzerland", ip: "192.198.126.132", port: "7175" },
];

proxies.forEach((element) => {
  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function (chunk) {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });

  var postData = qs.stringify({
    provider: "webshare",
    location: element.location,
    type: "http",
    ip: element.ip,
    port: element.port,
    auth_type: "IP_WHITELIST",
  });

  req.write(postData);

  req.end();
});
