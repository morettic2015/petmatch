/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=38&email=MALACMA@GMAIL.COM&name=Lam%20Mxrettx&pass=66da9b5f&id=10210293740438879&cep=4004&cpf=02522214525&rua=Jornalista%20CAPIVARA&fone=8888888&complemento=apto123
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
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        $("input").textinput();
        var mProf = getProfile();
        if (mProf != null) {
            mProf.img = "img/avatar.png";
            //alert(JSON.stringify(response));
            window.location = "#page2";
            $("#nmEmail").html(mProf.email);
            $("#nmProfile").html(mProf.name);
            //alert(resposta.picture.data.url)
            $("#nmAvatar").attr("src", mProf.picture == undefined ? mProf.img : mProf.picture.data.url);
            $("#nmAvatar").attr("style", "border-radius: 50%;");
            /**
             *
             *  @ Geolocate user device
             *
             * */
            var onSuccess = function(position) {
                alert('Latitude: ' + position.coords.latitude + '\n' +
                        'Longitude: ' + position.coords.longitude + '\n' +
                        'Altitude: ' + position.coords.altitude + '\n' +
                        'Accuracy: ' + position.coords.accuracy + '\n' +
                        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                        'Heading: ' + position.coords.heading + '\n' +
                        'Speed: ' + position.coords.speed + '\n' +
                        'Timestamp: ' + position.timestamp + '\n');
            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
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
                webClientId: '302835253273-fqb091vas7jtm62h1cbi8slib42brtpr.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            },
    function(obj) {
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
            function(msg) {
                alert('error: ' + msg);
            }
    );
}
var resposta = null;
function loginFacebook() {
    var fbLoginSuccess = function(userData) {
        //alert("UserInfo: " + JSON.stringify(userData));
        //me?fields=id,name,email
        facebookConnectPlugin.api(
                "me/?fields=id,name,email,picture", // graph path
                [], // array of additional permissions
                function(response) {
                    resposta = response;
                    if (response.error) {
                        alert("Não foi possível autorizar sua conta no Facebook" + JSON.stringify(response.error));
                    } else {
                        var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=37&email="
                                + resposta.email
                                + "&name="
                                + resposta.name
                                + "&id="
                                + resposta.id
                        $.ajax({
                            url: postTo,
                            dataType: "jsonp",
                            method: "GET",
                            jsonp: 'callback',
                            jsonpCallback: 'SIGNIN',
                            success: function(data) {
                                if (data.in) {
                                    window.location = "#page2";
                                    $("#nmEmail").html(resposta.email);
                                    $("#nmProfile").html(resposta.name);
                                    $("#nmAvatar").attr("src", resposta.picture.data.url);
                                    $("#nmAvatar").attr("style", "border-radius: 50%;");

                                    localStorage.setItem("profile", JSON.stringify(resposta));
                                } else {
                                    alert("Ops...Usuário ou senha inválidos");
                                }
                                alert(JSON.stringify(data));
                            }
                        });

                    }
                });
    }

    facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess, function(error) {
        alert("" + error)
    });
}
/**
 *  @ Load profile from Local memory an then set properties n form
 * */
function setProfile() {
    //alert('LOL')
    window.location = "#jpopPerfil";
    resposta = getProfile();
    $("#txt-nome").val(resposta.name);
    $("#txt-email1").val(resposta.email);
    $("#txt-fone").val(resposta.fone);
    $("#txt-cep").val(resposta.cep);
    $("#txt-password1").val(resposta.cep);
    $("#txt-fone").val(resposta.fone);
    $("#txt-rua").val(resposta.rua);
    $("#txt-comp").val(resposta.comp);
    $("#txt-doc").val(resposta.doc);
    $("#txt-password1").val(resposta.pass);
    $("#txt-avatar").attr("src", resposta.picture == undefined ? resposta.url : resposta.picture.data.url);
    $("#txt-avatar").attr("style", "border-radius: 50%;");
}

/**
 * @ Return the profime from memory local
 * */
function getProfile() {
    var p = null;
    if (localStorage.getItem("profile") != null) {
        p = JSON.parse(localStorage.getItem("profile"));
    }
    return p;
}

function saveProfile() {
    perfil = getProfile();
    perfil.name = $("#txt-nome").val();
    perfil.email = $("#txt-email1").val();
    perfil.cep = $("#txt-cep").val();
    perfil.pass = $("#txt-password1").val();
    perfil.fone = $("#txt-fone").val();
    perfil.rua = $("#txt-rua").val();
    perfil.comp = $("#txt-comp").val();
    perfil.doc = $("#txt-doc").val();

    if (perfil.name == "" ||
            perfil.email == "" ||
            perfil.cep == "" ||
            perfil.pass == "" ||
            perfil.doc == "" ||
            perfil.fone == "" ||
            perfil.comp == "" ||
            perfil.rua == "") {
        alert('Verifique seus dados!');
    } else {//Save profile
        //localStorage.setItem("profile", JSON.stringify(perfil));
        postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=38&"
                + "email=" + $("#txt-email1").val()
                + "&name=" + perfil.email
                + "&pass=" + $("#txt-password1").val()
                + "&id=" + perfil.id
                + "&cep=" + $("#txt-cep").val()
                + "&cpf=" + $("#txt-doc").val()
                + "&rua=" + $("#txt-rua").val()
                + "&fone=" + $("#txt-fone").val()
                + "&complemento=" + $("#txt-comp").val()
        $.ajax({
            url: postTo,
            dataType: "jsonp",
            method: "GET",
            jsonp: 'callback',
            jsonpCallback: 'UPDATE_PROFILE',
            success: function(data) {
                ;
                perfil.state = data.addrs[0].state;
                perfil.country = data.addrs[0].country;
                perfil.city = data.addrs[0].city;

                localStorage.setItem("profile", JSON.stringify(perfil));

                alert("Dados atualizados com sucesso!");
            }
        });

    }
}

function login() {
    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=37&email=" + $("#txt-email-address").val() + "&name=null&pass=" + $("#txt-password").val()
    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'SIGNIN',
        success: function(data) {

            if (data.in) {
                resposta = new Object();
                resposta.id = data.id;
                resposta.name = data.name;
                resposta.email = data.email;
                resposta.url = "img/avatar.png";
                window.location = "#page2";

                $("#nmEmail").html(resposta.email);
                $("#nmProfile").html(resposta.name);
                //alert(resposta.picture.data.url)
                $("#nmAvatar").attr("src", resposta.url);
                $("#nmAvatar").attr("style", "border-radius: 50%;");

                localStorage.setItem("profile", JSON.stringify(resposta));
            } else {
                alert("Ops...Usuário ou senha inválidos");
            }
            alert(JSON.stringify(data));
        }
    });
}

function filePicker() {
    fileChooser.open(function(uri) {
        alert(uri);
    });
}