Template.home.helpers({
    logs: function () {
        return Session.get('logs');
    }
});

Template.home.events({
    'submit form': function (e, template) {
        e.preventDefault();

        var form = e.currentTarget;

        var user = form.user.value;
        var pass = form.pass.value;
        var url = form.url.value;

        // TODO validation

        //Make a call to GitHub 
        var opt = {
            headers: {
                //TODO: Not sure why 'auth' doesn't work. Doing this the hard way
                Authorization: 'Basic ' + btoa(user + ':' + pass)
            }
        }

//TOOD: Apparently you can make calls directly after getting to accessToken (but how?)
//result = Meteor.http.get("https://api.github.com/user", {
//  headers: {"User-Agent": "Meteor/1.0"},
//  params: {
//    access_token: accessToken
//  }
//});

        Meteor.http.get(url, opt, function (error, result) {
            if (error) {
                //TODO: Make something Fancy
                alert('Something went wrong')
            } else {
                Session.set('logs', result.data);
            }
        });
    }
});

//TODO: When you login? Not sure how to get accessToken
//Accounts.onCreateUser(function(options,user){
//    
//    alert('yes');
//    var accessToken = user.services.github.accessToken,
//        result,
//        profile;
//
//    result = Meteor.http.get('https://api.github.com/user',{
//        params : {
//            access_token : accessToken
//        },
//        headers: {"User-Agent": "Meteor/1.0"}
//    });
//
//    if(result.error){
//        console.log(result);
//        throw result.error
//    }
//
//    profile = _.pick(result.data,
//        'login',
//        'name',
//        'avatar_url',
//        'url',
//        'company',
//        'blog',
//        'location',
//        'email',
//        'bio',
//        'html_url'
//    );
//
//    user.profile = profile;
//
//    return user;
//});