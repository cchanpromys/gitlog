Meteor.publish('usersProfile', function(){
	return Meteor.users.find(this.userId, {
		fields: {
			'services.github.username': true,
			'services.github.accessToken': true,
			'services.github.email': true
		}
	});	
});