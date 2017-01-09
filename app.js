/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/read', function (req, res) {

var Client = require('node-rest-client').Client;
 
var client = new Client();

var peerUrl = "https://91c71dcf486f440f9b95b3c4d9960b7b-vp0.us.blockchain.ibm.com:5002";
var chaincodeID = "8c9bbcd86318c2b1de225849cf5f0cef96a7f05a58fec7c7f403a83e8c9445e3fbc4ed6bb544e18ad501cf2336eefde764c90be093cf34b0879713c48de4bd00";
 
// set content-type header and data as json in args parameter 
var args = {
    data: {"enrollId": "user_type1_2","enrollSecret": "0bbc82932d"},
    headers: { "Content-Type": "application/json" }
};
 
client.post(peerUrl+"/registrar", args, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    
});

// read currently stored greeting
args = {
    data: '{"jsonrpc": "2.0", "method\": "query", "params": { "type": 1, "chaincodeID": { "name": "'+chaincodeID+'" }, "ctorMsg": {"function": "read", "args": ["hello_world"]}, "secureContext": "user_type1_2"}, "id": 1}',
    headers: { "Content-Type": "application/json" }
};
 
client.post(peerUrl+"/chaincode", args, function (data, response) {
    // parsed response body as js object 
    console.log(data);
    var jsonContent = JSON.parse(JSON.stringify(data));
    var jsonMessage = JSON.parse(JSON.stringify(jsonContent.result));
    console.log("Message:", jsonMessage.message);
   res.render('read', { key: jsonMessage.message });
});  
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
