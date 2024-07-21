const passport = require("passport");
const keys = require("../config/keys");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id); // user model id
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.goggleClientSecret,
      callbackURL: keys.googleRedirectURI,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleID: profile.id }).then((existingUser) => {
        if (existingUser) {
          // User already exists
          done(null, existingUser);
        } else {
          // Add User
          new User({ googleID: profile.id })
            .save()
            // promise callback
            .then((user) => done(done, user));
        }
      });
    }
  )
);
