module.exports = function(io) {

  io.on('connection', function(socket) {

    // user post comment or delete
    socket.on('comment', function(data) {

      var commentEvent = 'comment/' + data.type + '/' + data.eventId;
      socket.broadcast.emit(commentEvent, {});

    });


    // user join a event
    socket.on('join', function(data) {

      var joinEvent = 'join/' + data.type + '/' + data.eventId;
      socket.broadcast.emit(joinEvent, {});

    });


    // user close a event
    socket.on('close', function(data) {

      var closeEvent = 'close/' + data.type + '/' + data.eventId;
      socket.broadcast.emit(closeEvent, {});

    });

  });

};
