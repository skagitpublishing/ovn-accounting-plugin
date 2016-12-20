var async = require('async'),
	keystone = require('keystone');

var security = keystone.security;

var LoggedWork = keystone.list('LoggedWork');

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
  
  //Ensure the user making the request is a Keystone Admin
  var isAdmin = req.user.get('isAdmin');
  if(!isAdmin) {
    return res.apiError(403, 'Not allowed to access this API. Not Keystone Admin.');
  }
  
  //Since it's possible to spoof the Keystone Admin setting in the current version of the User model,
  //This is a check to make sure the user is a ConnexstCMS Admin
  var admins = keystone.get('admins');
  var userId = req.user.get('id');
  if(admins.indexOf(userId) == -1) {
    return res.apiError(403, 'Not allowed to access this API. Not ConnextCMS Admin')
  }
  
	LoggedWork.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
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