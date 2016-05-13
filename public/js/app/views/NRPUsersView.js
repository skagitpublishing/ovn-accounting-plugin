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
      
      //Retrieve the model.
      //Have to move this to the global variable so that it is accessible within the anaymous functions below.
      global.userModel = global.nrpUsersCollection.get(id);
      global.csrfToken = "";
      
      //Retrieve the CSRF key
      $.get('http://192.241.198.211:8000/api/usercreation/?format=api', '', function(data) {
        debugger;
        
        var csrfLocationPattern = "name='csrfmiddlewaretoken' value=";
        var csrfLocation = data.indexOf(csrfLocationPattern);
        
        var csrfToken = data.slice(csrfLocation+34, csrfLocation+66);
        
        //Show the new user form
        $('#newUserForm').show();
        
        //Fill out the form
        debugger;
        
        
        /*
        var tempcsrfToken = prompt('csrfToken: ');
        if( tempcsrfToken != "")
          csrfToken = tempcsrfToken;
        
        
        var newUser =
          {
            //"csrfmiddlewaretoken": csrfToken,
            "csrf_token": csrfToken,
            "username": global.userModel.get('username'), 
            "first_name": global.userModel.get('first_name'), 
            "last_name": global.userModel.get('last_name'), 
            "email": global.userModel.get('email'), 
            "password": "rpiovn"
          };
        
        //For debugging purposes:
        global.newUser = newUser;
        
        //$.post('http://192.241.198.211:8000/api/usercreation/', newUser, function(data) {debugger;});
        
        var newForm = new FormData();
        newForm.append('csrfmiddlewaretoken', csrfToken);
        newForm.append('username', global.userModel.get('username'));
        newForm.append('first_name', global.userModel.get('first_name'));
        newForm.append('last_name', global.userModel.get('last_name'));
        newForm.append('email', global.userModel.get('email'));
        newForm.append('password', 'rpiovn');
        
        
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
              debugger;
                //if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              //xhr.setRequestHeader("Content-type","multipart/form-data; boundary=frontier");      
              xhr.setRequestHeader("X-CSRFToken", csrfToken);
                    
              debugger;
                //}
            }
        });
        
        
        
        var opts = {
          url: 'http://192.241.198.211:8000/api/usercreation/?format=api',
          //url: 'http://192.241.198.211:8000/api/usercreation/',
          data: newForm,
          cache: false,
          //contentType: false,
          contentType: "multipart/form-data; boundary=frontier",
          //contentType: "multipart/form-data",
          //contentType: "application/json",
          processData: false,
          type: 'POST',
          success: function(data){
            debugger;
          },
          error: function(jqXHR, msg, exObj) {
            debugger;
          }
        };
                
        debugger;
        
        //Attempt at debugging by sending data via POST AJAX call.
        $.post('http://192.241.198.211:8000/api/usercreation/?format=json', global.newUser, function(data1) {debugger;}, 'json').fail(function(data2){debugger;});
        
        //Execute the AJAX operation.
        //jQuery.ajax(opts);
        */
        
        
      });
    },
    
    deleteUser: function() {
      debugger;
    },
    
    submitNewUserForm: function() {
      debugger;
    }
    

	});

  //debugger;
	return NRPUsersView;
});
