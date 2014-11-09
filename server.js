// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var currentSongIndex;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//Parsing request body
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/update', function(req, res){
  var song = songs[currentSongIndex];
  console.log('Current song: '+song.name);
  console.log('Song bpm: '+song.bpm);
  var interval = parseFloat(req.body.interval);
  var multiplier;
  songInterval = 1/(song.bpm/60);
  console.log(songInterval);
  prevDistance = 99999999;
  var prevTargetInterval;
  for (var i = 0; i < 6; i++) {
    multiplier = Math.pow(2, i);
    console.log(multiplier);
    targetInterval = multiplier * interval;
    console.log(targetInterval);
    distance = Math.abs(songInterval - targetInterval);
    if( distance < prevDistance){
      prevDistance = distance;
      prevTargetInterval = targetInterval;
    }else{
      break;
    }
  }
  targetBPM = 60.0 * (1 / prevTargetInterval);
  targetBPMMultiplier = targetBPM/song.bpm;
  console.log('Target BPM '+targetBPM);
  console.log('Target BPM Multiplier'+String(targetBPMMultiplier));
  if( targetBPMMultiplier > 1.5){
    targetBPMMultiplier = 1.5;
  }else if( targetBPMMultiplier < 0.65 ){
    targetBPMMultiplier = 0.65;
  }
  io.sockets.emit('update multiplier',{'multiplier':targetBPMMultiplier});
  // closestBPM = 9999999;
  // for (var i = 0; i < 6; i++) {
  //   distance = bps - interval*2**i;
  //   if( distance < closestBPM - interval*2**i)
  // };
  res.end(String(targetBPM)+'----'+String(targetBPMMultiplier)+"\n");
});
var songs = [
  {
    "id":1,
    "bpm":152,
    "name":"Headlines",
    "artist":"Drake",
    "source":"songs/headlines.mp3",
    "cover":"http://www.aceshowbiz.com/images/news/drake-broody-official-take-care-cover-art.jpg",
  },
  {
    "id":2,
    "bpm":140,
    "name":"Work",
    "artist":"Iggy Azalea",
    "source":"songs/work.mp3",
    "cover":"http://fc02.deviantart.net/fs70/f/2013/078/8/5/iggy_azalea___work_cd_cover_by_gaganthony-d5ylgvu.png"
  },
  {
    "id":3,
    "bpm": 95,
    "name":"No Mediocre (Explicit) ft. Iggy Azalea",
    "artist":"T.I.",
    "source":"songs/no-mediocre.mp3",
    "cover":"http://www.rap-up.com/blog/wp-content/uploads/2014/06/ti-iggy-no-mediocre.jpg"
  },
  {
    "id":4,
    "bpm":128,
    "name":"Believer (Tiesto Remix)",
    "source":"songs/believers.mp3",
    "cover":"https://a2-images.myspacecdn.com/images03/21/3af1952f4af645eaa759003e0e0f304b/600x600.jpg"
  },
  {
    "id":5,
    "bpm":110,
    "name":"Eye of The Tiger",
    "artist":"Survivor",
    "source":"songs/eye-of-the-tiger.mp3",
    "cover":"http://blogs.c.yimg.jp/res/blog-17-39/koji7196/folder/420618/21/8349321/img_0"
  },
  {
    "id":6,
    "bpm":128,
    "name":"Flaws",
    "artist":"Bastille",
    "source":"songs/flaws.mp3",
    "cover":"http://georgetownradio.com/wp/wp-content/uploads/2013/03/artworks-000027298950-jjjldd-original.jpg"
  }
];

function findSong(){
  currentSongIndex = Math.floor(Math.random()*songs.length);
  return songs[currentSongIndex];
}
function sendNewSong(song){
  io.sockets.emit('playsong', song);
}
io.on('connection', function (socket) {
  // sendNewSong(findSong());
  io.sockets.emit('playsong connect',findSong());

  socket.on('song complete', function(data){
    console.log("Song completed");
    sendNewSong(findSong());
  });
  socket.on('song currently playing',function(data){
    currentSongIndex = parseInt(data.id)-1;
  });

});