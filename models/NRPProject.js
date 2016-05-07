var keystone = require('keystone');

/**
 * NRP Project Model - Used to create an NRP project
 * ==================
 */

var NRPProject = new keystone.List('NRPProject', {
	autokey: { from: 'projectname', path: 'key', unique: true }
});

NRPProject.add({
	projectname: { type: String, required: true },
  projectnick:{ type: String }, 
  agent_type: { type: String },
});

Page.defaultColumns = 'username, first_name|20%, last_name|20%, email|20%';

NRPProject.register();
