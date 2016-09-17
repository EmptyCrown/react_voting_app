var Character = require('../models/character');
var async = require('async');
var _ = require('underscore');

module.exports = function(app) {
  /**
   * GET /api/stats
   * Returns characters statistics.
   */
  app.get('/api/stats', function(req, res, next) {
    async.parallel([
        function(callback) {
          Character.count({}, function(err, count) {
            callback(err, count);
          });
        },
        function(callback) {
          Character.count({ race: 'Amarr' }, function(err, amarrCount) {
            callback(err, amarrCount);
          });
        },
        function(callback) {
          Character.count({ race: 'Caldari' }, function(err, caldariCount) {
            callback(err, caldariCount);
          });
        },
        function(callback) {
          Character.count({ race: 'Gallente' }, function(err, gallenteCount) {
            callback(err, gallenteCount);
          });
        },
        function(callback) {
          Character.count({ race: 'Minmatar' }, function(err, minmatarCount) {
            callback(err, minmatarCount);
          });
        },
        function(callback) {
          Character.count({ gender: 'Male' }, function(err, maleCount) {
            callback(err, maleCount);
          });
        },
        function(callback) {
          Character.count({ gender: 'Female' }, function(err, femaleCount) {
            callback(err, femaleCount);
          });
        },
        function(callback) {
          Character.aggregate({ $group: { _id: null, total: { $sum: '$wins' } } }, function(err, totalVotes) {
              var total = totalVotes.length ? totalVotes[0].total : 0;
              callback(err, total);
            }
          );
        },
        function(callback) {
          Character
            .find()
            .sort('-wins')
            .limit(100)
            .select('race')
            .exec(function(err, characters) {
              if (err) return next(err);

              var raceCount = _.countBy(characters, function(character) { return character.race; });
              var max = _.max(raceCount, function(race) { return race });
              var inverted = _.invert(raceCount);
              var topRace = inverted[max];
              var topCount = raceCount[topRace];

              callback(err, { race: topRace, count: topCount });
            });
        },
        function(callback) {
          Character
            .find()
            .sort('-wins')
            .limit(100)
            .select('bloodline')
            .exec(function(err, characters) {
              if (err) return next(err);

              var bloodlineCount = _.countBy(characters, function(character) { return character.bloodline; });
              var max = _.max(bloodlineCount, function(bloodline) { return bloodline });
              var inverted = _.invert(bloodlineCount);
              var topBloodline = inverted[max];
              var topCount = bloodlineCount[topBloodline];

              callback(err, { bloodline: topBloodline, count: topCount });
            });
        }
      ],
      function(err, results) {
        if (err) return next(err);

        res.send({
          totalCount: results[0],
          amarrCount: results[1],
          caldariCount: results[2],
          gallenteCount: results[3],
          minmatarCount: results[4],
          maleCount: results[5],
          femaleCount: results[6],
          totalVotes: results[7],
          leadingRace: results[8],
          leadingBloodline: results[9]
        });
      });
  });

}