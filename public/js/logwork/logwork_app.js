define([
	//'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  //'bootstrap.3.3.6',
  //'js.cookie',
	'../../js/logwork/views/leftMenuView.js',
  '../../js/logwork/views/dashboardView.js',
  '../../js/logwork/views/logWorkView.js',
  '../../js/logwork/model/logWorkModel.js',
  '../../js/logwork/model/logWorkCollection.js',
  '../../js/logwork/views/WorkReportView.js',
  '../../js/logwork/model/projectModel.js',
  '../../js/logwork/model/projectCollection.js',
  '../../js/logwork/model/userModel.js',
  '../../js/logwork/model/userCollection.js',
  '../../js/logwork/views/projectView.js',
  '../../js/app/views/modalView.js',
  '../../js/logwork/views/editProfile.js',
  //'/js/lib/bootstrap-table.js',
  'adminlte',
  'logs'
//], function ($, _, Backbone, Bootstrap, Cookie,
], function (_, Backbone, //Bootstrap,
              LeftMenuView, DashboardView, 
              LogWorkView, LogWorkModel, LogWorkCollection, WorkReportView, ProjectModel, ProjectCollection, UserModel, UserCollection,
              ProjectView,
              ModalView, EditProfileView,
              AdminLTE, Logs) {

  
  //Global Variables
  global = new Object(); //This is where all global variables will be stored.  
  //global.serverIp = serverData.serverIp; 
  //global.serverPort = serverData.serverPort;
  //global.privatePagesSection = serverData.privatePagesSection;
  //global.nrpPort = "8000";
  //global.nodemailerPort = "3000";
  //var csrftoken = ""; //Will host the CSRF token for POST calls.
  
  //TinyMCE state.
  global.tinymce = new Object();
  global.tinymce.initialized = false;
  global.tinymce.currentModelIndex = null;
  global.tinymce.selectedImage = null;
  
  //debugger;
  
  detectBrowser(); //Log the current browser and OS being used.
  
  
  if(global.logWorkCollection == undefined) {
    global.logWorkModel = new LogWorkModel();
    
    global.logWorkCollection = new LogWorkCollection();
    global.logWorkCollection.fetch();
  }
  
  if(global.projectCollection == undefined) {
    global.projectModel = new ProjectModel();
    
    global.projectCollection = new ProjectCollection();
    global.projectCollection.fetch();
  }
  
  if(global.userCollection == undefined) {
    global.userModel = new UserModel();
    
    global.userCollection = new UserCollection();
    global.userCollection.fetch();
  }
  
  
  global.leftMenuView = new LeftMenuView();
  global.leftMenuView.render();

  
  //Initialize the dashboard
  global.dashboardView = new DashboardView();
  //debugger;
  global.dashboardView.render();
  
  global.logWorkView = new LogWorkView();
  global.workReportView = new WorkReportView();
  global.projectView = new ProjectView();
  
  //Create the modal and render the view.
  global.modalView = new ModalView();
  global.modalView.render();
  
  global.editProfileView = new EditProfileView();
 
  //Load the user name and avatar
  global.updateAvatar = function() {
    if(userdata) {
      //debugger;

      if(userdata.avatarUrl) {
        $('.user-menu').find('img').attr('src', userdata.avatarUrl);
      }

      $('.user-header').find('p').text(userdata.name.first+' '+userdata.name.last);
      $('.user-menu').find('span').html('<span>'+userdata.name.first+'  <i class="fa fa-caret-square-o-down"></i></span>');
    }
  };
  global.updateAvatar();
  
  //Get the public settings JSON file..
  $.getJSON('/js/publicsettings.json', '', function(data) {
    //debugger;
    global.privatePagesSection = data.privatePagesSection;
  })
  //If sending the data to the server fails:
  .fail(function( jqxhr, textStatus, error ) {
    debugger;

    console.error('Error trying to retrieve JSON data from /js/publicsettings.js');
  });
  
  //Hide the preloader after everything finished loading and document is ready.
  $(document).ready(function() {
    $('#loader-wrapper').hide();
  });
  
  log.push('Finished executing logwork_app.js');
  
  
  /*** BEGIN GLOBAL FUNCTIONS ***/
  
  /*** END GLOBAL FUNCTIONS ***/
});
