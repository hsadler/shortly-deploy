var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

//TODO: refactor to mongo
exports.fetchLinks = function(req, res) {
  Link.find(function(err, links) {
    if(err) console.log(err);
    res.send(200, links);
  });
};

//DONE: refactor to mongo
exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ 'url': uri }, function(err, link) {
    if(err) console.log(err);
    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          code: Math.floor(Math.random() * 10000)
        }).save(function(err, newLink) {
          res.send(200, newLink);
        });

      }); // util
    } // else
  });
};

//DONE: refactor to mongo
exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ 'username': username }, function(err, user) {
    if(err) console.log(err);
    if(user !== null) {
      user.comparePassword(password, function(isMatch) {
        if (isMatch) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

//DONE: refactor to mongo
exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  User.find({ 'username': username}, function(err, user) {
    if(err) console.log(err);
    else if(user.length === 0) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword(function() {
        newUser.save(function(err, user) {
          if (!err) {
            util.createSession(req, res, user);   
          }
        });
      });
    } else {
      // if already exists
      res.redirect('/signup');    
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ 'code': req.params[0] }, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      // link.visits = link.visits + 1;
      link.save(function(err, link) {
        if(err) console.log(err);
      });
      res.redirect(link.url);
    }
  });
};