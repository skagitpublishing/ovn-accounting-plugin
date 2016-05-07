var async = require('async'),
	keystone = require('keystone');

var NRPProject = keystone.list('NRPProject');

/**
 * List NRPProject
 */
exports.list = function(req, res) {
	NRPProject.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
		res.apiResponse({
			nrpproject: items
		});
		
	});
}

/**
 * Get NRPProject by ID
 */
exports.get = function(req, res) {
	NRPProject.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			nrpproject: item
		});
		
	});
}


/**
 * Create a NRPProject
 */
exports.create = function(req, res) {
	
	var item = new NRPProject.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
		res.apiResponse({
			nrpproject: item
		});
		
	});
}

/**
 * Get NRPProject by ID
 */
exports.update = function(req, res) {
	NRPProject.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				nrpproject: item
			});
			
		});
		
	});
}

/**
 * Delete NRPProject by ID
 */
exports.remove = function(req, res) {
	NRPProject.model.findById(req.params.id).exec(function (err, item) {
		
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