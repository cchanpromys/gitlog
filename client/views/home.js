if (Meteor.isClient) {
  // This code only runs on the client

  //TOOD: Get these using Github API? https://developer.github.com/v3/
  Template.home.helpers({
    logs: [
      { text: "This is task 1", createdAt: new Date() },
      { text: "This is task 2", createdAt: new Date() },
      { text: "This is task 3", createdAt: new Date() }
    ]
  });
}

Template.home.helpers({
  myAppVariable: function() {
    return Session.get('myAppVariable');
  }
});

Template.home.events({
  'click button': function(event, template) {
    Session.set('myAppVariable', Math.floor(Math.random() * 11));
  }
});

