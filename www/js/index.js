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

        //Recover profile from previous session
        var mProf = getProfile();
        if (mProf != null) {
            //alert(perfil.id);
            //myLoader.show();
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
             *  @ Save lat lon when open APP
             * */

            //INit geolocation

            navigator.geolocation.getCurrentPosition(
                    function(position) {
                        localStorage.setItem("lat", position.coords.latitude);
                        localStorage.setItem("lon", position.coords.longitude);
                        loadMainPets(position.coords.latitude, position.coords.longitude, 4000);
                    },
                    function(error) {
                        alert(error);
                        //alert(JSON.stringify(error));
                    }
            );

            /**
             * @Push Notifications enabled
             * */
            var notificationOpenedCallback = function(jsonData) {
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            };

            window.plugins.OneSignal
                    .startInit("cb2da5f1-6c1e-4692-814e-01fd3c11b10d")
                    .handleNotificationOpened(notificationOpenedCallback)
                    .endInit();

            window.plugins.OneSignal.getIds(function(ids) {
                //console.log('getIds: ' + JSON.stringify(ids));
                //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
                var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=39&id="
                        + mProf.id
                        + "&token="
                        + ids.pushToken
                        + "&one="
                        + ids.userId;
                // alert(postTo);
                $.ajax({
                    url: postTo,
                    dataType: "jsonp",
                    method: "GET",
                    jsonp: 'callback',
                    jsonpCallback: 'PUSH_REGISTER',
                    success: function(data) {
                        //alert(JSON.stringify(data));
                        localStorage.setItem("push", JSON.stringify(data));
                    },
                    error: function(err) {
                        myLoader.hide();
                        alert(err);
                    }
                });
            });
            //myLoader.hide();
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
/**
 * @ Open pop up to set inner content at Adopt Screen (main)
 * */
function viewPet(petId) {
    $("#jpop").popup("open");
    //alert(JSON.stringify(pets[petId]));
    $("#imgDetailPet").attr("src", allPets[petId].getAvatar);
    $("#imgDetailPet").attr("style", "max-height:200px");
    $("#titDetailPet").html(allPets[petId].getTitulo);
    //alert(pets[petId].getPort);
    var desc = allPets[petId].getDescricao;
    desc += "<br><small>";
    desc += "<b>Espécie:</b>";
    desc += allPets[petId].getEspecie == "1" ? "Cão<br>" : "Gato<br>";
    desc += "<b>Porte:</b>";
    desc += allPets[petId].getPorte == "1" ? "Até 15kg<br>" : allPets[petId].getPorte == "2" ? "Até 25kg<br>" : "Mais de 25kg<br>";
    desc += "<b>Vacinado:</b>";
    desc += allPets[petId].getVacinado == "1" ? "SIM<br>" : "NÃO<br>";
    desc += "<b>Castrado:</b>";
    desc += allPets[petId].getCastrado == "1" ? "SIM<br>" : "NÃO<br>";
    desc += "<b>Sexo:</b>";
    desc += allPets[petId].getSexo == "1" ? "MACHO<br>" : "FÊMEA<br>";
    desc += "<b>Idade:</b>";
    desc += allPets[petId].getIdade + "(meses)";
    desc += "</small>";
    $("#descDetailPet").html(desc);

}
var allPets = [];
function loadMainPets(lat, lon, dist) {
    myLoader.show();
    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=43&lat=" + lat
            + "&lon=" + lon
            + "&d=" + dist;
    //alert(postTo);
    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'SEARCH',
        success: function(data) {

            //  $("#listPetsMain").html('');
            //  $("#listPetsMain").listview("refresh");
            // alert(JSON.stringify(data));
            //alert(localStorage.getItem("myPets"));
            allPets = data.result;
            content = '<li data-role="divider">Pets para adoção (' + allPets.length + ')</li>';

            try {
                for (i = 0; i < allPets.length; i++) {
                    mP = allPets[i];
                    //;
                    content += '<li><a href="#" onclick="viewPet(' + i + ')"><img src="' + mP.getAvatar
                            + '" style="border-radius: 50%;border-radius:1px" width="180"><h2>' + mP.getTitulo
                            + '</h2><p>' + mP.getDescricao
                            + '</p> </a></li>';
                }

            } catch (e) {
                alert(e);
            } finally {
                $("#listPetsMain").html(content);
                $("#listPetsMain").listview("refresh");
                myLoader.hide();
            }

            //myLoader.hide();
            //alert(JSON.stringify(data));
        },
        error: function(err) {
            loadMainPets(lat, lon, dist);
            //myLoader.hide();
            //alert(err);
        }
    });

}
/**
 * @Facebook login and settings on Main Screen
 * */
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
                        myLoader.show();
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
                                myLoader.hide();
                                //alert(JSON.stringify(data));
                            },
                            error: function(err) {
                                myLoader.hide();
                                alert(err);
                            }
                        });

                    }
                });
    }
    /**
     *  @Facebook Permissions
     * */
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
        myLoader.show();
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
                myLoader.hide();
                alert("Dados atualizados com sucesso!");
            },
            error: function(err) {
                myLoader.hide();
                alert(err);
            }
        });
    }
}
/**
 * @Normal Login
 * */
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
        },
        error: function(err) {
            myLoader.hide();
            alert(err);
        }
    });
}

