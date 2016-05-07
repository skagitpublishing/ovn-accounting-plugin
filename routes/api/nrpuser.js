var async = require('async'),
	keystone = require('keystone');

var NRPUser = keystone.list('NRPUser');

/**
 * List NRPUser
 */
exports.list = function(req, res) {
	NRPUser.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			nrpuser: items
		});
		
	});
}

/**
 * Get NRPUser by ID
 */
exports.get = function(req, res) {
	NRPUser.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			nrpuser: item
		});
		
	});
}


/**
 * Create a NRPUser
 */
exports.create = function(req, res) {
	
	var item = new NRPUser.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			nrpuser: item
		});
		
	});
}

/**
 * Get NRPUser by ID
 */
exports.update = function(req, res) {
	NRPUser.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				nrpuser: item
			});
			
		});
		
	});
}

/**
 * Delete NRPUser by ID
 */
exports.remove = function(req, res) {
	NRPUser.model.findById(req.params.id).exec(function (err, item) {
		
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