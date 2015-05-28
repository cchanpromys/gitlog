Template.home.helpers({
    logs: function () {
        return Session.get('logs');
    }
});

Template.home.events({
    'submit form': function (e, template) {
        e.preventDefault();
        
        
        //TODO: This doesn't work yet
        //If the user is logged in, get the required info
        if(Meteor.user())
        {
            var accessToken = Meteor.user().profile.github.accessToken;
            
            //Get all the user's repo
            Meteor.http.get('https://api.github.com/repositories',{
                params : {
                    access_token : accessToken
                },
                headers: {"User-Agent": "Meteor/1.0"}
            }, function (error, result) {
                Session.set('repos', result.data);
            });
        
            
        }   

       

        // TODO validation

// #### Code follows is suppose to get user's activitiy on GitHub. Disabled for now ####
//  var form = e.currentTarget;
//
//        var user = form.user.value;
//        var pass = form.pass.value;
//        var url = form.url.value; 
 
 
        //Make a call to GitHub 
//        var opt = {
//            headers: {
//                //TODO: Not sure why 'auth' doesn't work. Doing this the hard way
//                Authorization: 'Basic ' + btoa(user + ':' + pass)
//            }
//        }

//TOOD: Apparently you can make calls directly after getting to accessToken (but how?)
//result = Meteor.http.get("https://api.github.com/user", {
//  headers: {"User-Agent": "Meteor/1.0"},
//  params: {
//    access_token: accessToken
//  }
//});

//        Meteor.http.get(url, opt, function (error, result) {
//            if (error) {
//                //TODO: Make something Fancy
//                alert('Something went wrong')
//            } else {
//                Session.set('logs', result.data);
//            }
//        });
    }
});

Meteor.loginWithGithub({
  requestPermissions: ['user', 'public_repo']
}, function (err) {
  if (err)
    Session.set('errorMessage', err.reason || 'Unknown error');
});


    
