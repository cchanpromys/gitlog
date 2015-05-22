//if (Meteor.isClient) {
  // This code only runs on the client

  //TOOD: Get these using Github API? https://developer.github.com/v3/
  
//}

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