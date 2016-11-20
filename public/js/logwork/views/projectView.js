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
      
      //Create the horizontal bar chart
      this.drawHorzBarChart(projModel, projTitle);
      
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
      
      //Remove any previously created chart.
      if(this.pieChart != undefined)
        this.pieChart.destroy();
      
      this.pieChart = new Chart(ctx, {
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
    
    drawHorzBarChart: function(projModel, projTitle) {
      debugger;
      
      var projectStats = this.getProjectStats(projModel.get('projectWork'));
      
      //Convert UserIDs to User Names
      var userNames = [];
      for(var i=0; i < projectStats.users.length; i++) {
        userNames[i] = this.getUserName(projectStats.users[i]);
      }
      
      //http://www.chartjs.org/docs/#bar-chart
      var ctx2 = this.$el.find('#barChart');
      
      //Remove any previously created chart.
      if(this.barChart != undefined)
        this.barChart.destroy();
      
      this.barChart = new Chart(ctx2, {
          type: 'horizontalBar',
          data: {
            labels: userNames,
            datasets: [
                {
                    data: projectStats.userHours,
                    label: projTitle,
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
          options: {
            scales: {
              xAxes: [{
                display: true,
                stacked: true,
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
      });
      
      
      //http://www.chartjs.org/docs/#bar-chart
      var ctx3 = this.$el.find('#testChart');
      
      //Remove any previously created chart.
      if(this.testChart != undefined)
        this.testChart.destroy();
      
      //Chart options
      var barOptions_stacked = {
        tooltips: {
            enabled: true
        },
        //hover :{
        //    animationDuration:0
        //},
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize:11
                },
                scaleLabel:{
                    display:false
                },
                gridLines: {
                }, 
                stacked: true
            }],
            yAxes: [{
                gridLines: {
                    display:false,
                    color: "#fff",
                    zeroLineColor: "#fff",
                    zeroLineWidth: 0
                },
                ticks: {
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize:11
                },
                stacked: true,
                barThickness: 10
            }]
        },
        legend:{
            display:true
        },
        /*
        animation: {
            onComplete: function () {
                var chartInstance = this.chart;
                var ctx = chartInstance.ctx;
                ctx.textAlign = "left";
                ctx.font = "9px Open Sans";
                ctx.fillStyle = "#fff";

                Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    Chart.helpers.each(meta.data.forEach(function (bar, index) {
                        data = dataset.data[index];
                        if(i==0){
                            ctx.fillText(data, 50, bar._model.y+4);
                        } else {
                            ctx.fillText(data, bar._model.x-25, bar._model.y+4);
                        }
                    }),this)
                }),this);
            }
        },
        */
        pointLabelFontFamily : "Quadon Extra Bold",
        scaleFontFamily : "Quadon Extra Bold",
      };
      
      this.testChart = new Chart(ctx3, {
        type: 'horizontalBar',
        data: {
            labels: ["Tim", "Sally", "Bob", "Shelly"],

            datasets: [{
                data: [727, 589, 537, 543],
                label: 'Hours Worked 1',
                backgroundColor: "rgba(63,103,126,1)",
                hoverBackgroundColor: "rgba(50,90,100,1)"
            },{
                data: [238, 553, 746, 884],
                label: 'Hours Worked 2',
                backgroundColor: "rgba(163,103,126,1)",
                hoverBackgroundColor: "rgba(140,85,100,1)"
            },{
                data: [1238, 553, 746, 884],
                label: 'Hours Worked 3',
                backgroundColor: "rgba(63,203,226,1)",
                hoverBackgroundColor: "rgba(46,185,235,1)"
            }]
        },
        
        options: barOptions_stacked,
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
