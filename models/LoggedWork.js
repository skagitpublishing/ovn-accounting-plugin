var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Logged Work Model
 * ==========
 */

var LoggedWord = new keystone.List('LoggedWork');

LoggedWork.add({

        user: { type: Types.Relationship, ref: 'User', index: true },
        typeOfWork: {type: String },
        project: {type: String }, //This will eventually be a relationship to a project model
        startTime: {type: Types.Date},
        endTime: {type: Types.Date},
        details: {type: String},
        hours: {type: Number}
});

LoggedWork.schema.virtual('content.full').get(function () {
        return this.content.extended || this.content.brief;
});

LoggedWork.defaultColumns = 'project, typeOfWork, user';
LoggedWork.register();

//fileList: { type: Types.TextArray }