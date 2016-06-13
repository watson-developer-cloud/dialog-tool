/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
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

// Module dependencies
var express    = require('express'),
  auth         = require('http-auth'),
  pub          = require('pug');

var basic = auth.basic({
  realm: 'Dialog Admin'
  }, function (username, password, callback) {
    // Custom authentication method.
    callback(username === process.env.AUTH_USERNAME && password === process.env.AUTH_PASSWORD);
  }
);

module.exports = function (app) {
  // Setup static public directory
  app.use(express.static(__dirname + '/../public'));
  app.set('view engine', 'pug');
  app.set('views', __dirname + '/../views');

  // add basic auth
  if (process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD) {
    app.use(auth.connect(basic));
  }
};
