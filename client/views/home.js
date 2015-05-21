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
    'click button': function (event, template) {

        var user = $('#user').val();
        var pass = $('#pass').val();
        var url = $('#url').val();

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