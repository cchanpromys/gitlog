//Init
Session.set('repos', []);
Session.set('orgs', [
    {
        options:[
            {label: 'load', value:''}
        ]
    }
]);
Session.set('logs',[]);

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
        var github = Session.get('github');
        var logs = Session.get('logs');
        var msgs= null;

        //Get all commits by you
        //https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
        Meteor.http.get(form.repo.value + '/commits', {
            params : {
                access_token : github.accessToken,
                author: github.username,
                since: form.from.value,
                until: form.to.value
            },
        }, function(err, result){

            msgs = result.data;

            for(var i=0; i < msgs.length; i++){
                var date= msgs[i].commit.author.date;
                var msg = msgs[i].commit.message;

                logs.push({msg: msg, date: date});
            }

            Session.set('logs', logs);

            //Get some tickets created by you
            //https://developer.github.com/v3/issues/#list-issues-for-a-repository
            Meteor.http.get(form.repo.value + '/issues', {
                params: {
                    access_token: github.accessToken,
                    creator: github.username,
                    since: form.from.value,
                    until: form.to.value
                }
            }, function(err, result){
                var msgs = result.data;
                var logs = Session.get('logs');

                for(var i=0; i<msgs.length; i++){
                    var date= msgs[i].created_at;
                    var msg = "Open #" + msgs[i].number + '. '  + msgs[i].title;

                    logs.push({msg: msg, date: date});
                }

                //Update your logs
                Session.set('logs', logs);
            });
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

        var github = Meteor.user().services.github;
        var accessToken = github.accessToken;

        Session.set('github', github);

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