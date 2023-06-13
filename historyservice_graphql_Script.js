import http from "k6/http";
import { check, sleep } from "k6";
import {getConfig} from "./config.js";
import { Rate } from "k6/metrics";

var env = `${__ENV.env}`;
var myFailRate = new Rate("failed requests");
var config = getConfig(env);
var graphqlEndpoint = config.Graphql_History_Url;
let accessToken = "";
export let options = {
  insecureSkipTLSVerify: true,
  rps: 200,
  duration: "1h",
  vus: 100,
  thresholds: {
    "failed requests": ["rate<0.1"]
   }
};
export default function() {
let query = `
query{
  findNotificationHistoryByCustomer(phoneNumber: "7777777777",accountNumber:"777777777", deliveryMethod: SMS, publisherName:"GlobalNavigation", startTime:"2020-07-10T00:18:19", endTime:"2020-07-20T00:18:19", orderBy:{time:ASC}){
     notificationHistory {
       trigger {
         id
         time
      }
       notifications {
         retryInfo {
           maxRetry
           retryCount
           retryInterval
         }
         isTemplateManaged
         triggerId
         optional {
           alertType
           suppressionList {
             name
             value
           }
           priority
           ttl
         }
         isBatch
         deliveryMethod
         templateId
         message {
           language
           text
         }
         name
         containers {
           name
           attributesList {
             attributes {
               name
               value
             }
           }
         }
         id
         time
         category
         externalId
         reportingId
         recipientInfo {
           communicationLanguage
           communicationAddress
           roles {
             name
           }
         }
         status
         childStatus {
           status
           time
         }
         statusInfo {
           code
           userMessage
           systemMessage
         }
       }
     }
     pagination {
       pageNumber
       totalRecordCount
       totalPages
       currentPageItems
       pageSize
     }
   }
 }
`;

let headers = {
  'Authorization': `Bearer ${accessToken}`,
 "Content-Type": "application/json"
};

let res = http.post(graphqlEndpoint,
 JSON.stringify({ query: query }),
 {headers: headers}

);
myFailRate.add(res.status !== 200);

}
