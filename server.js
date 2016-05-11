// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var Client = require('node-rest-client').Client;
// var cors = require('cors');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// app.use(cors());


// var port = process.env.PORT || 8080;        // set our port
var port = 9000;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var client = new Client({user: 'customer', password: 'customer'});

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});

//  register customer
app.post("/customers/registerCustomerAccount", function(req, res) {
    console.log(req.body);

    var args = {
        data: req.body,
        headers: { "Content-Type": "application/json" }
    };

    client.post('http://164.109.96.200:8080/agtech/v1/customers/registerCustomerAccount', args, function(data, response) {
        res.send(JSON.stringify(data));
    });
});

// register catalogs
app.post("/catalogs", function(req, res) {
    console.log(req.body);

    var args = {
        data: req.body,
        headers: { "Content-Type": "application/json" }
    };
    client.post('http://164.109.96.200:8080/agtech/v1/catalogs', args, function(data, response) {
        res.send(JSON.stringify(data));
    });
});


//GET CALLS
// service call to the customers get call
app.get('/customers', function (req, res, next) {
    client.get("http://164.109.96.200:8080/agtech/v1/customers?s=20", function (data, response) {
        // parsed response body as js object
        console.log(data);
        dateReceived(data);
        console.log(response.statusCode);
    });

    function dateReceived(data) {
        var outerData = data;
        console.log('outerData ' + outerData);
        res.json(outerData);
    }
});

// service call to the customers get call
app.get('/catalogs', function (req, res, next) {
    client.get("http://164.109.96.200:8080/agtech/v1/catalogs?s=20", function (data, response) {
        console.log(data);
        dateReceived(data);
    });

    function dateReceived(data) {
        var outerData = data;
        res.json(outerData);
    }
});

// service call to get all devices assigned to a particular vineyard
app.get('/customers/:customerId/entities', function(req, res, next){
    //console.log(:customerId);
    console.log(req.params.customerId);
    client.get("http://164.109.96.200:8080/agtech/v1/customers/" + req.params.customerId + "/entities?s=20",
        function (data, response) {
            dataReceivedVaraibleGet(data);
        });
        function dataReceivedVaraibleGet(data){
            var renderdata = data;
            res.json(renderdata);
        }
});

// service call to get a specific device(entityId) assigned to a particular vineyard(customerId)
app.get('/customers/:customerId/entities/:entityId', function(req, res, next){
    console.log(req.params.customerId);
    console.log(req.params.entityId);
                 // http://164.109.96.200:8080/agtech/v1/customers/hahnwinery123/entities/6ee72877-7f9b-4ef1-8255-80b0a5cdcb4f
        client.get("http://164.109.96.200:8080/agtech/v1/customers/" + req.params.customerId + "/entities/"+ req.params.entityId+ "?s=20",
        function (data, response) {
            getSpecificDeviceData(data);
        });
    function getSpecificDeviceData(data){
        var renderdata = data;
        res.json(renderdata);
    }

});


//POST CALLS
//  Create entity for pasrticular customer
app.post("/customers/:customerId/createEntity/:catalogId", function(req, res) {
    console.log(req.body);

    var args = {
        data: req.body,
        headers: { "Content-Type": "application/json" }
    };

    client.post("http://164.109.96.200:8080/agtech/v1/customers/"+ req.params.customerId +"/createEntity/"+req.params.catalogId, args, function(data, response) {
        res.send(JSON.stringify(data));
    });
});







// PUT CALLS
app.put('/customers/:customerId/entities/:entityId', function(req, res){
    console.log(req.params.customerId);
    console.log(req.params.entityId);
    console.log(req.body);

    var args = {
        // path: { "id": 120 },
        // parameters: { arg1: "hello", arg2: "world" },
        // headers: { "Content type": "application/octet-stream" },
        data: req.body
    };


    // http://164.109.96.200:8080/agtech/v1/customers/hahnwinery123/entities/6ee72877-7f9b-4ef1-8255-80b0a5cdcb4f
    // client.put("http://164.109.96.200:8080/agtech/v1/customers/" + "hahnwinery123" + "/entities/"+ "6ee72877-7f9b-4ef1-8255-80b0a5cdcb4f",
    client.put("http://164.109.96.200:8080/agtech/v1/customers/" + req.params.customerId+ "/entities/"+  req.params.entityId,
        args,
        function (data, response) {
            getSpecificDeviceData(data);
        });
    function getSpecificDeviceData(data){
        console.log(data);
        var renderdata = data;
        res.json({"status" : res.statusCode});
    }

});


app.use('/*', router);

app.listen(port);
console.log('Magic happens on port ' + port);
