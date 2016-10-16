var async = require('async'),
	keystone = require('keystone');

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