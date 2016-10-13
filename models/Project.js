var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Logged Work Model
 * ==========
 */

var Project = new keystone.List('Project', {
        map: { name: 'title' },
        autokey: { path: 'slug', from: 'title', unique: true },
});

Project.add({

        title: { type: String, required: true },
        projectLead: { type: Types.Relationship, ref: 'User'},
        content: {
                brief: { type: Types.Html, wysiwyg: true, height: 150 },
                extended: { type: Types.Html, wysiwyg: true, height: 400 },
        },
        projectContact: { type: Types.Relationship, ref: 'User'},
        contributors: { type: Types.TextArray } //An array of IDs of users that have contributed to the project.

});

Project.schema.virtual('content.full').get(function () {
        return this.content.extended || this.content.brief;
});

Project.defaultColumns = 'title';
Project.register();

