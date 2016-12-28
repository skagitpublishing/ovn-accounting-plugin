var async = require('async'),
	keystone = require('keystone');

var User = keystone.list('User');
var security = keystone.security;

var Mailgun = require('mailgun-js'); //Mailgun API library.

//debugger;

/**
 * List User
 */
exports.list = function(req, res) {
	User.model.find(function(err, items) {
		
		if (err) return res.apiError('database error', err);
		
    //Eventually add code here to blank out the password hash.
    
		res.apiResponse({
			user: items
		});
		
	});
}

/**
 * Get User by ID
 */
exports.get = function(req, res) {
	User.model.findById(req.params.id).exec(function(err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		res.apiResponse({
			user: item
		});
		
	});
}


/**
 * Create a User
 */

exports.create = function(req, res) {
  
	var item = new User.model(),
		data = (req.method == 'POST') ? req.body : req.query;
	
	item.getUpdateHandler(req).process(data, function(err) {
		
		if (err) return res.apiError('error', err);
		
    //Email the user a confirmation email.
    //sendNewUserEmail(item);
    
		res.apiResponse({
			user: item
		});
		
	});
}


/**
 * Get User by ID
 */

exports.update = function(req, res) {
  debugger;
  
  
  //var keystonereq = req.keystone;
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is either the user being changed or a superuser. 
  //Reject normal admins or users maliciously trying to change other users settings.
  var superusers = keystone.get('superusers'); //Retrieve the list of superusers saved in keystone.js
  var userId = req.user.get('id');
  if(userId != req.params.id) {
    if(superusers.indexOf(userId) == -1) {
      return res.apiError(403, 'Not allowed to change this user settings.');
    }
  }
  
	User.model.findById(req.params.id).exec(function(err, item) {
		debugger;
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		var data = (req.method == 'POST') ? req.body : req.query;
		
		item.getUpdateHandler(req).process(data, function(err) {
			
			if (err) return res.apiError('create error', err);
			
			res.apiResponse({
				user: item
			});
			
		});
		
	});
}


/**
 * Delete User by ID
 */

exports.remove = function(req, res) {
  
  //var keystonereq = req.keystone;
	//if (!security.csrf.validate(req)) {
	//	return res.apiError(403, 'invalid csrf');
	//}
  
  //Ensure the user making the request is either the user being changed or a superuser. 
  //Reject normal admins or users maliciously trying to change other users settings.
  var superusers = keystone.get('superusers'); //Retrieve the list of superusers saved in keystone.js
  var userId = req.user.get('id');
  if(userId != req.params.id) {
    if(superusers.indexOf(userId) == -1) {
      return res.apiError(403, 'Not allowed to change this user settings.');
    }
  }
  
	User.model.findById(req.params.id).exec(function (err, item) {
		
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');
		
		item.remove(function (err) {
			if (err) return res.apiError('database error', err);
			
			return res.apiResponse({
				success: true
			});
		});
		
	});
}


//This function is called by exports.create function. It sends an email to the new user
//to confirm their user account was created.
function sendNewUserEmail(UserModel) {
  console.log('sendNewUserEmail() executing...');
  
  //Process email address in query string.
  var email = UserModel.get('email');

  if(email.indexOf('@') == -1) {  //Reject if there is no @ symbol.
    console.log('Invalid email: '+email);
  }
  console.log('Got email: '+email);
  email = [email];  //Convert into an array.

  
  //Error handling - undefined email
  if( email == undefined ) {
    console.log('Failure: email == undefined');
  }
  
  var subject = "Your RPiOVN.com Account";
  var body = "Thank you for signing up as a Beta Tester on RPiOVN.com\n\n"+
      "Your login is your email: "+email[0]+"\n"+
      "<a href='http://rpiovn.com/keystone/signin'>You can sign in here</a>";
  
  //Send the email log via MailGun email.
  var emailObj = new Object();
  emailObj.email = email;
  emailObj.subject = subject;
  emailObj.message = body
  sendMailGun(emailObj);
  
  //Return success.
  return true;
}


//This function sends an email using MailGun using an emailObj.
//emailObj = {
//  email = array of strings containing email addresses
//  subject = string for subject line
//  message = text message to email
//  html = (default = false). True = message contains html and should be treated as html.
//}
function sendMailGun(emailObj) {
  
  //Error Handling - Detect invalid emailObj
  if(
    //Conditions for exiting:
    (emailObj.email == undefined) ||
    (emailObj.subject == undefined) || (emailObj.subject == "") ||
    (emailObj.message == undefined) || (emailObj.message == "")
    ) 
  {
    console.log('Invalid email Object passed to sendMailGun(). Aborting.');
    debugger;
    return false;
  }
  
  //Error Handling - Detect any invalid email addresses
  for(var i=0; i < emailObj.email.length; i++) {
    if(emailObj.email[i].indexOf("@") == -1) {
      if(emailObj.email[i] == "") {
        //debugger;
        emailObj.email.splice(i,1); //Remove any blank entries from the array.
      } else {
        console.log('Error! sendMailGun() - Invalid email address passed: '+emailObj.email[i]); 
        return;
      }
    }
  }
  
  //Sort out the optional input html flag
  var html = false;
  if((emailObj.html != undefined) && (typeof(emailObj.html) == "boolean"))
    html = emailObj.html;
  
  //Send an email for each email address in the array via Mailgun API
  var api_key = 'key-3a4e4494ffe9b328783413ed0da9b332';
  var domain = 'mg.rpiovn.com';
  var from_who = 'chris.troutner@gmail.com';
  var mailgun = new Mailgun({apiKey: api_key, domain: domain});
  
  for( var i=0; i < emailObj.email.length; i++ ) {
  
    //Error handling.
    if(emailObj.email[i] == "")
      continue;
    
      if(html) {
        var data = {
          from: from_who,
          to: emailObj.email[i],
          subject: emailObj.subject,
          html: emailObj.message
        };
      } else {
        var data = {
          from: from_who,
          to: emailObj.email[i],
          subject: emailObj.subject,
          text: emailObj.message
        };
      }
      
      
      mailgun.messages().send(data, function(err, body) {
        if(err) {
          console.log('Got an error trying to send email with sendMailGun(): ', err);
          debugger;
        } else {
          console.log('Sent email successfully with sendMailGun()');
        }
      });
  }
}

