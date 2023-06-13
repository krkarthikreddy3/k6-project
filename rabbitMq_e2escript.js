import http from "k6/http";
import {group,check,sleep} from "k6";
import {getConfig} from "./config.js";
import {getRequestbody} from "./RequestBody.js";
import { Rate} from "k6/metrics";
import uuid from "./uuid.js"


var env = `${__ENV.env}`;
var myFailRate = new Rate("failed requests");
var config = getConfig(env);
var rabbitMQUrl = config.RabbitMq_url;
var Auth = config.AuthToken;
var Host = config.History_host;

export let options = {
  insecureSkipTLSVerify: true,
  rps: 200,
  duration: "5m",
  vus: 10,
  thresholds: {
    "failed requests": ["rate<0.1"]
   }
};


export default function () {

  group("Rabbitmq testing", function () {

    group("trigger sms_email", function () {

      var CreateTrigger = getRequestbody().createTrigger;
      var SentTrigger_sms_emailbody = getRequestbody().sentTrigger_sms_Email;
      var SentNotification_sms = getRequestbody().sentNotification_sms;
      var SentNotification_email = getRequestbody().sentNotification_Email;
      var eventid = uuid.v4();
      var triggerid = uuid.v4();
      var notificationid = uuid.v4();
      var notificationid1 = uuid.v4();
      var CreateTrigger = CreateTrigger.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid);
      var SentTrigger = SentTrigger_sms_emailbody.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid1_/gi,notificationid1);
      var SentNotification_sms = SentNotification_sms.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid1_/gi,notificationid1);
      var SentNotification_email = SentNotification_email.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid1_/gi,notificationid1);
      //console.log(rabbitMQUrl);
      // console.log("createTrigger"+CreateTrigger);
      // console.log("senttriggersmsemail"+SentTrigger);
      // console.log("sentnotifsms"+SentNotification_sms);
      // console.log("sentnotifemail"+SentNotification_email);
      var params = {
        headers: {
          "Authorization": Auth
        }
      }
      let createTrigger_response = http.post(rabbitMQUrl, CreateTrigger, params);
     // console.log(createTriggersms_response.status);
     // console.log(createTriggersms_response.body);
      myFailRate.add(createTrigger_response.status != 200);
      check(createTrigger_response, {
        "status was 200": (r) => r.status == 200
      });
      //console.log("updatesms"+UpdateTrigger_smsbody);
      let SentTrigger_response = http.post(rabbitMQUrl, SentTrigger, params);
      //console.log(updateTriggersms_response.body);
      myFailRate.add(SentTrigger_response.status != 200);
      check(SentTrigger_response, {
        "status was 200": (r) => r.status == 200
      });

      let SentNotification_sms_response = http.post(rabbitMQUrl, SentNotification_sms, params);
      //console.log(updateTriggersms_response.body);
      myFailRate.add(SentNotification_sms_response.status != 200);
      check(SentNotification_sms_response, {
        "status was 200": (r) => r.status == 200
      });

      let SentNotification_email_response = http.post(rabbitMQUrl, SentNotification_email, params);
      //console.log(updateTriggersms_response.body);
      myFailRate.add(SentNotification_email_response.status != 200);
      check(SentNotification_email_response, {
        "status was 200": (r) => r.status == 200
      });
      sleep(10);
      let GetHistory_response = http.get('https://'+Host+'/dnd/v1/notification?keys='+eventid);
      //console.log(GetHistory_response.body);
      myFailRate.add(GetHistory_response.status != 200);
      myFailRate.add(GetHistory_response.body == '{"notification":[]}');
      check(GetHistory_response, {
        "status was 200": (r) => r.status == 200,
        "non empty response" :(r) => r.body !== '{"notification":[]}'
      });
      if(GetHistory_response.body == '{"notification":[]}'){

        console.log(eventid);
      }
    
    });

    
    
  });
  

}