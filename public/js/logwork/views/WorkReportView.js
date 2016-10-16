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
        }],

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
        
        var lineItem = new Object();
        lineItem.date = new Date(thisModel.get('startTime'));
        lineItem.user = thisModel.get('user');
        lineItem.project = projectName;
        lineItem.typeOfWork = thisModel.get('typeOfWork');
        lineItem.hours = thisModel.get('hours');
        lineItem.description = thisModel.get('details');
        
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
    getProjectName(projectId) {
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
    getUserName(userId) {
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
	return WorkReportView;
});
