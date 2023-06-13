import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";
import {getConfig} from "./config.js";

var env = `${__ENV.env}`;
//console.log(env);
var myFailRate = new Rate("failed requests");
var config = getConfig(env);
var Event_id = config.event_id;
var Host = config.History_host;
//console.log(config.event_id);
export let options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: "1m", target: 50 },
    { duration: "15m", target: 50 },
    { duration: "15m", target: 100},
    { duration: "15m", target: 75 },
    { duration: "15m", target: 50 },
  ],
  thresholds: {
   "failed requests": ["rate<0.1"]
  }
};
// export let options = {
//   insecureSkipTLSVerify: true,
//   rps: 100,
//   duration: "1m",
//   vus: 100,
//   thresholds: {
//     "failed requests": ["rate<0.1"]
//    }
// };
export default function() {
 // let response = http.get('https://'+Host+'/dnd/v2/notification?keys=3281b8af-23a7-43e3-9062-fb94cce664da2');
 // console.log(response.body);
   let responses = http.batch([
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=e3f424e1-4e18-40cc-9e5d-74849dc7671f'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=d4b6b21c-0d55-4e5d-b419-81340761cc05'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=e0db7173-f764-47e0-81b0-84ff4731aefd'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=7b2b5dfa-fa9e-457b-9484-4927e09a14db'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=21fc41e7-bb7f-463e-9ffe-94284fa0f1e4'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=a8e439ac-dbc2-48b2-a65b-b213d9a3404e'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=d7e4b649-63cd-4c2d-9223-cc7fdbb32b6a'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=ea352620-18d9-4c19-9202-552ebbce0e0e'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=496021601'],
    ["GET", 'https://'+Host+'/dnd/v2/notification?keys=496021602'],
    ["GET", 'https://'+Host+'/dnd/v2/notificationdetails?communicationAddress=4960216901&externalId=901'],
    ["GET", 'https://'+Host+'/dnd/v2/notificationdetails?communicationAddress=4960216902&externalId=902'],
    ["GET", 'https://'+Host+'/dnd/v2/notificationdetails?communicationAddress=4960216903&externalId=903'],
    ["GET", 'https://'+Host+'/dnd/v2/notificationdetails?communicationAddress=4960216904&externalId=904'],
    ["GET", 'https://'+Host+'/dnd/v2/notificationdetails?communicationAddress=4960216905&externalId=905'],

  ]);
  var i;
  for (i = 0; i < responses.length; i++) {
    myFailRate.add(responses[i].status == 404);
  }
  // //console.log(responses[0].body);
  // console.log(responses[0].status);
	
	//  check(responses[0], {
  //  "status was 200": res => res.status === 200,
  //  "non empty response" :res => res.body !== '{"code":"404","userMessage":"Data not found","systemMessage":"No Data found for the Search Criteria"}'
  // }); 

  sleep(0);
}

