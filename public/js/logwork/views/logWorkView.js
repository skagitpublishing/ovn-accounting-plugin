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
      
      try {
      
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

        //Hide the initial 'Loading...' message.
        this.$el.find('#resultsMessage').hide();

        //this.$el.find('#resultsTable').bootstrapTable({
        this.$el.find('#resultsTable').bootstrapTable({
          sortName: 'date',
          sortOrder: 'desc',
          showExport: false,
          columns: [{
            field: 'date',
            title: 'Date',
            sortable: true
          }, {
            field: 'user',
            title: 'User',
            sortable: true
          }, {
            field: 'project',
            title: 'Project',
            sortable: true
          }, {
            field: 'typeOfWork',
            title: 'Type of Work',
            sortable: true
          }, {
            field: 'hours',
            title: 'Hours',
            sortable: true
          }, {
            field: 'description',
            title: 'Description',
            sortable: true,
            width: '25%'
          }, {
            field: 'edit',
            title: 'Edit',
            sortable: false
          }         
           ],

        });

        this.populateTable();

        return this;
        
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/render() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function is called when the 'Submit' button is clicked.
    logWork: function() {
      try {

        //debugger;

        global.modalView.waitingModal();

        var thisView = this;

        //Get handles on the form elements
        var inputDate = this.$el.find('#logDate');
        var inputWorkType = this.$el.find('#logWorkType');
        var inputProject = this.$el.find('#logProject');
        var inputHours = this.$el.find('#logHour');
        var inputDesc = this.$el.find('#logDesc');

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

        //New log work record.
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
            global.logWorkCollection.refreshView = true;
            global.logWorkCollection.fetch();

            //Clear the window
            thisView.$el.find('#logDate').val("");
            thisView.$el.find('#logWorkType').val("");
            thisView.$el.find('#logProject').val("");
            thisView.$el.find('#logHour').val("");
            thisView.$el.find('#logDesc').val("");

            //Launch the success modal to inform user the work was logged successfully.
            global.modalView.successModal();

          }).fail(function(jqxhr, textStatus, error) {
            debugger;

            try {
              if(jqxhr.responseJSON.detail == "invalid csrf") {
                global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                return;
              } else {
                global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                console.log( "Request Failed: " + error );
                console.error('Error message: '+jqxhr.responseText);
              }
            } catch(err) {
              console.error('Error trying to retrieve JSON data from server response.');
            } 
          });

        //Update an existing log model
        } else {
          //debugger;

          //Move the work entry from one project model to another if the project was changed.
          var originalModel = global.logWorkCollection.get(this.selectedRecord);
          if(originalModel.get('project') != this.model.get('project')) {
            //The project changed, so I need to remove the entry from the previous project.
            debugger;

            var originalProjectId = originalModel.get('project');
            var newProjectId = this.model.get('project');

            var originalProjectModel = global.projectCollection.get(originalProjectId);
            var newProjectModel = global.projectCollection.get(newProjectId);

            var originalProjectWork = originalProjectModel.get('projectWork');
            var originalIndex = originalProjectWork.indexOf(this.selectedRecord);

            //Error Handling
            if(originalIndex == -1) {
              debugger;
              alert('Something went wrong when trying to update log work entry. Original project could not be found!');
              return;
            }

            //Remove the entry from the original project
            originalProjectWork.splice(originalIndex,1); //Remove the entry
            originalProjectModel.set('projectWork', originalProjectWork); //Update the model.
            originalProjectModel.save(); //Save the model

            //Add the entry to the new project
            var newProjectWork = newProjectModel.get('projectWork');
            newProjectWork.push(this.selectedRecord);
            newProjectModel.set('projectWork', newProjectWork);
            newProjectModel.save();

          }

          this.model.id = this.selectedRecord;
          this.model.set('_id', this.selectedRecord);

          //Post to an existing record.
          $.post('/api/logwork/'+this.model.id+'/update', this.model.attributes, function(data) {
            //debugger;

            var logWorkId = data.loggedwork._id; //The ID of this newly created logWork model.
            var userId = data.loggedwork.user; //The ID of the user associated with this logWork model.
            var projectId = data.loggedwork.project;

            console.log('Existing log work model '+logWorkId+' updated successfully!');

            //Flag if the project model needs to be saved.
            //Reduces server calls.
            var projectNeedsSave = false; 

            //12/20/16 CT: This paragraph my be redundent.
            //Update the project model with the GUID to this logWork model, it doesn't already have it.
            var projectModel = global.projectCollection.get(projectId);
            var projectWork = projectModel.get('projectWork');
            //Ensure the entry doesn't already exist. Protect against duplicate entries.
            if(projectWork.indexOf(logWorkId) == -1) { 
              projectWork.push(logWorkId);
              projectModel.set('projectWork', projectWork);  
              projectNeedsSave = true;
            }

            //Update the project model with the GUID to this contributor.
            var projectContributors = projectModel.get('contributors');
            if(projectContributors.indexOf(userId) == -1) {
              projectContributors.push(userId);
              projectModel.set('contributors', projectContributors);
              projectNeedsSave = true;
            }

            if(projectNeedsSave)
              projectModel.save(); //Update the model.

            //Update the User model with a GUID to this logWork model.
            var userModel = global.userCollection.get(userId);
            var projectsContributed = userModel.get('projectsContributed');
            if(projectsContributed.indexOf(projectId) == -1) {
              projectsContributed.push(projectId);
              userModel.set('projectsContributed', projectsContributed);
              userModel.save();
            }

            //Dev Note: I could probably put the code below this in a function, so that it doesn't get
            //duplicated in the other POST call above.

            //Refresh the logWork Collection.
            global.logWorkCollection.refreshView = true;
            global.logWorkCollection.fetch();

            //Clear the window
            //this.$el.find('#logDate').val("");
            //this.$el.find('#logWorkType').val("");
            //this.$el.find('#logProject').val("");
            //this.$el.find('#logHour').val("");
            //this.$el.find('#logDesc').val("");

            //Launch the success modal to inform user the work was logged successfully.
            global.modalView.successModal();

          }).fail(function(jqxhr, textStatus, error) {
            debugger;

            try {
              if(jqxhr.responseJSON.detail == "invalid csrf") {
                global.modalView.errorModal('Update failed due to a bad CSRF token. Please log out and back in to refresh your CSRF token.');
                return;
              } else {
                global.modalView.errorModal("Request failed because of: "+error+'. Error Message: '+jqxhr.responseText);
                console.log( "Request Failed: " + error );
                console.error('Error message: '+jqxhr.responseText);
              }
            } catch(err) {
              console.error('Error trying to retrieve JSON data from server response.');
            } 
          });

          //Clear the global flag.
          this.selectedRecord = undefined;
        }
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/logWork() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    //This function populated the 'Type of Work' dropdown based on the selected project.
    populateWorkType: function() {
      try {
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
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/populateWorkType() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    //This function returns an index to the global.projectCollection model that matches the string value passed as input.
    projectSelectionToIndex: function(dropDownSelection) {
      try {
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
        
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/projectSelectionToIndex() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    loadEntry: function(logWorkModel) {
      try {
        //debugger;

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
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/loadEntry() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    //This function populates the table with all Work Log data.
    populateTable: function() {
      try {
        //debugger;

        var tableData = [];

        var thisUserData = [];

        //Loop through each item in the log work collection.
        for(var i=0; i < global.logWorkCollection.length; i++) {
          var thisModel = global.logWorkCollection.models[i];

          if(thisModel.get('user') == userdata._id) {

            //Store all logWork entries associated with this user.
            thisUserData.push(thisModel);

          //Skip any entries that aren't associated with the currently logged in user.
          } else {
            continue;
          }
        }

        //Sort the log work entries by startTime
        var sortedUserData = this.sortUserData(thisUserData);

        //Display the top 5 results of the sorted work entries.
        for(var i=0; i < 5; i++) {
          var thisModel = sortedUserData[i];

          try {
            var projectName = global.workReportView.getProjectName(thisModel.get('project'));
            var userName = global.workReportView.getUserName(thisModel.get('user'));
            var dateStr = global.workReportView.getDateStr(new Date(thisModel.get('startTime')));
          } catch(err) {
            console.log('Error caught in logWorkView.js/populateTable(). Error: '+err.message);
            this.render();
            return;
          }

          
          
          var lineItem = new Object();
          //lineItem.entry = i;
          lineItem.date = dateStr;
          lineItem.user = userName;
          lineItem.project = projectName;
          lineItem.typeOfWork = thisModel.get('typeOfWork');
          lineItem.hours = thisModel.get('hours');
          lineItem.description = thisModel.get('details');

          //Replace newline characters with html <br> to force new line.
          lineItem.description = lineItem.description.replace(/(\r\n|\n|\r)/gm,"<br>");
          
          //Error Handling
          if(lineItem.description.indexOf('<iframe>') != -1)
            lineItem.description = 'Text contains invalid HTML elements';
          
          if(thisModel.get('user') == userdata._id) {
            lineItem.edit = '<button class="btn btn-small btn-default" onclick="global.logWorkView.editEntry(\''+thisModel.id+'\')" >Edit</button>'  
          } else {
            lineItem.edit = '';
          }


          tableData.push(lineItem);
        }

        this.$el.find('#resultsTable').bootstrapTable('load', tableData);
        log.push('Updated table with work log records.');
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/populateTable() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        alert('There was an error with this page. An error log has been email to the administrator. Please refresh your browser and try again.');
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    //This function sorts an array of log work models by the startTime entry.
    //It returns the same array fed into the the function, only sorted by the startTime entry.
    //Based on mapping example here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    //Dev note: I'm not sure if I want to use this code or not, so I'm leaving it here.
    sortUserData: function(userDataArray) {
      try {
        //debugger;

        //Extract the start time from each model.
        var startTimeArray = [];
        for(var i=0; i < userDataArray.length; i++) {
          var startTimeStr = userDataArray[i].get('startTime');
          var startTimeDate = new Date(startTimeStr);
          startTimeArray.push(startTimeDate);
        }

        // temporary array holds objects with position and sort-value
        var mapped = startTimeArray.map(function(el, i) {
          return { index: i, value: el };
        })

        // sorting the mapped array containing the reduced values
        mapped.sort(function(a, b) {
          return +(a.value < b.value) || +(a.value === b.value) - 1;
        });

        // container for the resulting order
        var result = mapped.map(function(el){
          //return startTimeArray[el.index];
          return userDataArray[el.index];
        });

        //return userDataArray;
        return result;
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/sortUserData() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    },
    
    //This function is called whenever the user clicks on the Edit button next to a work entry.
    //It passes the model for that entry on to the logWorkView, to be edited.
    editEntry: function(id) {
      try {
        //debugger;
        var thisModel = global.logWorkCollection.get(id);
        global.logWorkView.loadEntry(thisModel);
        
      } catch(err) {
        debugger;
        var msg = 'Error in logWorkView.js/editEntry() Error: '+err.message;
        console.error(msg);
        log.push(msg);
        sendLog();
        
        global.modalView.closeModal(); //Hide the modal window if it's open.
      }
    }
    
	});

  //debugger;
	return LogWorkView;
});
