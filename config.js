export function getConfig(env) {   
 
 
    var variables = { 
        History_event_id: "",
        History_host:"",
        RabbitMq_url:"",
        AuthToken:"",
        DeepUrl: "",
        DeepUrl_NRT: "",
        DeepUrl_RT: "",
        DeepUrl_Bulk: "",
        Graphql_History_Url: "",
        Sms_RabbitMq_Url: "",
      
    };
   if (env.toLowerCase().includes("plab01".toLowerCase())){
        variables.History_event_id = '';
        variables.History_host = '';
        variables.RabbitMq_url = '';  
        variables.AuthToken = 'Basic ';
        variables.DeepUrl = '';
        variables.DeepUrl_NRT = '';
        variables.DeepUrl_RT = '';
        variables.DeepUrl_Bulk = '';
        variables.Graphql_History_Url = '';
        variables.Sms_RabbitMq_Url = '';
        variables.Nep_RabbitMq_Url = '';
    }
    

   
  return variables;
}
export function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
