/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/logwork/templates/projects.html',
  'Chart.2.3.0'
], function ($, _, Backbone, ProjectTemplate, Chart) {
	'use strict';

	var ProjectView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#projectView', 

		template: _.template(ProjectTemplate),

		// The DOM events specific to an item.
		events: {
      'change #projectList': 'graphProject'
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
          this.$el.find('#projectList').append('<option>'+tempProj.get('title')+'</option>');
        }        
      }
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function is called whenever the #projectList drop-down box is changed. It graphs the currently selected project.
    graphProject: function() {
      //debugger;
      
      var projTitle = this.$el.find('#projectList').val();
      
      //Error Handling
      if(projTitle == "")
        return;
      
      //Get the project model for this project.
      var projModel = global.projectCollection.models[this.projectSelectionToIndex(projTitle)];
      
      //Create the pie chart
      this.drawPieChart(projModel);
      
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
    },
    
    //This function draws a pie chart on the view. It expects to be given a project model as input.
    drawPieChart: function(projModel) {
      //debugger;
      
      var projectStats = this.getProjectStats(projModel.get('projectWork'));
      
      //Convert UserIDs to User Names
      var userNames = [];
      for(var i=0; i < projectStats.users.length; i++) {
        userNames[i] = this.getUserName(projectStats.users[i]);
      }
      
      //Create the table
      var table = this.$el.find('#projectTable');
      table.find('tr').remove(); //Clear the table of any previously created rows.
      for(var i=0; i < projectStats.users.length; i++) {
        var htmlStr = "<tr><td>";
        htmlStr += userNames[i];
        htmlStr += '</td><td>'+projectStats.userHours[i];
        htmlStr += "</td></tr>";
        table.append(htmlStr);
      }
      //Append the bottom of the table with a total of hours
      table.append('<tr><td><b>Total</b></td><td><b>'+projectStats.totalHours+'</b></td></tr>');
      
      
      
      //http://www.chartjs.org/docs/#doughnut-pie-chart
      var ctx = this.$el.find('#pieChart');
      this.myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: userNames,
            datasets: [
                {
                    data: projectStats.userHours,
                    backgroundColor: [
                      //http://www.elizabethcastro.com/html/colors/sixteencolors.html
                      "#0000FF", //Blue
                      "#800080", //Purple
                      "#008000", //Green
                      "#FF0000", //Red
                      "#C0C0C0", //Silver
                      "#00FFFF", //Aqua
                      "#000000", //Black
                      "#FF00FF", //Fuchsia
                      "#808080", //Grey
                      "#00FF00", //Lime
                      "#800000", //Maroon
                      "#000080", //Navy
                      "#808000", //Olive
                      "#008080", //Teal
                      "#FFFFFF", //White
                      "#FFFF00", //Yellow
                    ],
                    hoverBackgroundColor: [
                      "#0000FF", //Blue
                      "#800080", //Purple
                      "#008000", //Green
                      "#FF0000", //Red
                      "#C0C0C0", //Silver
                      "#00FFFF", //Aqua
                      "#000000", //Black
                      "#FF00FF", //Fuchsia
                      "#808080", //Grey
                      "#00FF00", //Lime
                      "#800000", //Maroon
                      "#000080", //Navy
                      "#808000", //Olive
                      "#008080", //Teal
                      "#FFFFFF", //White
                      "#FFFF00", //Yellow
                    ]
                }]
          },
      });
    },
    
    //This function expects an array of LogWork model GUIDs.
    //It returns a 'stats' object containing the total hours worked, the users, and the number of hours per user.
    getProjectStats: function(workArray) {
      //debugger;
      
      var stats = new Object();
      stats.totalHours = 0;
      stats.users = [];
      stats.userHours = [];
      
      //Loop through the workArray and analyze each logWork model in it.
      for(var i=0; i < workArray.length; i++) {
        var logWorkModel = global.logWorkCollection.get(workArray[i]);
        
        //Add the hours in this model to the total hours;
        stats.totalHours += logWorkModel.get('hours');
        
        //Add the user ID to the stats.users array if it's not already there.
        var userIndex = stats.users.indexOf(logWorkModel.get('user'));
        if(userIndex == -1) {
          stats.users.push(logWorkModel.get('user'));
          stats.userHours.push(logWorkModel.get('hours'));
        
        //If they are there, add the hours to that user.
        } else {
          stats.userHours[userIndex] += logWorkModel.get('hours');
        }
        
        //debugger;
      }
      
      return stats;
    },
    
    //This function returns the name of a user based on the input string which should contain a user GUID.
    //This function returns "Not Found" if a projectId could not be found.
    getUserName: function(userId) {
      //debugger;
      
      var outStr = "Not Found";
      
      try {
        var model = global.userCollection.get(userId);  
        
        var name = model.get('name');
        outStr = name.first+' '+name.last;
        
      } catch(err) {
        debugger;
        console.log('Catestrophic error in WorkReportView.js/getUserName()');
      }
      
      return outStr;
    }
    
	});

  //debugger;
	return ProjectView;
});
