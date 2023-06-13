import http from "k6/http";
import {group,check,sleep} from "k6";
import {getConfig} from "./config.js";
import {getRequestbody} from "./RequestBody.js";
import { Rate} from "k6/metrics";
import uuid from "./uuid.js"


var env = `${__ENV.env}`;
//console.log(env);
var myFailRate = new Rate("failed requests");
var config = getConfig(env);
var deepurl = config.DeepUrl_Bulk;
//console.log(deepurl);

export let options = {
  insecureSkipTLSVerify: true,
  rps: 10,
  duration: "15m",
  vus: 10,
  thresholds: {
   "failed requests": ["rate<0.1"]
  }
};

export default function() {
  var eventid = uuid.v4();
  
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
    var payload = getRequestbody().DeepRequest_BULK.replace(/_eventid_/gi, eventid);
   //console.log(payload);
    let publishToDeep = http.post(deepurl, payload, params);
    //console.log(publishToDeep.body)
    
    myFailRate.add(publishToDeep.status != 200);
    check(publishToDeep, {
     "status was 200": (r) => r.status == 200
     });

}