function filePicker() {
    /*fileChooser.open(function(uri) {
     alert(uri);
     });*/
    imagePicker.getPictures(
            function(result) {
                var content = "";
                for (var i = 0; i < result.length; i++) {
                    //alert(result[i]); //<a href="#" class="thumbnail"><img src="img.jpg" /></a>
                    content += '<img id="pic_avatar_pet" onclick="filePicker()"  src="' + result[i] + '" style="border-radius: 15%;max-width:100px"/>';
                    localStorage.setItem("petAvatar", result[i]);
                    uploadFile(result[i]);
                }

                document.getElementById('div_pic').innerHTML = content;
            }, // success handler
            function(errmsg) {
                alert('Ocorreu um erro ao anexar sua imagem. Tente outra vez!...' + errmsg)
                console.log("ohoh.. " + errmsg);
            },
            {// options object, all optional
                maximumImagesCount: 1, // Android only since plugin version 2.1.1, default no limit
                quality: 20, // 0-100, default 100 which is highest quality
                width: 300, // proportionally rescale image to this width, default no rescale
                height: 300, // same for height
                outputType: imagePicker.OutputType.FILE_URI // default .FILE_URI
            });
}

function getUpload() {
    var p = null;
    if (localStorage.getItem("upload") != null) {
        p = JSON.parse(localStorage.getItem("upload"));
    }
    return p;
}

function getLocation() {
    var p = new Object();

    p.lat = localStorage.getItem("lat");
    p.lon = localStorage.getItem("lon");

    return p;
}
//////Save pet
/**
 *
 * https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=41&sexo=1&vacinado=1&id=5678508399394816&idOwner=4520495223406592&castrado=1&idade=36&lat=21&lon=48&tit=LindoP555555555555555555555555555555555555et&desc=%20descricao%20do%20pet&sexo=1&vacinado=2&token=000000000000000000000000000000000000000000000000000&porte=3
 *
 * */
