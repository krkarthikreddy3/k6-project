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
//console.log(config.RabbitMq_url);
var NepRabbitMqUrl = config.Nep_RabbitMq_Url;
var Auth = config.AuthToken;


export let options = {
    insecureSkipTLSVerify: true,
    rps: 100,
    duration: "1h",
    vus: 100,
    thresholds: {
      "failed requests": ["rate<0.1"]
     }
  };

  export default function() {

    var eventid = uuid.v4();
    var transactionid = uuid.v4();
    var params = {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": Auth,
        },
      };

    var payload = getRequestbody().nepOrderDeliveredRabbitMq.replace(/_eventid_/gi, eventid).replace(/_transactionId_/gi, transactionid);
    //console.log(payload);
    let publishToRabbitMqSms = http.post(NepRabbitMqUrl, payload, params);
    //console.log(publishToRabbitMqSms.body);
    //console.log(publishToRabbitMqSms.status);
    
    myFailRate.add(publishToRabbitMqSms.status != 200);
    check(publishToRabbitMqSms, {
     "status was 200": (r) => r.status == 200
     });
    

  }
