'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String, 
    required: true
  },
  email: {type: String,  
    required: true,
    unique: true
  }
});

userSchema.methods.serialize = function() {
  return {
    id: this._id || '',
    username: this.username || '',
    firstName: this.firstName || '',
    email: this.email|| ''
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};


const moodEntrySchema = mongoose.Schema({
    user: { type: String},
    created: { type: Date, default: Date.now },
    note: { type: String },
    moods: [{ type: Schema.Types.ObjectId, ref: 'Mood' }]
  });

const moodSchema = mongoose.Schema({
    created: {type: Date, default: Date.now},
    moodType: {type: String},
    intensity: {type: String},
  });


const User = mongoose.model('User', userSchema);
const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
const Mood = mongoose.model('Mood', moodSchema);

module.exports = {MoodEntry, Mood, User};