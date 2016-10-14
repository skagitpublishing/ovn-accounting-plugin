define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'bootstrap.min',
  //'js.cookie',
	'../../js/logwork/views/leftMenuView.js',
  '../../js/logwork/views/dashboardView.js',
  '../../js/logwork/views/logWorkView.js',
  '../../js/logwork/model/logWorkModel.js',
  '../../js/logwork/model/logWorkCollection.js',
  '../../js/app/views/modalView.js',
  '../../js/logwork/views/WorkReportView.js',
  'adminlte',
  'logs',
  '../../js/serversettings.js'
//], function ($, _, Backbone, Bootstrap, Cookie,
], function ($, _, Backbone, Bootstrap,
              LeftMenuView, DashboardView, 
              LogWorkView, LogWorkModel, LogWorkCollection, WorkReportView,
              ModalView,
              AdminLTE, Logs, serverData) {

  
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

  
  //Create the modal and render the view.
  global.modalView = new ModalView();
  global.modalView.render();
  
 
  
  if(global.logWorkCollection == undefined) {
    global.logWorkModel = new LogWorkModel();
    
    global.logWorkCollection = new LogWorkCollection();
    global.logWorkCollection.fetch();
  }
  
  
  
  
  log.push('Finished executing logwork_app.js');
  
  
  /*** BEGIN GLOBAL FUNCTIONS ***/
  
  /*** END GLOBAL FUNCTIONS ***/
});
