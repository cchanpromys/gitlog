//TODO: In hopes that I can set the accessToken so I can use it on the client side
Accounts.onCreateUser(function(options, user) {
      if (options.profile) {
        user.profile = options.profile;
      }
     
      user.profile.github = {};
      user.profile.github.accessToken = user.services.github.accessToken;
      user.profile.github.email = user.services.github.email;
      user.profile.github.username = user.services.github.username;
     
      return user;
});