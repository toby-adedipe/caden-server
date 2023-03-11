const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const { Schema } = mongoose;

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');


const ThirdPartyProviderShema = new Schema({
  provider_name: {
    type: String,
    default: null 
  },
  provider_id: {
    type: String,
    default: null 
  },
  provider_data: {
    type: {},
    default: null 
  }
})

const UsersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String
  },
  email_is_verified: {
    type: Boolean,
    default: false,
  },
  last_name: {
    type: String
  },
  verification_code: {
    type: String
  },
  referral_code: {
    type: String,
    default: function() {
      let hash = 0;
      for(let i = 0; i<this.email.length; i++){
        hash = this.email.charCodeAt(i) + ((hash << 5) - hash);
      }
      let res = (hash & 0x00ffffff).toString(16).toUpperCase();
      return "0000".substring(0, 6 - res.length) + res;
    }
  },
  referred_by: {
    type: String,
    default: null
  },
  third_party_auth: [ThirdPartyProviderShema],
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'regular',
    required: true,
  },
  reset_token: {
    type: String,
  },
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.issueJWT = function() {

  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  const payload = {
    sub: this._id,
    email: this._email,
    iat: Date.now(),
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }

  const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expiration: expirationDate
  }
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.issueJWT(),
  };
};

module.exports = mongoose.model("Users", UsersSchema);