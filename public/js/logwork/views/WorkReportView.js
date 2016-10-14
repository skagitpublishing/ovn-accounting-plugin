/*global define*/
//Define libraries this file depends on.
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',  
  'text!../../../js/logwork/templates/WorkReport.html',
  '/js/lib/bootstrap-table.js',
  '/js/lib/bootstrap-table-export.js',
], function ($, _, Backbone, WorkReportTemplate, BootstrapTable, BootstrapTableExport) {
	'use strict';

	var WorkReportView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#workReportView', 

		template: _.template(WorkReportTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

      //Hide the initial 'Loading...' message.
      this.$el.find('#resultsMessage').hide();
      
      this.$el.find('#resultsTable').bootstrapTable({
          sortName: 'date',
          sortOrder: 'desc',
          showExport: true,
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
		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);
      
      $('#WorkReportView').show();
      
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
        var thisModel = global.logWorkCollection.get(0);
        
        var lineItem = new Object();
        lineItem.date = thisModel.get('date');
        lineItem.user = "";
        lineItem.project = "";
        lineItem.typeOfWork = "";
        lineItem.hours = "";
        lineItem.description = "";
        
        tableData.push(lineItem);
      }
      
      this.$el.find('#resultsTable').bootstrapTable('load', tableData);
      log.push('Updated table with work log records.');
    }
    
    
	});

  //debugger;
	return WorkReportView;
});
