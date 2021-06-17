/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 
 * See the License for the specific language governing permissions and limitations under the License.
 */


// @ts-nocheck
/* eslint-disable no-console */

const OktaAuthJS = require('@okta/okta-auth-js');
const OktaAuth = OktaAuthJS.OktaAuth;

const express = require('express');
const querystring = require('querystring');

const port = 8080;
const app = express();

app.use(express.static('./public'));
app.use(express.urlencoded());
app.post('/login', function(req, res) {
  const issuer = req.body.issuer;
  const username = req.body.username;
  const password = req.body.password;
  let authClient;
  let status;
  let error;
  let sessionToken;

  try {
    authClient = new OktaAuth({
      issuer
    });
  } catch(e) {
    console.error('Caught exception in OktaAuthJS constructor: ', e);
  }

  authClient.signIn({
    username,
    password
  })
  .then(function(transaction) {
    status = transaction.status;
    error = transaction.error;
    sessionToken = transaction.sessionToken;

    // Return data to the client-side
    const qs = querystring.stringify({
      username,
      issuer,
      status,
      sessionToken, 
      error,
    });
    res.redirect('/?' + qs);

  })
  .catch(function(err) {
    error = err;

    // Return data to the client-side
    const qs = querystring.stringify({
      username,
      issuer,
      status,
      error: error.toString(),
    });
    res.redirect('/?' + qs);
  });
});


app.listen(port, function () {
  console.log(`Test app running at http://localhost:${port}!\n`);
});
