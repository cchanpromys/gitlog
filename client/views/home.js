//Init
Session.set('repos', []);
Session.set('orgs', [
    {
        options:[
            {label: 'load', value:''}
        ]
    }
]);

Template.home.helpers({
    logs: function () {
        return Session.get('logs');
    },
    repos: function(){
        return Session.get('repos');
    }
});

Template.home.events({
    'submit form': function (e, template) {
        e.preventDefault();

        var form = e.target;
        var url = form.repo.value + '/issues';


        //https://api.github.com/repos/Promys/Promys/issues?state=closed
        //Get all the user's repo
        Meteor.http.get(url, {
            params : {
                access_token : Session.get('accessToken'),
                state: 'closed'
            },
        }, function (error, result) {
            Session.set('logs', result.data);
        });
    },
    'click .loadDropdown': function(e, template){
        //User is not logged in
        if(!Meteor.user()) {
            return;
        }

        //User is logged in but not with GitHub
        if(!Meteor.user().services || !Meteor.user().services.github){
            return;
        }

        var accessToken = Meteor.user().services.github.accessToken;

        Session.set('accessToken', accessToken);

        //Get user's organization
        //https://developer.github.com/v3/orgs/#list-user-organizations
        Meteor.http.get('https://api.github.com/user/orgs', {
            params : { access_token : accessToken },
        }, function(error, result){
            var orgs = result.data;
            Session.set('orgs', orgs);

            for(var i =0;i<orgs.length;i++) {
                //Get organization's repos
                //https://developer.github.com/v3/repos/#list-organization-repositories
                var url = 'https://api.github.com/orgs/' + orgs[i].login + '/repos';
                Meteor.http.get(url, {
                    params: {access_token: accessToken},
                    type: 'private'
                }, function (error, result) {
                    var src = Session.get('repos');
                    var repos = result.data;

                    for (var i = 0; i < repos.length; i++) {
                        src.push(repos[i]);
                    }

                    Session.set('repos', src);
                });
            }
        });
    }
});

// For Login. This code will fire as soon as the page is loaded. It interacts with the '{{> loginButtons}}' part on the
// view. This is part of MeteorJss
// For full list of "scopes", see:
// https://developer.github.com/v3/oauth/#scopes
Meteor.loginWithGithub({
  requestPermissions: [
      'user', 'public_repo','read:org','write:org','admin:org','repo','repo:status'
  ]
}, function (err) {

    //Something went wrong with logging in
    if (err) {
        Session.set('errorMessage', err.reason || 'Unknown error');
        return;
    }
});