var isEdit = false;
var petId = 0;
var avatarUrl = null
function savePet() {

    var perfil = getProfile();
    //alert(JSON.stringify(perfil));
    var pos = getLocation();
    //alert(pos.lat);
    var upload = getUpload();

    if (pos == null || pos.lat == undefined) {
        alert('Ative seu GPS para cadastrar o Pet!');
        return;
    }
    if ($("#txt-tit").val() == "" || $("#txt-desc-pet").val() == "") {
        alert('Verifique os dados do pet!');
        return;
    }
    if (!confirm("Deseja salvar novo Pet para adoção?")) {
        return;
    }
    myLoader.show();
    //alert(JSON.stringify(upload));
    id = petId;
    var urlReq = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=41";
    urlReq += "&sexo=" + $("#txt-sexo").val();
    urlReq += "&id=" + id;
    urlReq += "&idOwner=" + perfil.id;
    urlReq += "&idade=" + $("#txt-idade").val();
    urlReq += "&lat=" + pos.lat;
    urlReq += "&lon=" + pos.lon;
    urlReq += "&tit=" + encodeURI($("#txt-tit").val());
    urlReq += "&desc=" + encodeURI($("#txt-desc-pet").val());
    urlReq += "&vacinado=" + $("#ck-v").val();
    if (isEdit) {
        token = (encodeURI(upload.response.substr(2, upload.response.length - 4)) != undefined) ? encodeURI(upload.response.substr(2, upload.response.length - 4)) : avatarUrl.substr(78, avatarUrl.length - 1);
        urlReq += "&token=" + encodeURI(token);
    } else {
        urlReq += "&token=" + encodeURI(upload.response.substr(2, upload.response.length - 4));
    }
    urlReq += "&porte=" + $("#txt-porte").val();
    urlReq += "&especie=" + $("#txt-tipo").val();
    urlReq += "&castrado=" + $("#ck-c").val();
    //alert(urlReq);
    $.ajax({
        url: urlReq,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'UPDATE_PET',
        success: function(data) {
            localStorage.setItem("myPets", JSON.stringify(data));
            petId = data.idPet;

            if (isEdit) {
                alert('Pet atualizado!');
            } else {
                alert('Pet cadastrado para adoção!');
            }
            myLoader.hide();
            $("#frmPet").get(0).reset();
            loadMyPets();
            petId = 0;
            isEdit = false;
        },
        error: function(err) {
            myLoader.hide();
            alert(err);
        }
    });
}// porte, vacinado, avatar, idade, descricao, especie,
function setPet(id) {
    try {
        //alert(localStorage.getItem("myPets"));
        var list = JSON.parse(localStorage.getItem("myPets"));
        var myPets = list.mine;
        //alert(castrado);
        isEdit = true;
        //alert(myPets[id].getSexo);
        // alert(myPets[id].getEspecie);
        petId = myPets[id].id;
        $("#ck-c").val(myPets[id].getCastrado);
        $("#txt-sexo").val(myPets[id].getSexo);
        $("#txt-porte").val(myPets[id].getPorte);
        $("#ck-v").val(myPets[id].getVacinado);
        $("#txt-tipo").val(myPets[id].getEspecie);
        $("#ck-c").val(myPets[id].getCastrado).change();
        $("#txt-porte").val(myPets[id].getPorte).change();
        $("#ck-v").val(myPets[id].getVacinado).change();
        $("#txt-sexo").val(myPets[id].getSexo).change();
        $("#txt-tipo").val(myPets[id].getEspecie).change();
        $("#txt-idade").val(myPets[id].getIdade);
        $("#txt-desc-pet").val(myPets[id].getDescricao);
        //$("#pic_avatar_pet").attr("src", );

        /*  document.getElementById('pic_avatar_pet').src = myPets[id].getAvatar;
         document.getElementById('pic_avatar_pet').style = "border-radius: 15%;max-width:100px";*/

        $("#pic_avatar_pet").attr("src", myPets[id].getAvatar);
        $("#pic_avatar_pet").attr("style", "border-radius: 15%;max-width:100px");
        $("#txt-tit").val(myPets[id].getTitulo);
        //alert(id);
        avatarUrl = myPets[id].getAvatar;

        //alert(avatarUrl);
    } catch (e) {
        alert(e);
    }
    //alert(JSON.stringify(myPets[id]));
}

/**
 * @remove pet
 * */
function removePet() {
    if (petId == 0) {
        alert('Selecione um pet para remover!');
        return;
    }
    var perfil = getProfile();

    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=42"
            + "&idPet=" + petId
            + "&idOwner=" + perfil.id;
    if (confirm("Deseja remover o PET selecionado?")) {
        myLoader.show();
        $.ajax({
            url: postTo,
            dataType: "jsonp",
            method: "GET",
            jsonp: 'callback',
            jsonpCallback: 'REMOVE',
            success: function(data) {
                localStorage.setItem("myPets", JSON.stringify(data));
                try {
                    loadMyPets();
                    alert("Pet removido com sucesso!");
                    $("#frmPet").get(0).reset()
                    $("#pic_avatar_pet").attr("src", "img/foto.png");
                    $("#pic_avatar_pet").attr("style", "border-radius: 15%;max-width:100px");
                    myLoader.hide();
                    petId = 0;
                } catch (e) {
                    alert(e);
                } finally {

                }

            },
            error: function(err) {
                myLoader.hide();
                alert(err);
            }
        });
    }
}
/**
 *  @carrega my pets
 * */
