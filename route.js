'use strict';
var imageSearch = require('node-google-image-search');
var saveSearch = require("./bd.js").saveTheSearch;
var fetchRecent = require("./bd.js").returnRecents;


module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile(process.cwd() + '/index.html');
    });

    app.get('/api/imagesearch/:term', function(req, res) {
        var input = req.param('term');
        var time = new Date();
        saveSearch(input, time);
        var num = req.param('offset') || 5;
        search(input, num, function(err, images) {
            if (err) {
                console.log("erro! pẽẽẽẽ");
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                images
            }));
        });
    });

    app.get('/api/latest*', function(req, res) {
        fetchRecent(function(err, results) {
            if (err) {
                console.log("error in recover recent search");
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(
                 results
            );
        });
    });
};




function search(input, num, callback) {
    var images = [];
    imageSearch(input, function(results) {
        for (var i = 0; i < results.length; i++) {
            var object = {
                "url": results[i].link,
                "snippet": results[i].snippet,
                "thumbnail": results[i].image.thumbnailLink,
                "context": results[i].image.contextLink
            };
            images.push(object);
        }
        callback(null, images);
    }, 0, num);
}