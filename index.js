// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


var songs = [
  {
    "bpm":152,
    "name":"Headlines by Drake",
    "source":"songs/headlines.mp3",
    "cover":"http://www.aceshowbiz.com/images/news/drake-broody-official-take-care-cover-art.jpg",
  },
  // {
  //   "bpm":
  // }
];

            // songMeta.bpm = data.songBPM;
            // songMeta.name = data.songName;
            // songMeta.source = data.songsource;
            // songMeta.Cover = data.songCover;


io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('command input', function (data) {
    socket.broadcast.emit('bpm update', {
      bpm: data.bpm
    });
    // we tell the client to execute 'new message'
    // data.bpm = 


  });

});