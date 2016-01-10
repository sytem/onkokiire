// simple test to get alert if train is late or cancelled
// Teppo Rekola 2016
// (my first node.js app...)


// based on http://stackoverflow.com/questions/16148403/using-node-js-to-connect-to-a-rest-api/16155551#16155551
// data from Digitraffic API ( http://rata.digitraffic.fi/api/v1/doc/), CC BY 4.0
// notifications via https://www.npmjs.com/package/node-pushover to https://pushover.net/

// load config from file, do not update this to git 
var config = require('./config');

var http = require("http");
    //what trains to get
    //trains = [81, 83, 165];
    trains = config.trains;
    baseurl = "http://rata.digitraffic.fi/api/v1/live-trains/";

    //set date or use nearest, warning: no check if train exist on given date
    dateparam = ""
    dateparam = "?departure_date=2016-01-08";

    for (t = 0; t < trains.length; t++) { 

        url = baseurl + trains[t] + dateparam;

        // get is a simple wrapper for request()
        // which sets the http method to GET
        var request = http.get(url, function (response) {
            // data is streamed in chunks from the server
            // so we have to handle the "data" event    
            var buffer = "", 
                data,
                route;

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

                //häly jos junan HL-aikaan on 30-40 minuuttia ja juna on joko peruttu tai pasilassa myöhässä >10min
                //tai jos RI myöhässä >5min (tää tulee noin 20min ennen HL-aikaa)
                //tarvitaan tarkistus ettei peräkkäiset cron-ajot (arkisin 05-09 vaikkapa kerran viidessä minuutissa) toista hälyä

                console.log("trail: " + data[0].trainNumber);
                console.log("cancelled: " + data[0].cancelled);

                for (i = 0; i < data[0].timeTableRows.length; i++) { 
                    //filter only intresting stations
                    if (data[0].timeTableRows[i].stationShortCode == "PSL" || 
                        data[0].timeTableRows[i].stationShortCode == "RI" || 
                        data[0].timeTableRows[i].stationShortCode == "HL" || 
                        data[0].timeTableRows[i].stationShortCode == "TL" || 
                        data[0].timeTableRows[i].stationShortCode == "TPE" ) {
                        
                        if (data[0].timeTableRows[i].type == "ARRIVAL" ){
                            console.log(data[0].timeTableRows[i].stationShortCode + " (" + data[0].timeTableRows[i].scheduledTime + ") : " + data[0].timeTableRows[i].differenceInMinutes) + "\n";
                        }    
                    }
                }
               
            }); 
        
        });
    }