var pets = [];
function loadMyPets() {
    //$("#myPets").html("");
    //$("#myPets").listview("refresh");
    var mProf = getProfile();
    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=44&id=" + mProf.id;
    //alert(postTo);
    myLoader.show();
    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'MINE',
        success: function(data) {
            localStorage.setItem("myPets", JSON.stringify(data));
            //alert(localStorage.getItem("myPets"));
            pets = data.mine;
            content = "";
            try {
                for (i = 0; i < pets.length; i++) {
                    mP = pets[i];

                    content += '<li><a href="#" onclick="setPet(' + i + ')"  id="' + mP.id + '" ><img src="' + mP.getAvatar
                            + '" style="border-radius: 50%;border-radius:1px" width="180"><h2>' + mP.getTitulo
                            + '</h2><p>' + mP.getDescricao
                            + '</p> </a></li>';
                    //alert(JSON.stringify(mP));
                    /*  content += '<li><a id="' + mP.id + '" onclick=setPet("' + i + '")>'
                     + '<img style="max-width:25%" src="' + mP.getAvatar + '"/>' + mP.getTitulo + '</a></li>';*/
                }

                $("#myPets").html(content);
                $("#myPets").listview("refresh");
                myLoader.hide();
            } catch (e) {
                alert(e);
            } finally {
                $("#pic_avatar_pet").attr("src", "img/foto.png");
                $("#pic_avatar_pet").attr("style", "border-radius: 15%;max-width:100px");
            }
        },
        error: function(err) {
            myLoader.hide();
            alert(err);
        }
    });
}
function novoPet() {
    if (confirm('Deseja cadastrar um novo pet?')) {
        $("#frmPet").get(0).reset();
        $("#pic_avatar_pet").attr("src", "img/foto.png");
        $("#pic_avatar_pet").attr("style", "border-radius: 15%;max-width:100px");
        petId = 0;
        isEdit = false;
    }
}

function loadAddPet() {
    myLoader.show();
    window.location = "#jpopCadastrarPet";
    loadMyPets();


}
/**
 *  @Funtion to upload Files
 *
 * */
function uploadFile(filePath) {
    myLoader.show();
    $.ajax({
        url: "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=40",
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'UPLOAD_PATH',
        success: function(data) {
            //alert(JSON.stringify(data));
            var fileURL = filePath;
            var uri = encodeURI(data.uploadPath);
            var options = new FileUploadOptions();
            //alert(fileURL);
            try {
                options.fileKey = "myFile";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";

                var headers = {'pet_match_pic': fileURL, 'url': data.uploadPath, 'by': 'www.morettic.com.br'};
                options.headers = headers;

                var ft = new FileTransfer();

                ft.upload(fileURL, uri,
                        function(r) {
                            localStorage.setItem("upload", JSON.stringify(r));
                            alert('Foto anexada com sucesso!');
                        },
                        function(error) {
                            alert("An error has occurred: Code = " + error.code);
                            alert("upload error source " + error.source);
                            alert("upload error target " + error.target);
                        },
                        options
                        );

            } catch (e) {
                alert(e);
            } finally {
                myLoader.hide();
            }
        },
        error: function(err) {
            myLoader.hide();
            alert(err);
        }
    });
}

/**
 *
 * /infosegcontroller.exec?action=41&sexo=2&id=0&idOwner=102102937404388791&idade=23&lat=-27.5966042&lon=-48.5453285&tit=Gato%20siam%C3%AAs%20&desc=Gata%20siamesa%20de%20AP%20estou%20mudando%20para%20outra%20cidade1&token=AMIfv94O_Hh0a8uaGLgIv37RtSs1hGvdrur7DsEdr5gNxEpAdNGIEqPCL2TLMpMFHyz-gV3cjnJO0CDs8O88ouoDosgHwR--N4nfMk3-NqF3BzXYU3U-qi1uuskiukh5zR0HSeZ6iAVghDLdjHvBuU9-IGQK_Yl1MRwjzzVvNmEBmqMjGMglYFc&porte=1&especie=2&callback=UPDATE_PET&_=1492673034094
 * */

var Loader = function() {
    this.show = function() {
        var $this = $(this),
                        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                        textonly = !!$this.jqmData("textonly");
                html = $this.jqmData("html") || "";
            $.mobile.loading("show", {
                        text: msgText,
                        textVisible: textVisible,
                        theme: theme,
                        textonly: textonly,
                        html: html
            });
    }
    this.hide = function() {
           $.mobile.loading("hide");
    }
}

var myLoader = new Loader();