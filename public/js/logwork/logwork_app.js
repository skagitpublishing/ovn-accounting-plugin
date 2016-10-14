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
  debugger;
  global.workReportView = new WorkReportView();
  
  //global.pagesView = new PagesView();
  //global.postsView = new PostsView();
  
  //global.imageLibraryView = new ImageLibraryView();
  
  //global.imageAddNewView = new ImageAddNewView();
  
  //global.pagesAddNewView = new PagesAddNewView();
  //global.postsAddNewView = new PostsAddNewView();
  
  //global.fileLibraryView = new FileLibraryView();
  
  //global.categoriesView = new CategoriesView();
  //global.sectionsView = new SectionsView();
  
  //Create the modal and render the view.
  global.modalView = new ModalView();
  global.modalView.render();
  
  
  //Generate the ImageUpload Collection if it hasn't been created yet.
  //if(global.imageUploadCollection == undefined) {
    //debugger;
  //  global.imageUploadCollection = new ImageUploadCollection(); //Collection Instance
  //  global.imageUploadCollection.fetch();
  //}
  
  //POST MODEL AND COLLECTION
  //Generate the Post Collection if it hasn't been created yet.
  //if(global.postsCollection == undefined) {

 //   global.postModel = new PostModel();

  //  global.postsCollection = new PostsCollection(); //Collection Instance
  //  global.postsCollection.fetch(); 
  //}
  
  if(global.logWorkCollection == undefined) {
    global.logWorkModel = new LogWorkModel();
    
    global.logWorkCollection = new LogWorkCollection();
    global.logWorkCollection.fetch();
  }
  
  
  //POST CATEGORY MODEL AND COLLECTION
  //Generate the PostCategory Collection if it hasn't been created yet.
  //if(global.postCategoryCollection == undefined) {
    //debugger;

  //  global.postCategoryModel = new PostCategoryModel();

  //  global.postCategoryCollection = new PostCategoryCollection(); //Collection Instance
  //  global.postCategoryCollection.fetch(); 
  //}
  
  //FILE UPLOAD MODEL AND COLLECTION
  //if(global.fileUploadCollection == undefined) {
    //debugger;
  //  global.fileUploadCollection = new FileUploadCollection(); //Collection Instance
  //  global.fileUploadCollection.fetch();
  //}
  
  //PAGE MODEL AND COLLECITON
  //Generate the Post Collection if it hasn't been created yet.
  //if(global.pagesCollection == undefined) {

  //  global.pageModel = new PageModel();

  //  global.pagesCollection = new PagesCollection(); //Collection Instance
  //  global.pagesCollection.fetch(); 
  //}
  
  //PAGE SECTION MODEL AND COLLECTION
  //Generate the PageSection Collection if it hasn't been created yet.
  //if(global.pageSectionCollection == undefined) {
    //debugger;

  //  global.pageSectionModel = new PageSectionModel();

  //  global.pageSectionCollection = new PageSectionCollection(); //Collection Instance
  //  global.pageSectionCollection.fetch(); 
  //}
  
  //NRP USER MODEL AND COLLECTION
  //if(global.nrpUsersCollection == undefined) {
    //debugger;

  //  global.nrpUserModel = new NRPUserModel();

  //  global.nrpUsersCollection = new NRPUsersCollection(); //Collection Instance
  //  global.nrpUsersCollection.fetch(); 
  //}
  //global.nrpUsersView = new NRPUsersView();
  
  //NRP PROJECTS MODEL, COLLECTION, AND VIEW
  //if(global.nrpProjectsCollection == undefined) {
  //    global.nrpProjectModel = new NRPProjectModel();
      
  //    global.nrpProjectCollection = new NRPProjectCollection();
  //    global.nrpProjectCollection.fetch();
  //}
  //global.nrpProjectsView = new NRPProjectsView();
    
  /*** BEGIN TESTING CODE ***/
  //debugger;
  
  //Move the Cookie plugin to the global scope.
  //global.cookie = Cookie;
    
  /*** END TESTING CODE ***/
  
  
  log.push('Finished executing logwork_app.js');
  
  
  /*** BEGIN GLOBAL FUNCTIONS ***/
  
  /*** END GLOBAL FUNCTIONS ***/
});
