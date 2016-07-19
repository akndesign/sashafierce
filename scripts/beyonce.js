var play, spotify;

process.env.HUBOT_YOUTUBE_API_KEY = "AIzaSyCQ5QjcrRFIFy5Z4P9PuCSO78xN_kKA6vQ";

process.env.HUBOT_YOUTUBE_HEAR = true;

var beyonceOffset = Math.floor(Math.random() * 50) + 1;
var beyonceUrl = 'https://api.spotify.com/v1/search/?q=beyonce&type=artist&offset=' + beyonceOffset;

module.exports = function(robot) {
  var trigger;
  if (process.env.HUBOT_API_KEY = "AIzaSyCQ5QjcrRFIFy5Z4P9PuCSO78xN_kKA6vQ") {
    trigger = /watch( some)? (.*)/i;
  }

  // Who Runs the World, Hotsauce

  robot.hear(/who runs the world/i, function(res) {
    return res.send("girls http://giphy.com/gifs/girl-beyonce-Pdag4PIGsrniw");
  });
  robot.hear(/hotsauce/i, function(res) {
    return res.send("http://giphy.com/gifs/beyonce-mv-formation-l4KhYlZ9PU3SulRRu");
  });


  //Play Some Beyonce, Jay-Z Conditional

  return robot.hear(/play( some)? (.*)/i, function(msg) {
    var callback, query, track;
    query = msg.match[2];
    track = "track";
    
    
    if (query === 'jayz') {
      msg.send("are you Becky with the good hair?");
    } else {
      spotify(robot, msg, query, track, callback);
    }
    return function(query, response, msg) {
      if (response.tracks.items.length > 0 && response.tracks.items[0].external_urls !== null) {
        msg.send(response.tracks.items[0].external_urls.spotify);
      } else {
        msg.send("Even I can't find that song called \"" + query + "\"! I guess that's for the best.");
      }
    };
  });
};

play = function(robot, msg, query, type, callback) {
  var q;
  q = {
    q: query,
    type: type,
    limit: 1
  };

  //var BeyonceOffset = Math.floor(Math.random() * 50) + 1;

  return msg.http('https://api.spotify.com/v1/search/') 
  .query(q).get()(function(err, res, body) {
    if (err) {
      msg.send("Heeeeelp, something is going terribly wrong: " + err);
    } else if (res.statusCode / 100 === 2) {
      return callback(query, JSON.parse(body), msg);
    } else {
      msg.send("Call for backup, unknown error calling spotify: " + JSON.parse(body).message);
    }
  });
};

//INSERT A RANDOM INTEGER INTO THE OFFSET OF SPOTIFY API SEARCH, THEN YOU WON"T GET THE SAME RESULT

spotify = function(robot, msg, query, type, callback) {
  var q;
  q = {
    q: query,
    type: type,
    limit: 1
  };
  msg.http('https://api.spotify.com/v1/search/')
  .query(q).get()(function(err, res, body) {
    if (err) {
      msg.send("Heeeeelp, something is going terribly wrong: " + err);
    } else if (res.statusCode / 100 === 2) {
      return callback(query, JSON.parse(body), msg);
    } else {
      msg.send("Call for backup, unknown error calling spotify: " + JSON.parse(body).message);
    }
  });

  //Find Beyonce Music Videos

  return robot.hear(trigger, function(msg) {
    query = msg.match[1];
    return robot.http("https://www.googleapis.com/youtube/v3/search").query({
      order: 'relevance',
      part: 'snippet',
      type: 'video',
      maxResults: maxResults,
      q: query,
      key: AIzaSyCQ5QjcrRFIFy5Z4P9PuCSO78xN_kKA6vQ
    }).get()(function(err, res, body) {
      var error, video, videos;
      robot.logger.debug(body);
      if (err) {
        robot.logger.error(err);
        return robot.emit('error', err, msg);
      }
      try {
        if (res.statusCode === 200) {
          videos = JSON.parse(body);
          robot.logger.debug("Videos: " + (JSON.stringify(videos)));
        } else {
          return robot.emit('error', res.statusCode + ": " + body, msg);
        }
      } catch (_error) {
        error = _error;
        robot.logger.error(error);
        return msg.send("Error! " + body);
      }
      if (videos.error) {
        robot.logger.error(videos.error);
        return msg.send("Error! " + (JSON.stringify(videos.error)));
      }
      videos = videos.items;
      if (!((videos != null) && videos.length > 0)) {
        return msg.send("No video results for \"" + query + "\"");
      }
      video = msg.random(videos);
      return msg.send("https://www.youtube.com/watch?v=" + video.id.videoId);
    });
  });
};