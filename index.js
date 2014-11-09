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

// app.post('/update'function(req, res){

// });
var songs = [
  {
    "bpm":152,
    "name":"Headlines",
    "artist":"Drake",
    "source":"songs/headlines.mp3",
    "cover":"http://www.aceshowbiz.com/images/news/drake-broody-official-take-care-cover-art.jpg",
  },
  // {
  //   "bpm":180,
  //   "name":"0 to 100 by Drake",
  //   "source":"",
  //   "cover":""
  // }
  {
    "bpm":140,
    "name":"Work",
    "artist":"Iggy Azalea",
    "source":"songs/work.mp3",
    "cover":"http://fc02.deviantart.net/fs70/f/2013/078/8/5/iggy_azalea___work_cd_cover_by_gaganthony-d5ylgvu.png"
  },
  {
    "bpm": 95,
    "name":"No Mediocre (Explicit) ft. Iggy Azalea",
    "artist":"T.I.",
    "source":"songs/no-mediocre.mp3",
    "cover":"http://www.rap-up.com/blog/wp-content/uploads/2014/06/ti-iggy-no-mediocre.jpg"
  },
  {
    "bpm":128,
    "name":"Believer (Tiesto Remix)",
    "source":"songs/believers.mp3",
    "cover":"https://a2-images.myspacecdn.com/images03/21/3af1952f4af645eaa759003e0e0f304b/600x600.jpg"
  },
  {
    "bpm":110,
    "name":"Eye of The Tiger",
    "artist":"Survivor",
    "source":"songs/eye-of-the-tiger.mp3",
    "cover":"http://blogs.c.yimg.jp/res/blog-17-39/koji7196/folder/420618/21/8349321/img_0"
  },
  {
    "bpm":128,
    "name":"Flaws",
    "artist":"Bastille",
    "source":"songs/flaws.mp3",
    "cover":"https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0CAQQjBw&url=http%3A%2F%2Fgeorgetownradio.com%2Fwp%2Fwp-content%2Fuploads%2F2013%2F03%2Fartworks-000027298950-jjjldd-original.jpg&ei=VJ1eVI6GCunmiQKfwYCQDg&bvm=bv.79189006,d.cGE&psig=AFQjCNHR0_H_qsgT8Rl7y7JjUyVThYx4Tg&ust=1415573189672468"
  }
];

function findSong(){
  return songs[Math.floor(Math.random()*songs.length)];
}
function sendNewSong(song){
  io.sockets.emit('playsong', song);
}
io.on('connection', function (socket) {

  // when the client emits 'new message', this listens and executes
  socket.on('command input', function (data) {

    console.log('Got command input');

    sendNewSong(findSong());
  });
  socket.on('song complete', function(data){
    console.log("Song completed");
    sendNewSong(findSong());
  });

});