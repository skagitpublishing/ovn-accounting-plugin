/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/NRPUsers.html'
], function ($, _, Backbone, NRPUsersTemplate) {
	'use strict';

	var NRPUsersView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#nrpUsersView', 

		template: _.template(NRPUsersTemplate),

		events: {
      'hidden.bs.modal #nrpUsersModal': 'refreshView'
		},

		initialize: function () {
			
		},

    render: function () {
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Loop through each model in the collection.
      for( var i = 0; i < global.nrpUsersCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.nrpUsersCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.nrpUsersCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.nrpUsersView.$el.find('#nrpUserRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var userName = model.get('username');
          tempRow.find('th').html('<a href="#/">'+userName+'</a>');
          //tempRow.find('th').find('a').attr('onclick', 'global.nrpUsersView.editPost('+i+')');
          
          //Add the on-click function to the Approve button.
          tempRow.find('.btnApprove').find('button').attr('onclick', 'global.nrpUsersView.approveUser(global.nrpUsersCollection.models['+i+'].id)');
          
          //Add the on-click function to the Delete button.
          //tempRow.find('.postCol4').find('button').attr('onclick', 'global.nrpUsersView.deleteFile(global.nrpUsersCollection.models['+i+'].id)');
          
          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.nrpUsersView.$el.find('#nrpUsersTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in nrpUsersView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in nrpUsersView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
    
    //Dev Note: What should happen when the user clicks on the link? Is there properties that they may want to edit? What are they?
    editPost: function(model_index) {
      debugger;
      
    },
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //Fixing bug where modal backdrop stays in place.
      $('.modal-backdrop').hide();
      
      this.render();
    },

    approveUser: function(id) {
      debugger;
    },
    
    deleteUser: function() {
      debugger;
    }
    

	});

  //debugger;
	return NRPUsersView;
});
