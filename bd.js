var mongo = require('mongodb').MongoClient;
var url = process.env.MONGO_URI;


module.exports = {
    //save the search after it is made: 

    saveTheSearch: function(input, date) {
        mongo.connect(url, function(err, database) {
            if (err) {
                console.log("error in connection with the database - make no possible to save the search");
                throw err;
            }
            else {
                var db = database.collection("image-search");
                db.insert({
                    'searched_by': input,
                    'when': date
                });
            }
            database.close();
        });
    },

    //recover recent researches: 

    returnRecents: function(callback) {
        mongo.connect(url, function(err, database) {
            if (err) {
                console.log("error in connection with the database - impossible to recover the recent search");
                callback(err);
            }
            var db = database.collection("image-search");
            db.find({}, {
                searched_by:  1,
                when: 1,
                _id: 0
            }).sort({
                $natural: -1
            }).limit(10).toArray(function(err, doc) {
                if (err) {
                    console.log("error in find and sort");
                }
                console.log(doc);
                callback(null,doc);
                database.close();
            });
        });
    }
};