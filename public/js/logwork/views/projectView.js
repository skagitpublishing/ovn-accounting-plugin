/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/logwork/templates/projects.html',
  'Chart.min'
], function ($, _, Backbone, ProjectTemplate, Chart) {
	'use strict';

	var ProjectView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#projectView', 

		template: _.template(ProjectTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#projectView').show();
      
      //Populate the drop-down list with the projects
      for(var i=0; i < global.projectCollection.length; i++) {
        var tempProj = global.projectCollection.models[i];
        var projectWork = tempProj.get('projectWork');
        
        //Only add the project to the list if it has work logged against it.
        if(projectWork.length > 0) {
          this.$el.find('#projetList').append('<option>'+tempProj.get('title')+'</option>');
        }        
      }
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    }
    
	});

  //debugger;
	return ProjectView;
});
