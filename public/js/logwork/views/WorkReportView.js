/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/logwork/templates/WorkReport.html',
], function ($, _, Backbone, WorkReportTemplate) {
	'use strict';

	var WorkReportView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#workReportView', 

		template: _.template(WorkReportTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#WorkReportView').show();
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    }
    
	});

  //debugger;
	return WorkReportView;
});
