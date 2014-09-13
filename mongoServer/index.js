var mongodb = require('mongodb'),
    config = require('./config.js').config
 
function initNetwork(dbApi) {
  var server = require('socket.io').listen(config.dataServerPort, { log: false });

  console.log("Data server ready");

  server.on('connection', function (clientSocket) {
    console.log("New connection")
    clientSocket.on('getAllPlaces', function () {
      console.log("All places")
      dbApi.getAllPlaces(
      	function(places) {
          clientSocket.emit('allPlaces', places);
        }
      );
    });

    clientSocket.on('addPlace', function (place) {
      dbApi.addPlace(place);
    });
  });
}

function initDb(callback) {
  var server = new mongodb.Server(config.mongoAddress, config.mongoPort, { }),
      db = mongodb.Db(config.mongoTravelDb, server, {});

  db.open(function (err, client) {
    if (err) { throw err; }

    var places = new mongodb.Collection(client, config.placesCollection),
        connections = new mongodb.Collection(client, config.connectionsCollection);

    var dbApi = {
      getAllPlaces: function(getAllPlacesCallback) {
      	places.find({}, {}).toArray ( function (err, res) {
            getAllPlacesCallback(res);
      	})
      },
      addPlace: function(place) {
        places.insert(place);

      },
      close: function() {
        db.close();      	
      }
    }

    callback(dbApi)
  });
}

initDb(function(dbApi) {
  initNetwork(dbApi)
});
