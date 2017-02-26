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

app.get('/greet', function(req, res) {

    //Change the values of the variables below based on your environment 
    var peerUrl = "grpcs://fc2e4f4976224e24a79cef332f5ea6b4-ca.us.blockchain.ibm.com:30004";
    var chaincodeID = "011b034a4820c80db68e6b3a2ed55a629fd49455aacdb0b64868523a37da742a503939bc77b79aa891daa31dbde2ac9ca09f9d9db2d3787ce391671a24af6151";
    var userName = "user_type1_2";
    var password = "60bbaf1189";

    var Client = require('node-rest-client').Client;
    var client = new Client();
 
    // set content-type header and data as json in args parameter 
    var args = {
        data: {
            "enrollId": userName,
            "enrollSecret": password
        },
        headers: {
            "Content-Type": "application/json"
        }
    };

    client.post(peerUrl + "/registrar", args, function(data, response) {
        // parsed response body as js object 
        console.log(data);

    });

    // read currently stored greeting
    args = {
        data: '{"jsonrpc": "2.0", "method\": "query", "params": { "type": 1, "chaincodeID": { "name": "' + chaincodeID + '" }, "ctorMsg": {"function": "read", "args": ["hello_world"]}, "secureContext": "' + userName + '"}, "id": 1}',
        headers: {
            "Content-Type": "application/json"
        }
    };

    client.post(peerUrl + "/chaincode", args, function(data, response) {
        // parsed response body as js object 
        console.log(data);
        var jsonContent = JSON.parse(JSON.stringify(data));
        var jsonMessage = JSON.parse(JSON.stringify(jsonContent.result));
        console.log("Message:", jsonMessage.message);
        res.render('read', {
            key: jsonMessage.message
        });
    });
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});
