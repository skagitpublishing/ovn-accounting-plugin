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
      this.selectedRecord = undefined;
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
      
      
      if(this.selectedRecord == undefined) {

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
          $('#logDate').val("");
          $('#logWorkType').val("");
          $('#logProject').val("");
          $('#logHour').val("");
          $('#logDesc').val("");

          //Launch the success modal to inform user the work was logged successfully.
          global.modalView.successModal();

        }).fail(function(err) {
          debugger;
        });
      
      //Update an existing log model
      } else {
        debugger;
        
        //Compare the changes
        var originalModel = global.logWorkCollection.get(this.selectedRecord);
        if(originalModel.get('project') != this.model.get('project')) {
          //The project changed, so I need to remove the entry from the previous project.
          debugger;
        }
        
        this.model.id = this.selectedRecord;
        this.model.set('_id', this.selectedRecord);
        
        //Post to an existing record.
        $.post('/api/logwork/'+this.model.id+'/update', this.model.attributes, function(data) {
          debugger;
          
          var logWorkId = data.loggedwork._id; //The ID of this newly created logWork model.
          var userId = data.loggedwork.user; //The ID of the user associated with this logWork model.
          var projectId = data.loggedwork.project;
          
          console.log('Existing log work model '+logWorkId+' updated successfully!');
          
          
          //Update the project model with the GUID to this logWork model, it doesn't already have it.
          var projectModel = global.projectCollection.get(projectId);
          var projectWork = projectModel.get('projectWork');
          //Ensure the entry doesn't already exist. Protect against duplicate entries.
          if(projectWork.indexOf(logWorkId) == -1) { 
            projectWork.push(logWorkId);
            projectModel.set('projectWork', projectWork);  
          }
          
          
          //Update the project model with the GUID to this contributor.
          var projectContributors = projectModel.get('contributors');
          if(projectContributors.indexOf(userId) == -1) {
            projectContributors.push(userId);
            projectModel.set('contributors', projectContributors);            
          }
          projectModel.save(); //Update the model.
          
          
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
          $('#logDate').val("");
          $('#logWorkType').val("");
          $('#logProject').val("");
          $('#logHour').val("");
          $('#logDesc').val("");

          //Launch the success modal to inform user the work was logged successfully.
          global.modalView.successModal();
          
        }).fail(function(err) {
          debugger;
        });
        
        
        //Clear the global flag.
        this.selectedRecord = undefined;
      }
      
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
      
      //Error checking.
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
    },
    
    loadEntry: function(logWorkModel) {
      debugger;
      
      //this.render();
      global.leftMenuView.showLogWork();
      
      //Signal to the 'submit button' that this is an existing record.
      this.selectedRecord = logWorkModel.id;
      
      this.$el.find('#logDate').val(logWorkModel.get('endTime')); //The date of the entry
      
      //Select the correct project from the drop-down menu
      var projId = logWorkModel.get('project');
      var projModel = global.projectCollection.get(projId);
      this.$el.find('#logProject').val(projModel.get('title'));

      //Populate the type of work based on the selected project.
      this.populateWorkType();
      
      this.$el.find('#logWorkType').val(logWorkModel.get('typeOfWork')); //The type of work
      
      this.$el.find('#logHour').val(logWorkModel.get('hours')); //Hours worked
      
      this.$el.find('#logDesc').val(logWorkModel.get('details')); //Work Description
      
    }
    
	});

  //debugger;
	return LogWorkView;
});
