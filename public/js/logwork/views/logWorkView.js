/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'bootstrap-datepicker.min',
  'text!../../../js/logwork/templates/logWork.html',
], function ($, _, Backbone, Datepicker, LogWorkTemplate) {
	'use strict';

	var LogWorkView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#logWorkView', 

		template: _.template(LogWorkTemplate),

		// The DOM events specific to an item.
		events: {
      'click #submitButton': 'logWork'
		},

		initialize: function () {

		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#logWorkView').show();
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function is called when the 'Submit' button is clicked.
    logWork: function() {
      debugger;
      
      //Get handles on the form elements
      var inputDate = $('#logDate');
      var inputWorkType = $('#logWorkType');
      var inputProject = $('#logProject');
      var inputHours = $('#logHour');
      var inputDesc = $('#logDesc');
      
      //Error checking
      if( (inputDate.val() == "") || (inputHours.val() == "") || (inputDesc.val() == "") ) {
        alert('Form is incomplete! Please completely fill out the form and then submit again.');
        return;
      }
      
      //Used for debugging.
      $.get('/api/logwork/list', '', function(data) {
        debugger;
      });
      
      //Create an empty model to store the page data.
      this.model = global.logWorkCollection.models[0].clone();
      this.model.id = "";
      this.model.set('_id', '');
      this.model.attributes.startTime = new Date(inputDate.val());
      this.model.attributes.startTime = this.model.attributes.startTime.toISOString();
      this.model.attributes.endTime = new Date(inputDate.val());
      this.model.attributes.endTime = this.model.attributes.endTime.toISOString();
      this.model.attributes.typeOfWork = inputWorkType.val();
      this.model.attributes.project = "580122a8c0c9875bbafc6330";
      this.model.attributes.hours = Number(inputHours.val());
      this.model.attributes.details = inputDesc.val();
      this.model.attributes.user = userdata._id;
      
      
      
      $.post('/api/logwork/create', this.model.attributes, function(data) {
        debugger;
        console.log('Data created successfully!');
      }).fail(function(err) {
        debugger;
      });
      
      
    }
    
	});

  //debugger;
	return LogWorkView;
});
