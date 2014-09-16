function initDataClient(url, connectionClosedCallback) {
  var serverUnavailable = function () {
    connectionClosedCallback();
  };

  if (typeof io === 'undefined') {
    serverUnavailable();
  }

  var socket = io.connect(url);

  socket.on('disconnect', function() {
    serverUnavailable();
  });

  return {
    requestAllPlaces : function(url) {
      socket.emit('getAllPlaces');
    },
    onPlaces : function(callback) {
      socket.on('allPlaces', callback);
    },
    requestAllMaps : function(url) {
      socket.emit('getAllMaps');
    },
    onMaps : function(callback) {
      socket.on('allMaps', callback);
    },
    addPlace: function(place) {
      socket.emit('addPlace', place);
    },
    onPlaceAdded: function(callback) {
      socket.on('placeAdded', callback);
    }
  };
};