/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  
  //https://github.com/hhurz/tableExport.jquery.plugin
  '/js/lib/tableExport.js',
  '/js/lib/jquery.base64.js',
  '/js/lib/FileSaver.min.js',
  '/js/lib/xlsx.core.min.js',
  
  'text!../../../js/logwork/templates/WorkReport.html',
  '/js/lib/bootstrap-table.js',
  '/js/lib/bootstrap-table-export.js',
], function ($, _, Backbone, 
              TableExport, jQueryBase64, FileSave, XLSXCore,
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
      debugger;
      
      this.$el.html(this.template);
      
      $('#WorkReportView').show();
      
      //Hide the initial 'Loading...' message.
      this.$el.find('#resultsMessage').hide();
      
      //this.$el.find('#resultsTable').bootstrapTable({
      $('#resultsTable').bootstrapTable({
        sortName: 'date',
        sortOrder: 'desc',
        showExport: true,
        exportDataType: 'selected',
        exportType: ['csv', 'excel', 'json', 'txt'],
        exportOptions: {
          fileName: 'RPiOVN-Work-Log',
          type: 'csv'
        },
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
      
			return this;
		},
    
    openModal: function() {
      //debugger;
      //global.modalView.render();
      global.modalView.openModal();
    },
    
    //This function populates the table with all Work Log data.
    populateTable: function() {
      debugger;
      
      var tableData = [];
      
      //Loop through each item in the log work collection.
      for(var i=0; i < global.logWorkCollection.length; i++) {
        var thisModel = global.logWorkCollection.models[i];
        
        var lineItem = new Object();
        lineItem.date = new Date(thisModel.get('startTime'));
        lineItem.user = thisModel.get('user');
        lineItem.project = thisModel.get('project');
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
      $('#resultsTable').tableExport({
        type: 'csv', 
        fileName: 'test',
        htmlContent: false
      });
    }
    
    
	});

  //debugger;
	return WorkReportView;
});
