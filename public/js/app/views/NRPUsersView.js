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
          tempRow.find('.btnApprove1').find('button').attr('onclick', 'global.nrpUsersView.approveUser(global.nrpUsersCollection.models['+i+'].id)');
          
          //Add the on-click function to the Approve button.
          tempRow.find('.btnApprove2').find('button').attr('onclick', 'global.nrpUsersView.approveAgent(global.nrpUsersCollection.models['+i+'].id)');
            
          //Add the on-click function to the Delete button.
          tempRow.find('.btnDelete').find('button').attr('onclick', 'global.nrpUsersView.deleteUser(global.nrpUsersCollection.models['+i+'].id)');
          
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
      var userModel = global.nrpUsersCollection.get(id);
      var csrfToken = "";
      
      if( $('#csrfTokenInputForm').find('#csrfTokenInput').val() == "" ) {
        alert('Please fill in the CSRF Token. Can not continue without a valid CSRF token.');
        return;
      }
        
      //Retrieve the CSRF token.
      csrfToken = $('#csrfTokenInputForm').find('#csrfTokenInput').val();
      
      // BEGIN HTML FORM FILL
      $('#newUserForm').show();
        
      //debugger;
      //Fill out the form
      $('#newUserForm').find('#username').val(userModel.get('username'));
      $('#newUserForm').find('#first_name').val(userModel.get('first_name'));
      $('#newUserForm').find('#last_name').val(userModel.get('last_name'));
      $('#newUserForm').find('#email').val(userModel.get('email'));
      $('#newUserForm').find('#password').val(userModel.get('password'));

      //Fill in the CSRF token
      $('#newUserForm').find('#csrfmiddlewaretoken').val(csrfToken);
      //END HTML FORM FILL
      
      /*
       *  This code was my attempt to use a JavaScript based form to send in the data. It didn't work
       *  because I could never figure out an appropriate way to retrieve and submit the CSRF token.
       *  The code is left here for when I want to revisit this issue in the future.
       */
    /*  
      //Retrieve the CSRF key
      //Note: This technique does not work. Using a get call retrieves a new CSRF token, as though I wasn't logged in.
      $.get('http://192.241.198.211:8000/api/usercreation/?format=api', '', function(data) {
        debugger;
        
        var csrfLocationPattern = "name='csrfmiddlewaretoken' value=";
        var csrfLocation = data.indexOf(csrfLocationPattern);
        
        var csrfToken = data.slice(csrfLocation+34, csrfLocation+66);
        global.csrfToken = csrfToken;
        
        //Show the new user form
        //$('#csrfTokenInputForm').show();
        $('#newUserForm').show();
        
        debugger;
        //Fill out the form
        $('#newUserForm').find('#username').val(global.userModel.get('username'));
        $('#newUserForm').find('#first_name').val(global.userModel.get('first_name'));
        $('#newUserForm').find('#last_name').val(global.userModel.get('last_name'));
        $('#newUserForm').find('#email').val(global.userModel.get('email'));
        $('#newUserForm').find('#password').val(global.userModel.get('password'));
        
        //Fill in the CSRF token
        $('#newUserForm').find('#csrfmiddlewaretoken').val(csrfToken);
      */
        
        //Prompt user for CSRF token.
        //var tempcsrfToken = prompt('csrfToken: ');
        //if( tempcsrfToken != "")
        //  csrfToken = tempcsrfToken;
        
        
        
        //BEGIN AJAX POST SUBMISSION
        /*
        debugger;
        
        //Set the document cookie.
        document.cookie = "csrftoken="+csrfToken;
        
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
              xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        
        var newUser =
          {
            //"csrfmiddlewaretoken": csrfToken,
            "csrf_token": csrfToken,
            "username": userModel.get('username'), 
            "first_name": userModel.get('first_name'), 
            "last_name": userModel.get('last_name'), 
            "email": userModel.get('email'), 
            "password": "rpiovn"
          };
        
        //For debugging purposes:
        global.newUser = newUser;
        
        $.post('http://192.241.198.211:8000/api/usercreation/', newUser, function(data) {debugger;}).fail(function(data2) {debugger;});
        //$.post('http://192.241.198.211:8000/api/usercreation/?format=json', newUser, function(data1) {debugger;}, 'json').fail(function(data2){debugger;});
        */
        //END AJAX POST SUBMISSION
        
        
        
        //BEGIN VIRTUAL FORM
        /*
        debugger;
        
        //Set the document cookie.
        //document.cookie = "csrftoken="+csrfToken;
        
        var newForm = new FormData();
        newForm.append('csrfmiddlewaretoken', csrfToken);
        newForm.append('username', userModel.get('username'));
        newForm.append('first_name', userModel.get('first_name'));
        newForm.append('last_name', userModel.get('last_name'));
        newForm.append('email', userModel.get('email'));
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
          //url: 'http://192.241.198.211:8000/api/usercreation/?format=api',
          url: 'http://192.241.198.211:8000/api/usercreation/',
          data: newForm,
          cache: false,
          //contentType: false,
          //contentType: "multipart/form-data; boundary=frontier",
          contentType: "multipart/form-data; boundary=----WebKitFormBoundaryOLlXzNzdrH4iXGPA",
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
        
        //Execute the AJAX operation.
        jQuery.ajax(opts);
        */
        //END VIRTUAL FORM
        
        
        
      //});
    },
    
    
    deleteUser: function(id) {
      debugger;
      
      $.get('http://'+global.serverIp+':'+global.serverPort+'/api/nrpuser/'+id+'/remove', '', function(data) {
        debugger;
        
        if(data.success) {
          //Set the refresh flag so that this view is refreshed after the collection is updated.
          global.nrpUsersCollection.refreshView = true;
        
          //Reset the NRP Users Collection
          global.nrpUsersCollection.fetch();
          
        }
        
      })

    },
      
    approveAgent: function(id) {
      debugger;
    
      //Retrieve the model.
      //Have to move this to the global variable so that it is accessible within the anaymous functions below.
      var userModel = global.nrpUsersCollection.get(id);
      var csrfToken = "";
      
      if( $('#csrfTokenInputForm').find('#csrfTokenInput').val() == "" ) {
        alert('Please fill in the CSRF Token. Can not continue without a valid CSRF token.');
        return;
      }
        
      //Retrieve the CSRF token.
      csrfToken = $('#csrfTokenInputForm').find('#csrfTokenInput').val();
      
      // BEGIN HTML FORM FILL
      $('#newAgentForm').show();
        
      //debugger;
      //Fill out the form
      $('#newAgentForm').find('#nick').val(userModel.get('username'));
      $('#newAgentForm').find('#name').val(userModel.get('first_name') + ' ' + userModel.get('last_name'));
      //$('#newAgentForm').find('#last_name').val(userModel.get('last_name'));
      $('#newAgentForm').find('#email').val(userModel.get('email'));
      //$('#newAgentForm').find('#password').val(userModel.get('password'));

      //Fill in the CSRF token
      $('#newUserForm').find('#csrfmiddlewaretoken').val(csrfToken);
      //END HTML FORM FILL
    }
    
    /*
    submitNewUserForm: function() {
      debugger;
    }
    */
    

	});
    
  //debugger;
	return NRPUsersView;
});
