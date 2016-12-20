/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  
  //https://github.com/hhurz/tableExport.jquery.plugin
  //'/js/lib/tableExport.js',
  //'/js/lib/jquery.base64.js',
  //'/js/lib/FileSaver.min.js',
  //'/js/lib/xlsx.core.min.js',
  
  //https://github.com/clarketm/TableExport
  '/js/lib/file-saver.js',
  '/js/lib/tableexport.min.js',
  '/js/lib/xlsx.js',
  
  'text!../../../js/logwork/templates/WorkReport.html',
  '/js/lib/bootstrap-table.js',
  '/js/lib/bootstrap-table-export.js',
], function ($, _, Backbone, 
              //TableExport, jQueryBase64, FileSave, XLSXCore,
              FileSaver, TableExport, XLSX,
              WorkReportTemplate, BootstrapTable, BootstrapTableExport) {
	'use strict';

	var WorkReportView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#workReportView', 

		template: _.template(WorkReportTemplate),

		// The DOM events specific to an item.
		events: {
      'click #exportButton': 'exportTable'
		},

		initialize: function () {

     
		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#WorkReportView').show();
      
      //Hide the initial 'Loading...' message.
      this.$el.find('#resultsMessage').hide();
      
      //this.$el.find('#resultsTable').bootstrapTable({
      $('#resultsTable').bootstrapTable({
        sortName: 'date',
        sortOrder: 'desc',
        //showExport: true,
        //exportDataType: 'selected',
        //exportType: ['csv', 'excel', 'json', 'txt'],
        //exportOptions: {
        //  fileName: 'RPiOVN-Work-Log',
        //  type: 'csv'
        //},
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
            sortable: true
        }, {
            field: 'edit',
            title: 'Edit',
            sortable: false
        }         
         ],

      });
      
      this.populateTable();
      $('#resultsTable').tableExport();
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function populates the table with all Work Log data.
    populateTable: function() {
      //debugger;
      
      var tableData = [];
      
      //Loop through each item in the log work collection.
      for(var i=0; i < global.logWorkCollection.length; i++) {
        var thisModel = global.logWorkCollection.models[i];
        
        var projectName = this.getProjectName(thisModel.get('project'));
        var userName = this.getUserName(thisModel.get('user'));
        var dateStr = this.getDateStr(new Date(thisModel.get('startTime')));
        
        var lineItem = new Object();
        lineItem.date = dateStr;
        lineItem.user = userName;
        lineItem.project = projectName;
        lineItem.typeOfWork = thisModel.get('typeOfWork');
        lineItem.hours = thisModel.get('hours');
        lineItem.description = thisModel.get('details');
        
        if(thisModel.get('user') == userdata._id) {
          lineItem.edit = '<button class="btn btn-small btn-default" onclick="global.workReportView.editEntry(\''+i+'\')" >Edit</button>'  
        } else {
          lineItem.edit = '';
        }
        
        
        tableData.push(lineItem);
      }
      
      $('#resultsTable').bootstrapTable('load', tableData);
      log.push('Updated table with work log records.');
    },
    
    exportTable: function() {
      debugger;
      
      //https://github.com/hhurz/tableExport.jquery.plugin
      //$('#resultsTable').tableExport({
      //  type: 'csv', 
      //  fileName: 'test',
      //  htmlContent: false
      //});
      
    },
    
    //This function returns the name of a project based on the input string which should contain a project GUID.
    //This function returns "Not Found" if a projectId could not be found.
    getProjectName: function(projectId) {
      //debugger;
      
      var outStr = "Not Found";
      
      try {
        var model = global.projectCollection.get(projectId);  
        
        outStr = model.get('title');
      } catch(err) {
        debugger;
        console.log('Catestrophic error in WorkReportView.js/getProjectName()');
      }
      
      return outStr;
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
    },
    
    //This function converts an inpute Date object into a string corresponding the MM-DD-YY
    getDateStr: function(dateIn) {
      //debugger;
      
      var date = '00'+(dateIn.getUTCDate());
      date = date.slice(-2);
      
      var month = '00'+(dateIn.getUTCMonth()+1);
      month = month.slice(-2);
      
      var year = dateIn.getFullYear().toString();
      year = year.slice(-2);
      
      return month+'-'+date+'-'+year;
    },
    
    //This function is called whenever the user clicks on the Edit button next to a work entry.
    //It passes the model for that entry on to the logWorkView, to be edited.
    editEntry: function(i) {
      //debugger;
      var thisModel = global.logWorkCollection.models[i];
      global.logWorkView.loadEntry(thisModel);
    }
    
    
	});

  //debugger;
	return WorkReportView;
});
