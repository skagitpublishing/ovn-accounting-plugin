var keystone = require('keystone');

/**
 * NRP Project Model - Used to create an NRP project
 * ==================
 */

var NRPProject = new keystone.List('NRPProject', {
	autokey: { from: 'projectname', path: 'key', unique: true }
});

NRPProject.add({
	projectname: { type: String },
  projectnick:{ type: String }, 
  agent_type: { type: String },
});

Page.defaultColumns = 'projectname';

NRPProject.register();
