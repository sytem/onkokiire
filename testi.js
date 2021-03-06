// simple test to get alert if train is late or cancelled
// Teppo Rekola 2016
// (my first node.js app...)


// based on http://stackoverflow.com/questions/16148403/using-node-js-to-connect-to-a-rest-api/16155551#16155551
// data from Digitraffic API ( http://rata.digitraffic.fi/api/v1/doc/), CC BY 4.0
// notifications via https://www.npmjs.com/package/node-pushover to https://pushover.net/

// load config from file, do not update this to git 
var config = require('./config');
var argv = require('yargs').argv;

console.log(" komentoriviparametri --train=NN ohittaa tiedostossa määritellyt junat")

var trains = [];

if(!argv.train){
    trains = config.trains;
}
else {
    trains[0] = argv.train;
}    


var Pushover = require('node-pushover');
var http = require("http");

var push = new Pushover({
    token: config.pushover.apikey,
    user: config.pushover.user
});


//API
baseurl = "http://rata.digitraffic.fi/api/v1/live-trains/";

//set date or use nearest
dateparam = ""
//dateparam = "?departure_date=2016-01-09";

for (t = 0; t < trains.length; t++) { 

    url = baseurl + trains[t] + dateparam;

    // get is a simple wrapper for request()
    // which sets the http method to GET
    var request = http.get(url, function (response) {
        // data is streamed in chunks from the server
        // so we have to handle the "data" event    
        var buffer = "", 
            data;

        response.on("data", function (chunk) {
            buffer += chunk;
        }); 

        response.on("end", function (err) {
            // finished transferring data
            // dump the raw data
            //console.log(buffer);
            //console.log("\n");
            data = JSON.parse(buffer);
            //console.log(data)

            //if we dont get data, there is no such train today
            if(typeof data[0] === 'undefined'){
                console.log("ei ole junaa");
                console.log("- - -");
                return;
            };

            console.log("trail: " + data[0].trainNumber);
            console.log("cancelled: " + data[0].cancelled);

            if (data[0].cancelled) {

                //send alert
                console.log("Sending message, train cancelled");

                var title = "Juna " + data[0].trainNumber + " peruttu";
                var message = "Ei voittoa tänään";

                push.send(title, message, function (err, res){
                    if(err){
                        console.log("We have an error:");
                        console.log(err);
                        console.log(err.stack);
                    }else{
                        console.log("Message send successfully");
                        console.log(res);
                    }
                });
                
            }

            for (i = 0; i < data[0].timeTableRows.length; i++) { 
                //filter only intresting stations to print
                if (data[0].timeTableRows[i].stationShortCode == "PSL" || 
                    data[0].timeTableRows[i].stationShortCode == "RI" || 
                    data[0].timeTableRows[i].stationShortCode == "HL" || 
                    data[0].timeTableRows[i].stationShortCode == "TL" || 
                    data[0].timeTableRows[i].stationShortCode == "TPE" ) {
                    
                    if (data[0].timeTableRows[i].type == "ARRIVAL" ){
                        console.log(data[0].timeTableRows[i].stationShortCode + " (" + data[0].timeTableRows[i].scheduledTime + ") : " + data[0].timeTableRows[i].differenceInMinutes) + "\n";
                    }    
                }
                // send alert if late

                if (data[0].timeTableRows[i].stationShortCode == "RI" && data[0].timeTableRows[i].type == "ARRIVAL" ) {
                    if ( data[0].timeTableRows[i].differenceInMinutes > 10 ) {
                        console.log("Sending message, train late");

                        var title = "Juna " + data[0].trainNumber + " myöhässä";
                        var message = data[0].timeTableRows[i].stationShortCode + ": +" + data[0].timeTableRows[i].differenceInMinutes + " min";

                        push.send(title, message, function (err, res){
                            if(err){
                                console.log("We have an error:");
                                console.log(err);
                                console.log(err.stack);
                            }else{
                                console.log("Message send successfully");
                                console.log(res);
                            }
                        });
                    }

                }
            }
           
           console.log("- - -");
        }); 
    
    });
}

