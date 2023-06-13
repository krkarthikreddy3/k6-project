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
var rabbitMQUrl = config.RabbitMq_url;
var Auth = config.AuthToken;
var params = {
  headers: {
    "Authorization": Auth
  }
};

export let options = {
  insecureSkipTLSVerify: true,
  rps: 100,
  duration: "1h",
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
      
      let createTrigger_response = http.post(rabbitMQUrl, CreateTrigger, params);
     // console.log(createTriggersms_response.status);
     // console.log(createTriggersms_response.body);
      myFailRate.add(createTrigger_response.status != 200);
      check(createTrigger_response, {
        "status was 200": (r) => r.status == 200
      });
      //console.log("SentTrigger"+SentTrigger);
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
    
    });

    // group("trigger email_alert", function () {

    //   var CreateTriggeer_EmailBody = getRequestbody().createTrigger;
    //   var SentTrigger_email_alert_body = getRequestbody().sentTrigger_Email_Alert;
    //   var SentNotification_email = getRequestbody().sentNotification_Email;
    //   var SentNotification_alert = getRequestbody().sentNotification_Alert;
    //   var eventid = uuid.v4();
    //   var triggerid = uuid.v4();
    //   var notificationid2 = uuid.v4();
    //   var notificationid1 = uuid.v4();
    //   var CreateTriggeer = CreateTriggeer_EmailBody.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid);
    //   var SentTrigger = SentTrigger_email_alert_body.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid2_/gi,notificationid2).replace(/_notificationid1_/gi,notificationid1);
    //   var SentNotification_email = SentNotification_email.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid2_/gi,notificationid2).replace(/_notificationid1_/gi,notificationid1);
    //   var SentNotification_alert =SentNotification_alert.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid2_/gi,notificationid2).replace(/_notificationid1_/gi,notificationid1);
    //   //console.log(rabbitMQUrl);
    //   //console.log("createemail"+CreateTriggeer_EmailBody);
    //   // console.log("createTrigger"+CreateTriggeer);
    //   // console.log("senttriggersmsemail"+SentTrigger);
    //   // console.log("sentnotifsms"+SentNotification_email);
    //   // console.log("sentnotifemail"+SentNotification_alert);
      
    //   let createTrigger_response = http.post(rabbitMQUrl, CreateTriggeer, params);
    //   //console.log(createTriggeremail_response.status);
    //   //console.log(createTriggeremail_response.body);
    //   myFailRate.add(createTrigger_response.status != 200);
    //   check(createTrigger_response, {
    //     "status was 200": (r) => r.status == 200
    //   });
    //   //console.log("updateemail"+UpdateTrigger_EmailBody);
    //   let sentTrigger_response = http.post(rabbitMQUrl, SentTrigger, params);
    //   //console.log(updateTriggeremail_response.body);
    //   myFailRate.add(sentTrigger_response.status != 200);
    //   check(sentTrigger_response, {
    //     "status was 200": (r) => r.status == 200
    //   });

    //   let SentNotification_alert_response = http.post(rabbitMQUrl, SentNotification_alert, params);
    //   //console.log(updateTriggersms_response.body);
    //   myFailRate.add(SentNotification_alert_response.status != 200);
    //   check(SentNotification_alert_response, {
    //     "status was 200": (r) => r.status == 200
    //   });

    //   let SentNotification_email_response = http.post(rabbitMQUrl, SentNotification_email, params);
    //   //console.log(updateTriggersms_response.body);
    //   myFailRate.add(SentNotification_email_response.status != 200);
    //   check(SentNotification_email_response, {
    //     "status was 200": (r) => r.status == 200
    //   });


    // });

    // group("trigger alert_sms", function () {

    //   var CreateTrigger_AlertBody = getRequestbody().createTrigger;
    //   var SentTrigger_alert_smsBody = getRequestbody().sentTrigger_Alert_sms
    //   var SentNotification_alert = getRequestbody().sentNotification_Alert;
    //   var SentNotification_sms = getRequestbody().sentNotification_sms;
    //   var eventid = uuid.v4();
    //   var triggerid = uuid.v4();
    //   var notificationid2 = uuid.v4();
    //   var notificationid = uuid.v4();
    //   var CreateTrigger = CreateTrigger_AlertBody.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid);
    //   var SentTrigger = SentTrigger_alert_smsBody.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid2_/gi,notificationid2);
    //   var SentNotification_alert =SentNotification_alert.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid2_/gi,notificationid2);
    //   var SentNotification_sms = SentNotification_sms.replace(/_eventid_/gi, eventid).replace(/_triggerid_/gi, triggerid).replace(/_notificationid_/gi,notificationid).replace(/_notificationid2_/gi,notificationid2);
    //   //console.log(rabbitMQUrl);
    //   //console.log("createalert"+CreateTrigger_AlertBody);
    //   // console.log("createTrigger"+CreateTrigger);
    //   // console.log("senttriggersmsemail"+SentTrigger);
    //   // console.log("sentnotifsms"+SentNotification_sms);
    //   // console.log("sentnotifemail"+SentNotification_alert);
     
    //   let createTrigger_response = http.post(rabbitMQUrl, CreateTrigger, params);
    //   //console.log(createTriggeralert_response.status);
    //   //console.log(createTrigger_response.body);
    //   myFailRate.add(createTrigger_response.status != 200);
    //   check(createTrigger_response, {
    //     "status was 200": (r) => r.status == 200
    //   });
    //   //console.log("updatealert"+UpdateTrigger_AlertBody);
    //   let SentTrigger_response = http.post(rabbitMQUrl, SentTrigger, params);
    //   //console.log(updateTriggeralert_response.body);
    //   myFailRate.add(SentTrigger_response.status != 200);
    //   check(SentTrigger_response, {
    //     "status was 200": (r) => r.status == 200
    //   });

    //   let SentNotification_alert_response = http.post(rabbitMQUrl, SentNotification_alert, params);
    //   //console.log(updateTriggersms_response.body);
    //   myFailRate.add(SentNotification_alert_response.status != 200);
    //   check(SentNotification_alert_response, {
    //     "status was 200": (r) => r.status == 200
    //   });

    //   let SentNotification_sms_response = http.post(rabbitMQUrl, SentNotification_sms, params);
    //   //console.log(updateTriggersms_response.body);
    //   myFailRate.add(SentNotification_sms_response.status != 200);
    //   check(SentNotification_sms_response, {
    //     "status was 200": (r) => r.status == 200
    //   });

    // });
    
  });
  

}
