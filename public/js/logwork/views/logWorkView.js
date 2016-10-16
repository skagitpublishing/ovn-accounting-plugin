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
      'click #submitButton': 'logWork',
      'change #logProject': 'populateWorkType'
		},

		initialize: function () {

		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#logWorkView').show();
      
      //Populate the Projects drop-down menu with project from the DB.
      if(global.projectCollection.length > 0) {
        //Get a handle on the drop down menu for projects.
        var projectDropDown = this.$el.find('#logProject');
        
        //Remove the dummy options.
        projectDropDown.find('option').remove();
        
        //Populate the drop-down menu.
        for(var i=0; i < global.projectCollection.length;i++) {
          projectDropDown.append('<option>'+global.projectCollection.models[i].get('title')+'</option>');
        }
        
        //Populate the type of work based on the selected project.
        this.populateWorkType();
      }
      
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function is called when the 'Submit' button is clicked.
    logWork: function() {
      //debugger;
      
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
      //$.get('/api/logwork/list', '', function(data) {
      //  debugger;
      //});
      
      //debugger;
      
      //Get the project ID
      var projectIndex = this.projectSelectionToIndex(this.$el.find('#logProject').val());
      var projectId = global.projectCollection.models[projectIndex].get('_id');
      
      //Create an empty model to store the page data.
      this.model = global.logWorkCollection.models[0].clone();
      this.model.id = "";
      this.model.set('_id', '');
      this.model.attributes.startTime = new Date(inputDate.val());
      this.model.attributes.startTime = this.model.attributes.startTime.toISOString();
      this.model.attributes.endTime = new Date(inputDate.val());
      this.model.attributes.endTime = this.model.attributes.endTime.toISOString();
      this.model.attributes.typeOfWork = inputWorkType.val();
      this.model.attributes.project = projectId;
      this.model.attributes.hours = Number(inputHours.val());
      this.model.attributes.details = inputDesc.val();
      this.model.attributes.user = userdata._id;
      
      
      
      $.post('/api/logwork/create', this.model.attributes, function(data) {
        //debugger;
        console.log('Data created successfully!');
        
        var logWorkId = data.loggedwork._id; //The ID of this newly created logWork model.
        var userId = data.loggedwork.user; //The ID of the user associated with this logWork model.
        var projectId = data.loggedwork.project;
        
        //Update the project model with the GUID to this logWork model.
        var projectModel = global.projectCollection.get(projectId);
        var projectWork = projectModel.get('projectWork');
        projectWork.push(logWorkId);
        projectModel.set('projectWork', projectWork);
        
        //Update the project model with the GUID to this contributor.
        var projectContributors = projectModel.get('contributors');
        if(projectContributors.indexOf(userId) == -1) {
          projectContributors.push(userId);
          projectModel.set('contributors', projectContributors);
        }
        
        //Update the model.
        projectModel.save();
        
        //Update the User model with a GUID to this logWork model.
        var userModel = global.userCollection.get(userId);
        var projectsContributed = userModel.get('projectsContributed');
        if(projectsContributed.indexOf(projectId) == -1) {
          projectsContributed.push(projectId);
          userModel.set('projectsContributed', projectsContributed);
        }
        userModel.save();
        
        
        //Refresh the logWork Collection.
        global.logWorkCollection.fetch();
        
        //Clear the window
        debugger;
        
      }).fail(function(err) {
        debugger;
      });
      
      
    },
    
    //This function populated the 'Type of Work' dropdown based on the selected project.
    populateWorkType: function() {
      //debugger;
      
      var projectDropDown = this.$el.find('#logProject');
      var workTypeDropDown = this.$el.find('#logWorkType');
      
      //Get the model index for the currently selected project.
      var projectIndex = this.projectSelectionToIndex(projectDropDown.val());
      
      //Error checking
      if(projectIndex == -1) {
        console.log('Error finding the selected project! populateWorkType()');
        return;
      }
      
      //Get the types of work associate with this project.
      var typesOfWork = global.projectCollection.models[projectIndex].get('typesOfWork');
      
      //Remove any existing options.
      workTypeDropDown.find('option').remove();
      
      //Populate the drop-down list with the types of work.
      for(var i=0; i < typesOfWork.length; i++) {
        workTypeDropDown.append('<option>'+typesOfWork[i]+'</option>');
      }
    },
    
    //This function returns an index to the global.projectCollection model that matches the string value passed as input.
    projectSelectionToIndex: function(dropDownSelection) {
      //debugger;
      
      if((dropDownSelection == undefined) || (dropDownSelection == "") || (typeof(dropDownSelection) != "string")) {
        console.log('Invalid value passed for dropDownSelection in projectSelectionToIndex().');
        return -1;
      }
        
      
      for(var i=0; i < global.projectCollection.length; i++) {
        if(dropDownSelection == global.projectCollection.models[i].get('title'))
          return i;
      }
      
      //Default return value. -1 = not found/invalid
      return -1;
    }
    
	});

  //debugger;
	return LogWorkView;
});
