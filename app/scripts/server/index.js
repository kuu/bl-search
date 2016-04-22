'use strict';

require('babel-register')();
require('./main');

var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    crypto = require('crypto'),
    express = require('express'),
    bodyParser = require('body-parser'),
    config = require('config'),
    ytdl = require('ytdl-core'),
    JsonDB = require('node-json-db');

var app = express(),
    port = process.env.PORT || 3030,
    BASE_DIR = path.join(__dirname, '../'),
    DOCS_DIR = path.join(BASE_DIR, 'dist/'),
    VIDEO_DIR = 'video/', filePath,
    db = new JsonDB("db", true, false);

app.use(express.static(BASE_DIR + 'dist'));

app.get('/api/videolist', function (req, res) {
  var videoList;

  console.log('REQUEST: /api/videolist');

  // Read DB
  try {
    videoList = db.getData("/video") || [];
  } catch (e) {
    videoList = [];
  }
  res.status(200).json(videoList);
});

app.get('/api/offlinify', function (req, res) {
  var videoURL = decodeURIComponent(req.query.url),
      hostname = url.parse(videoURL, true).hostname;

  console.log('REQUEST: /api/offlinify');

  if(hostname !== 'www.youtube.com' && hostname !== 'youtu.be') {
    res.sendStatus(404);
  }

  filePath = VIDEO_DIR + crypto.randomBytes(20).toString('hex') + '.mp4';

  // Get the info associated with the video URL
  ytdl.getInfo(videoURL, { downloadURL: true }, function (err, info) {

    if (err) {
      res.sendStatus(404);
      return;
    }

    // Download and save the actual video data.
    ytdl(videoURL, { filter: function(format) { return format.quality === 'medium' && format.container === 'mp4'; } })
    .pipe(fs.createWriteStream(DOCS_DIR + filePath))
    .on('finish', function() {
      var obj = {
        title: info.title,
        path: filePath
      };

      // Write DB.
      db.push('/' + filePath, obj);

      // Read DB
      obj = db.getData("/video") || [];

      // Send response.
      res.status(200).json(obj);
    });
  });
});

// Start server
if (require.main === module) {
  console.log('Server listening on port %s', port);
  app.listen(port);
}

module.exports = app;
