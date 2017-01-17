var async = require('async'),
	keystone = require('keystone');

var security = keystone.security;

var ProjectInfo = keystone.list('ProjectInfo');

//Retrieve the list of superusers saved in keystone.js
var superusers = keystone.get('superusers');

/**
 * List ProjectInfo
 */
exports.list = function(req, res) {
	ProjectInfo.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			projectinfo: items
		});
		
	});
}

/**
 * Get ProjectInfo by ID
 */
exports.get = function(req, res) {
	ProjectInfo.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			projectinfo: item
		});
		
	});
}


/**
 * Create a ProjectInfo
 */
exports.create = function(req, res) {
	
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a superuser. 
  //Reject normal admins or users maliciously trying to change settings.
  var userId = req.user.get('id');
  if(superusers.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to change this user settings.');
  }

  
	var item = new ProjectInfo.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			projectinfo: item
		});
		
	});
}

/**
 * Get ProjectInfo by ID
 */
exports.update = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Dev Note: Can't use this as normal users adding work entries will need to update project info.
  //Ensure the user making the request is a superuser. 
  //Reject normal admins or users maliciously trying to change settings.
  //var userId = req.user.get('id');
  //if(superusers.indexOf(userId) == -1) {
  //  return res.apiError(403, 'Not allowed to change this user settings.');
  //}
  
	ProjectInfo.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				projectinfo: item
			});
			
		});
		
	});
}

/**
 * Delete Projects by ID
 */
exports.remove = function(req, res) {
  
  //Ensure the user has a valid CSRF token
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is a superuser. 
  //Reject normal admins or users maliciously trying to change settings.
  var userId = req.user.get('id');
  if(superusers.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to change this user settings.');
  }
  
	ProjectInfo.model.findById(req.params.id).exec(function (err, item) {
		
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