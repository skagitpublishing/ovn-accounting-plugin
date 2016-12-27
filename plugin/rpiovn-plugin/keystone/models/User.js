var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
  name: { type: Types.Name, required: true, index: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: Types.Email, initial: true, required: true, index: true },
  password: { type: Types.Password, initial: true, required: true },
  loggedWork: { type: Types.TextArray }, //A text array of IDs to logged work.
  projectsContributed: {type: Types.TextArray} //A text array of IDs to projects
}, 'Permissions', {
  isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
        return this.isAdmin;
});


/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
