var async = require('async'),
	keystone = require('keystone');

var security = keystone.security;

var LoggedWork = keystone.list('LoggedWork');

//Retrieve the list of superusers saved in keystone.js
var superusers = keystone.get('superusers');

/**
 * List LoggedWork
 */
exports.list = function(req, res) {
	LoggedWork.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			loggedwork: items
		});
		
	});
}

/**
 * Get LoggedWork by ID
 */
exports.get = function(req, res) {
	LoggedWork.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			loggedwork: item
		});
		
	});
}


/**
 * Create a LoggedWork
 */
exports.create = function(req, res) {
	
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  var data = (req.method == 'POST') ? req.body : req.query;
  
  //Ensure the user making the request is either the user being changed or a superuser. 
  //Reject normal admins or users maliciously trying to change other users settings.
  var userId = req.user.get('id');
  if(userId != data.user) {
    return res.apiError(403, 'Not allowed to change this user settings.');
  }
  
	var item = new LoggedWork.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			loggedwork: item
		});
		
	});
}

/**
 * Get LoggedWork by ID
 */
exports.update = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  var data = (req.method == 'POST') ? req.body : req.query;
  
  //Ensure the user making the request is either the user being changed or a superuser. 
  //Reject normal admins or users maliciously trying to change other users settings.
  var userId = req.user.get('id');
  if(userId != data.user) {
    return res.apiError(403, 'Not allowed to change this user settings.');
  }
  
	LoggedWork.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
    
		//var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				loggedwork: item
			});
			
		});
		
	});
}

/**
 * Delete LoggedWork by ID
 */
exports.remove = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	if (!security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
  
  var data = (req.method == 'POST') ? req.body : req.query;
  
  //Ensure the user making the request is either the user being changed or a superuser. 
  //Reject normal admins or users maliciously trying to change other users settings.
  var userId = req.user.get('id');
  if(userId != data.user) {
    return res.apiError(403, 'Not allowed to change this user settings.');
  }
  
	LoggedWork.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}