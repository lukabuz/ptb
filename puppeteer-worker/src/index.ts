import { execute } from "./puppet";
import randomUseragent from "random-useragent";
import { Job, Navigation } from "./types/types";

let proxies = [
  "182.54.239.149:8166",
  "182.54.239.214:8231",
  "182.54.239.138:8155",
  "182.54.239.216:8233",
  "182.54.239.84:8101",
  "182.54.239.54:8071",
  "182.54.239.185:8202",
  "182.54.239.27:8044",
  "182.54.239.98:8115",
  "182.54.239.159:8176",
  "182.54.239.151:8168",
  "182.54.239.64:8081",
  "182.54.239.63:8080",
  "182.54.239.92:8109",
  "182.54.239.140:8157",
  "182.54.239.122:8139",
  "182.54.239.165:8182",
  "182.54.239.175:8192",
  "182.54.239.125:8142",
  "182.54.239.97:8114",
  "104.144.99.95:7128",
  "192.186.172.2:9002",
  "192.241.116.113:8667",
  "192.241.94.50:7605",
  "198.20.191.234:7290",
  "185.245.26.150:6667",
  "104.227.222.65:9129",
  "104.227.223.209:8296",
  "23.236.255.82:7133",
  "154.13.71.151:6547",
  "107.152.165.210:7729",
  "23.229.101.245:8769",
  "154.21.39.201:6039",
  "45.158.184.186:9262",
  "144.168.220.171:8217",
  "104.227.223.218:8305",
  "45.57.253.33:7570",
  "104.227.76.149:6246",
  "23.229.122.120:8148",
  "23.229.110.160:8688",
  "185.102.51.106:7445",
  "45.152.208.229:8260",
  "45.152.208.63:8094",
  "45.152.208.175:8206",
  "193.8.94.82:9127",
  "45.137.195.76:6091",
  "185.102.51.197:7536",
  "45.8.134.209:7225",
  "91.246.193.54:6311",
  "154.85.100.23:5064",
  "193.27.10.125:6210",
  "185.102.51.172:7511",
  "185.102.48.211:6293",
  "91.246.193.79:6336",
  "45.8.134.116:7132",
  "193.8.94.108:9153",
  "193.8.94.187:9232",
  "185.102.50.85:7168",
  "45.8.134.218:7234",
  "154.85.100.208:5249",
  "192.198.126.151:7194",
  "138.128.59.238:9167",
  "5.154.253.94:8352",
  "192.198.126.31:7074",
  "192.198.126.150:7193",
  "154.95.32.206:5259",
  "5.154.253.207:8465",
  "5.154.253.141:8399",
  "138.128.59.147:9076",
  "192.198.126.161:7204",
  "192.198.126.99:7142",
  "5.154.253.214:8472",
  "192.198.126.24:7067",
  "154.95.32.70:5123",
  "192.198.126.21:7064",
  "154.95.32.119:5172",
  "154.95.32.112:5165",
  "154.95.32.38:5091",
  "192.198.126.242:7285",
  "154.95.32.159:5212",
  "138.128.59.217:9146",
  "192.198.126.75:7118",
  "5.154.253.185:8443",
  "192.198.126.131:7174",
  "192.198.126.120:7163",
  "192.198.126.111:7154",
  "5.154.253.29:8287",
  "192.198.126.90:7133",
  "45.86.15.151:8698",
  "154.95.32.237:5290",
  "154.95.32.227:5280",
  "154.95.32.101:5154",
  "192.198.126.104:7147",
  "5.154.253.61:8319",
  "45.86.15.70:8617",
  "192.198.126.22:7065",
  "5.154.253.195:8453",
  "192.198.126.116:7159",
  "154.95.32.29:5082",
  "192.198.126.132:7175",
];

let navArray: Navigation[] = [];

let referrers = [
  "https://google.com",
  "https://facebook.com",
  "https://instagram.com",
  "https://twitter.com",
  "https://linkedin.com",
];

for (let index = 0; index < 100; index++) {
  navArray.push({
    timeToWait: 2000,
    referer: referrers[Math.floor(Math.random() * referrers.length)],
    destination: "https://cutt.ly/wE8m4NT",
    userAgent: randomUseragent.getRandom(),
    // successCheck: {
    //   selector: "#root > div > h1",
    //   property: "innerHTML",
    //   expectedValue: "ბოდიში",
    // },
  });
}

for (let i = 0; i < 10; i++) {
  const element = proxies[i];
  execute({
    agent: {
      proxyUrl: element,
      proxyUsername: "cvernrbx",
      proxyPassword: "ry8orkmntaqc",
    },
    navigations: navArray,
  });
}

// execute({
//   agent: {
//     proxyUrl: "193.27.10.125:6210",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "185.102.51.172:7511",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "185.102.48.211:6293",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "91.246.193.79:6336",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "45.8.134.116:7132",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "193.8.94.108:9153",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "193.8.94.187:9232",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "185.102.50.85:7168",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "45.8.134.218:7234",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "154.85.100.208:5249",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
// execute({
//   agent: {
//     proxyUrl: "192.198.126.151:7194",
//     proxyUsername: "cvernrbx",
//     proxyPassword: "ry8orkmntaqc",
//   },
//   navigations: navArray,
// });
