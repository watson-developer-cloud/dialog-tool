/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express  = require('express');
var  app        = express();
var  request    = require('request');
var  vcapServices = require('vcap_services');
var  extend     = require('util')._extend;

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials =  extend({
  url: 'https://gateway.watsonplatform.net/dialog/api',
  username: '<username>',
  password: '<password>'
}, vcapServices.getCredentials('dialog', 'standard')); // VCAP_SERVICES

var apiIndex = credentials.url.indexOf('/api');
if (apiIndex > 0) {
  credentials.url = credentials.url.substring(0, apiIndex);
}

// HTTP proxy to the API
app.use('/proxy', function(req, res, next) {
  var newUrl = credentials.url + req.url;
  req.pipe(request({
    url: newUrl,
    auth: {
      user: credentials.username,
      pass: credentials.password,
      sendImmediately: true
    }
  }, next)).pipe(res);
});

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

require('./config/error-handler')(app);

module.exports = app;