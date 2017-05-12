/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loginGoogle() {
    window.plugins.googleplus.login({
        scopes: 'profile email', // optional, space-separated(!) list of scopes, If not included or empty, defaults to 'profile email'.
        webClientId: '302835253273-hb7cdnpbsq49p10h0d2jivghc3k66lgt.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    }, function(obj) {
        var mProf = obj;
        mProf.name = obj.displayName;
        mProf.img = obj.imageUrl;
        //alert(JSON.stringify(obj)); // do something useful instead of alerting

        myLoader.show();
        var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=37&email="
                + mProf.email
                + "&name="
                + encodeURI(mProf.displayName)
                + "&id="
                + mProf.userId
                + "&gmail="
                + encodeURI(mProf.imageUrl)
        $.ajax({
            url: postTo,
            dataType: "jsonp",
            method: "GET",
            jsonp: 'callback',
            jsonpCallback: 'SIGNIN',
            success: function(data) {
                if (data.in) {
                    //resposta = {};
                    window.location = "#page2";
                    $("#nmEmail").html(mProf.email);
                    $("#nmProfile").html(mProf.displayName);
                    $("#nmAvatar").attr("src", mProf.imageUrl);
                    $("#nmAvatar").attr("style", "border-radius: 50%;");
                    //resposta.id = data.id;
                    try {
                        mProf.id = data.id;
                        //obj.name = data.new;
                        //obj.email = data.new;
                        mProf.new = data.new;
                        mProf.cep = data.cep == undefined ? "" : data.cep;
                        mProf.rua = data.rua == undefined ? "" : data.cep;
                        mProf.fone = data.fone == undefined ? "" : data.cep;
                        mProf.doc = data.cpf == undefined ? "" : data.cpf;
                        mProf.comp = data.complemento == undefined ? "" : data.complemento;
                        //alert(JSON.stringify(mProf)); // do some
                    } catch (e) {
                        alert(e.msg);
                    } finally {
                        localStorage.setItem("profile", JSON.stringify(obj));
                        initMainListShow();
                    }
                } else {
                    alert("Ops...Usuário ou senha inválidos");
                }
                myLoader.hide();
                //alert(JSON.stringify(data));
            },
            error: function(err) {
                myLoader.hide();
                alert(JSON.stringify(err));
            }
        });
    }, function(msg) {
        alert('error: ' + msg);
    }
    );
}

/**
 *  @ Load profile from Local memory an then set properties n form
 * */
function setProfile() {
    //alert('LOL')
    window.location = "#jpopPerfil";
    resposta = getProfile();
    //alert(JSON.stringify(resposta));
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
                localStorage.setItem("profile", JSON.stringify(resposta));

                window.location = "#page2";

                $("#nmEmail").html(resposta.email);
                $("#nmProfile").html(resposta.name);
                //alert(resposta.picture.data.url)
                $("#nmAvatar").attr("src", resposta.url);
                $("#nmAvatar").attr("style", "border-radius: 50%;");


            } else {
                alert("Ops...Usuário ou senha inválidos");
            }
            initMainListShow();
            //alert(JSON.stringify(data));
        },
        error: function(err) {
            myLoader.hide();
            alert(err);
        }
    });
}
/**
 * @Facebook login and settings on Main Screen
 * */

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
                                    resposta.id = data.id;
                                    try {
                                        resposta.new = data.new;
                                        resposta.cep = data.cep;
                                        resposta.rua = data.rua;
                                        resposta.fone = data.fone;
                                        resposta.doc = data.cpf;
                                        resposta.comp = data.complemento;

                                    } catch (e) {

                                    }
                                    //alert(JSON.stringify(resposta));
                                    //alert(JSON.stringify(data));

                                    localStorage.setItem("profile", JSON.stringify(resposta));
                                    initMainListShow();
                                } else {
                                    alert("Ops...Usuário ou senha inválidos");
                                }
                                myLoader.hide();
                                //alert(JSON.stringify(data));
                            },
                            error: function(err) {
                                myLoader.hide();
                                alert(JSON.stringify(err));
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