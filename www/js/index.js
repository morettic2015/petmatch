/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        document.getElementById('btn-submit').onclick = function () {
            document.getElementById('page1').style.display = 'block';
            document.getElementById('page-signin').style.display = 'none';
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

app.initialize();


function loginGoogle() {
    window.plugins.googleplus.login(
        {
            scopes: 'profile email', // optional, space-separated(!) list of scopes, If not included or empty, defaults to 'profile email'.
            webClientId: '45315661768-umuoma1q6a4ghk9eodn5rvb34c2tsl8e.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
        },
        function (obj) {
            alert(JSON.stringify(obj)); // do something useful instead of alerting
            /* contains:
             obj.email          // 'eddyverbruggen@gmail.com'
             obj.userId         // user id
             obj.displayName    // 'Eddy Verbruggen'
             obj.familyName     // 'Verbruggen'
             obj.givenName      // 'Eddy'
             obj.imageUrl       // 'http://link-to-my-profilepic.google.com'
             obj.idToken        // idToken that can be exchanged to verify user identity.
             obj.serverAuthCode // Auth code that can be exchanged for an access token and refresh token for offline access
            */
        },
        function (msg) {
            alert('error: ' + msg);
        }
    );
}