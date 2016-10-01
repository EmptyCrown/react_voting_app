var Dish = require('../models/dish');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('underscore');

module.exports = function(app) {
	/**
	 * GET /api/dishes
	 * Returns 2 random dishes of the same type that have not been voted yet.
	 */
	app.get('/api/dishes', function(req, res, next) {
	  var choices = ['Entree', 'Dessert'];
	  var randomGender = _.sample(choices);

	  Dish.find({random: {$near: [Math.random(),0]}})
	    .where('voted', false)
	    .limit(2)
	    .exec(function(err, dishes) {
	      if (err) return next(err);

	      //console.log(dishes);
	      if (dishes.length === 2) {
	        return res.send(dishes);
	      }

	      Dish.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
          if (err) return next(err);
          res.send([]);
        });

	      //TODO
	      // var oppositeGender = _.first(_.without(choices, randomGender));

	      // Dish
	      //   .find({ random: { $near: [Math.random(), 0] } })
	      //   .where('voted', false)
	      //   .where('gender', oppositeGender)
	      //   .limit(2)
	      //   .exec(function(err, dishes) {
	      //     if (err) return next(err);

	      //     if (dishes.length === 2) {
	      //       return res.send(dishes);
	      //     }

	      //     Dish.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
	      //       if (err) return next(err);
	      //       res.send([]);
	      //     });
	      //   });
	    });
	});

	/**
	 * PUT /api/dishes
	 * Update winning and losing count for both dishes.
	 */
	app.put('/api/dishes', function(req, res, next) {
	  var winner = req.body.winner;
	  var loser = req.body.loser;

	  if (!winner || !loser) {
	    return res.status(400).send({ message: 'Voting requires two dishes.' });
	  }

	  if (winner === loser) {
	    return res.status(400).send({ message: 'Cannot vote for and against the same dish.' });
	  }

	  async.parallel([
	      function(callback) {
	        Dish.findOne({ dishId: winner }, function(err, winner) {
	          callback(err, winner);
	        });
	      },
	      function(callback) {
	        Dish.findOne({ dishId: loser }, function(err, loser) {
	          callback(err, loser);
	        });
	      }
	    ],
	    function(err, results) {
	      if (err) return next(err);

	      var winner = results[0];
	      var loser = results[1];

	      if (!winner || !loser) {
	        return res.status(404).send({ message: 'One of the dishes no longer exists.' });
	      }

	      if (winner.voted || loser.voted) {
	        return res.status(200).end();
	      }

	      async.parallel([
	        function(callback) {
	          winner.wins++;
	          winner.voted = true;
	          winner.random = [Math.random(), 0];
	          winner.save(function(err) {
	            callback(err);
	          });
	        },
	        function(callback) {
	          loser.losses++;
	          loser.voted = true;
	          loser.random = [Math.random(), 0];
	          loser.save(function(err) {
	            callback(err);
	          });
	        }
	      ], function(err) {
	        if (err) return next(err);
	        res.status(200).end();
	      });
	    });
	});

	/**
	 * GET /api/dishes/count
	 * Returns the total number of dishes.
	 */
	app.get('/api/dishes/count', function(req, res, next) {
	  Dish.count({}, function(err, count) {
	    if (err) return next(err);
	    res.send({ count: count });
	  });
	});

	/**
	 * GET /api/dishes/search
	 * Looks up a dish by name. (case-insensitive)
	 */
	app.get('/api/dishes/search', function(req, res, next) {
	  var dishName = new RegExp(req.query.name, 'i');

	  Dish.findOne({ name: dishName }, function(err, dish) {
	    if (err) return next(err);

	    if (!dish) {
	      return res.status(404).send({ message: 'Dish not found.' });
	    }

	    res.send(dish);
	  });
	});

	/**
	 * GET /api/dishes/top
	 * Return 100 highest ranked dishes. Filter by gender, race and bloodline.
	 */
	app.get('/api/dishes/top', function(req, res, next) {
	  var params = req.query;
	  var conditions = {};

	  // _.each(params, function(value, key) {
	  //   conditions[key] = new RegExp('^' + value + '$', 'i');
	  // });

	  Dish
	    .find(conditions)
	    .sort('-wins') // Sort in descending order (highest wins on top)
	    .limit(100)
	    .exec(function(err, dishes) {
	      if (err) return next(err);
	      // Sort by winning percentage
	      dishes.sort(function(a, b) {
	        if (a.wins / (a.wins + a.losses) < b.wins / (b.wins + b.losses)) { return 1; }
	        if (a.wins / (a.wins + a.losses) > b.wins / (b.wins + b.losses)) { return -1; }
	        return 0;
	      });

	      res.send(dishes);
	    });
	});

	/**
	 * GET /api/dishes/shame
	 * Returns 100 lowest ranked dishes.
	 */
	app.get('/api/dishes/shame', function(req, res, next) {
	  Dish
	    .find()
	    .sort('-losses')
	    .limit(100)
	    .exec(function(err, dishes) {
	      if (err) return next(err);
	      res.send(dishes);
	    });
	});

	/**
	 * GET /api/dishes/:id
	 * Returns detailed dish information.
	 */
	app.get('/api/dishes/:id', function(req, res, next) {
	  var id = req.params.id;

	  Dish.findOne({ dishId: id }, function(err, dish) {
	    if (err) return next(err);

	    if (!dish) {
	      return res.status(404).send({ message: 'Dish not found.' });
	    }

	    res.send(dish);
	  });
	});

	/**
	 * POST /api/report
	 * Reports a dish. Dish is removed after 4 reports.
	 */
	app.post('/api/report', function(req, res, next) {
	  var dishId = req.body.dishId;

	  Dish.findOne({ dishId: dishId }, function(err, dish) {
	    if (err) return next(err);

	    if (!dish) {
	      return res.status(404).send({ message: 'Dish not found.' });
	    }

	    dish.reports++;

	    if (dish.reports > 4) {
	      dish.remove();
	      return res.send({ message: dish.name + ' has been deleted.' });
	    }

	    dish.save(function(err) {
	      if (err) return next(err);
	      res.send({ message: dish.name + ' has been reported.' });
	    });
	  });
	});
}