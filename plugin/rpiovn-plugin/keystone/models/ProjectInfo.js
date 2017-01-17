var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ProjectInfo Model
 * ==========
 */

var ProjectInfo = new keystone.List('ProjectInfo', {
        map: { name: 'title' },
        autokey: { path: 'slug', from: 'title', unique: true },
});

ProjectInfo.add({

  title: { type: String, required: true },
  projectLead: { type: Types.Relationship, ref: 'User'},
  projectContact: { type: Types.Relationship, ref: 'User'},
  
  basicInfo: { type: Types.Html, wysiwyg: true, height: 150 },
  summary: { type: Types.Html, wysiwyg: true, height: 400 },
  description: { type: Types.Html, wysiwyg: true, height: 400 },
  hardware: { type: Types.Html, wysiwyg: true, height: 400 },
  software: { type: Types.Html, wysiwyg: true, height: 400 },
  faq: { type: Types.Html, wysiwyg: true, height: 400 },
  imgUrls: { type: Types.TextArray }

});

ProjectInfo.defaultColumns = 'title';
ProjectInfo.register();

