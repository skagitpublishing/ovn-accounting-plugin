var keystone = require('keystone');

/**
 * NRP User Model - Used to create an NRP user
 * ==================
 */

var NRPUser = new keystone.List('NRPUser', {
	autokey: { from: 'username', path: 'key', unique: true }
});

NRPUser.add({
	username: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password: { type: String },
  agent_type: { type: String },
  address: { type: String },
  phone: { type: String },
  website: { type: String },
  api_url: { type: String },
  agent_url: { type: String },
  user_url: { type: String },
});

NRPUser.defaultColumns = 'username, first_name|20%, last_name|20%, email|20%';

NRPUser.register();
