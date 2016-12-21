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
  '/js/lib/bootstrap-table.js',
  'adminlte',
  'logs',
  '../../js/serversettings.js'
//], function ($, _, Backbone, Bootstrap, Cookie,
], function (_, Backbone, //Bootstrap,
              LeftMenuView, DashboardView, 
              LogWorkView, LogWorkModel, LogWorkCollection, WorkReportView, ProjectModel, ProjectCollection, UserModel, UserCollection,
              ProjectView,
              ModalView,
              BootstrapTable, AdminLTE, Logs, serverData) {

  
  //Global Variables
  global = new Object(); //This is where all global variables will be stored.  
  global.serverIp = serverData.serverIp; 
  global.serverPort = serverData.serverPort;
  global.privatePagesSection = serverData.privatePagesSection;
  global.nrpPort = "8000";
  global.nodemailerPort = "3000";
  var csrftoken = ""; //Will host the CSRF token for POST calls.
  
  //TinyMCE state.
  global.tinymce = new Object();
  global.tinymce.initialized = false;
  global.tinymce.currentModelIndex = null;
  global.tinymce.selectedImage = null;
  
  //debugger;
  
  detectBrowser(); //Log the current browser and OS being used.
  
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
  
  
  log.push('Finished executing logwork_app.js');
  
  
  /*** BEGIN GLOBAL FUNCTIONS ***/
  
  /*** END GLOBAL FUNCTIONS ***/
});
