/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/NRPProjects.html'
], function ($, _, Backbone, NRPProjectsTemplate) {
	'use strict';

	var NRPProjectsView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#nrpProjectsView', 

		template: _.template(NRPProjectsTemplate),

		events: {
 //     'hidden.bs.modal #fileLibraryModal': 'refreshView'
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
      debugger;
      
      //Loop through each model in the collection.
      for( var i = 0; i < global.nrpProjectCollection.length; i++ ) {
      
        try {
          debugger;

          var model = global.nrpProjectCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.nrpProjectCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = this.$el.find('#nrpProjectRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var projectName = model.get('projectname');
          tempRow.find('th').html('<a href="#/">'+projectName+'</a>');
          //tempRow.find('th').find('a').attr('onclick', 'global.nrpUsersView.editPost('+i+')');
          
          //Add the on-click function to the Approve button.
          tempRow.find('.btnApprove').find('button').attr('onclick', 'global.nrpProjectsView.approveProject(global.nrpProjectCollection.models['+i+'].id)');
          
          //Add the on-click function to the Delete button.
          tempRow.find('.btnDelete').find('button').attr('onclick', 'global.nrpUsersView.deleteUser(global.nrpUsersCollection.models['+i+'].id)');
          
          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.nrpProjectsView.$el.find('#nrpProjectsTable').append(tempRow);
        } catch(err) {
          console.error('Error encountered in nrpProjectsView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in nrpProjectsView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
      
    approveProject: function(id) {
      debugger;
        
    
      //Retrieve the model.
      //Have to move this to the global variable so that it is accessible within the anaymous functions below.
      var projectModel = global.nrpProjectCollection.get(id);
      var csrfToken = "";
      
      if( $('#csrfTokenInputForm').find('#csrfTokenInput').val() == "" ) {
        alert('Please fill in the CSRF Token. Can not continue without a valid CSRF token.');
        return;
      }
        
      //Retrieve the CSRF token.
      csrfToken = $('#csrfTokenInputForm').find('#csrfTokenInput').val();
      
      // BEGIN HTML FORM FILL
      $('#newProjectForm').show();
        
      //debugger;
      //Fill out the form
      $('#newProjectForm').find('#nick').val(projectModel.get('projectname'));
      $('#newProjectForm').find('#name').val(projectModel.get('projectname'));
      $('#newProjectForm').find('#email').val("");
      $('#newProjectForm').find('#agent_type').val("http://192.241.198.211:8000/api/agent-types/13/");

      //Fill in the CSRF token
      $('#newAgentForm').find('#csrfmiddlewaretoken').val(csrfToken);
      //END HTML FORM FILL
    
    
    },
    
    //Dev Note: What should happen when the user clicks on the link? Is there properties that they may want to edit? What are they?
    editPost: function(model_index) {
      debugger;
      
    },
    
    uploadFile: function() {
      debugger;
      /*
      var selectedFile = this.$el.find('#file_upload').get(0).files[0];
      
      //Create the FormData data object and append the file to it.
      var newFile = new FormData();
      newFile.append('file_upload', selectedFile); //This is the raw file that was selected

      var opts = {
        url: 'http://'+global.serverIp+':'+global.serverPort+'/api/fileupload/create',
        data: newFile,
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function(data){
          //Dev Note: KeystoneAPI only allows file and image uploads with the file itself. Any extra metadata will have to
          //be uploaded/updated with a second call.
          
          //debugger;
          console.log('File upload succeeded! ID: ' + data.file_upload._id);
          log.push('File upload succeeded! ID: ' + data.file_upload._id);

          //Fill out the file information
          data.file_upload.name = data.file_upload.file.originalname;
          data.file_upload.fileName = data.file_upload.file.originalname;
          data.file_upload.url = 'http://'+global.serverIp+':'+global.serverPort+'/uploads/files/'+data.file_upload.file.filename;
          data.file_upload.fileType = data.file_upload.file.type;
          
          //Update the file with the information above.
          $.get('http://'+global.serverIp+':'+global.serverPort+'/api/fileupload/'+data.file_upload._id+'/update', data.file_upload, function(data) {
            //debugger;
            
            log.push('File information updated.');
            
            //Refresh the Collection.
            //global.fileUploadCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
            global.fileUploadCollection.fetch(); 
            
            //Notify successful upload via modal.
            global.fileLibraryView.$el.find('.modal-sm').find('#waitingGif').hide();
            global.fileLibraryView.$el.find('.modal-sm').find('#successMsg').show();
            //global.fileLibraryView.render();
          })
          //If the metadata update fails:
          .fail(function(data) {
            debugger;
          });
        },
        
        //This error function is called if the POST fails for submitting the file itself.
        error: function(err) {
          //debugger;
          
          global.fileLibraryView.$el.find('.modal-sm').find('#waitingGif').hide();
          global.fileLibraryView.$el.find('.modal-sm').find('#errorMsg').show();
          global.fileLibraryView.$el.find('.modal-sm').find('#errorMsg').html(
            '<p>The file was not uploaded to the server. This is most likely because the server does not accept the selected file TYPE.<br><br>'+
            'Here is the error message from the server: <br>'+
            'Server status: '+err.status+'<br>'+
            'Server message: '+err.statusText+'<br></p>'
          );
          
          
        }
      };

      //Execute the AJAX operation.
      jQuery.ajax(opts);
        
    */
    },
    
    fileSelected: function() {
      //debugger;

    },
    
    //This function is called when the modal has completed closing. It refreshes the View to make sure
    //any new uploaded files appear in the file table.
    refreshView: function() {
      //debugger;
      
      //Fixing bug where modal backdrop stays in place.
      $('.modal-backdrop').hide();
      
      this.render();
    },
    
    
    deleteFile: function(id) {
      debugger;
      $.get('http://'+global.serverIp+':'+global.serverPort+'/api/nrpproject/'+id+'/remove', '', function(data) {
        //debugger;
        
        if( data.success == true ) {
          log.push('FileUpload object deleted successfully. ID: '+id);
          global.fileUploadCollection.refreshView = true; //Set flag so view is refreshed after collection is updated.
          global.fileUploadCollection.fetch();
          //global.fileLibraryView.render();
        } else {
          console.error('FileUpload object no deleted! ID: '+id);
          log.push('FileUpload object no deleted! ID: '+id);
          sendLog();
        }
      })
    }
    

	});

  //debugger;
	return NRPProjectsView;
});
