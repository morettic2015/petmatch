/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function sendMessageToUser() {
    sendAbstractMessage(chatFromTo.f, chatFromTo.t, chatFromTo.p, "#txtMsgChatPop", "#msgChatBoxPop")
}

function sendAbstractMessage(from, to, pet, msg, div) {

    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=45"
            + "&from=" + from
            + "&to=" + to
            + "&pet=" + pet
            + "&message=" + encodeURI($(msg).val());

    myLoader.show();

    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'CHAT',
        success: function(data) {
            $(msg).val("");
            mensagens = data.chats;
            content = '<li data-role="divider">Mensagens (' + mensagens.length + ')</li>';

            try {
                for (i = 0; i < mensagens.length; i++) {
                    mP = mensagens[i];
                    var pathImageChat;
                    if (mP.getPath == undefined) {
                        var pathImageChat = 'img/avatar.png';
                    } else {
                        var pathImageChat = mP.getPath.replace("http:", "https:");
                    }
                    content += '<li><img src="' + pathImageChat
                            + '" style="border-radius: 50%;border-radius:1px" width="180"><p>' + mP.getNome + '</p><h4>' + mP.getMsg
                            + '</h4><p>' + mP.getTimestampChat
                            + '</p></li>';
                }
            } catch (e) {
                alert(e);
            } finally {
                $(div).html(content);
                $(div).listview("refresh");
                myLoader.hide();
            }
            myLoader.hide();
        },
        error: function(err) {
            myLoader.hide();
        }
    });
}

var chatFromTo = {};


function stopInterval() {
    if (threadOne != null) {
        clearInterval(threadOne);
        threadOne = null;
    }
}

function loadChatsAbstract(from, to, pet, txt, div, janela, reload) {
    chatFromTo.f = from;
    chatFromTo.t = to;
    chatFromTo.p = pet;

    //alert(JSON.stringify(chatFromTo));
    if (reload) {
        window.location = janela;
        $("#txtMsgChat").val("");
    }

    $("#msgChatBox").html('');
    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=48"
            + "&from=" + from
            + "&to=" + to
            + "&pet=" + pet

    myLoader.show();
    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'CHAT_MSG',
        success: function(data) {
            //alert(JSON.stringify(data));
            if (reload) {
                $(txt).val("");
                $(div).html('');
                $(div).listview("refresh");
            }
            // alert(JSON.stringify(data));
            //alert(localStorage.getItem("myPets"));

            mensagens = data.chats;
            //alert(JSON.stringify(mensagens));
            content = '<li data-role="divider">Mensagens (' + mensagens.length + ')</li>';

            try {
                for (i = 0; i < mensagens.length; i++) {

                    mP = mensagens[i];
                    //;
                    var pathImageChat;

                    var pathImageChat = mP.getPath.replace("http:", "https:");


                    content += '<li><img src="' + pathImageChat
                            + '" style="border-radius: 50%;border-radius:1px" width="180"><p>' + mP.getNome + '</p><h4>' + mP.getMsg
                            + '</h4><p>' + mP.getTimestampChat
                            + '</p></li>';
                }

            } catch (e) {
                alert(e);
            } finally {
                $(div).html(content);
                $(div).listview("refresh");
                myLoader.hide();
            }

            //myLoader.hide();
            //alert(JSON.stringify(data));*/
            myLoader.hide();

            //;
        },
        error: function(err) {
            //myLoader.hide();
            //alert(err);
            myLoader.hide();
        }

    });


}

/**
 * @envia mensagem
 * */

/**
 * @Load chat window
 * */

//var interValChat = [];
var threadOne = null;
var funThread = null;
function loadChats() {
    origem = 1;
    loadChatsAbstract(mProf.id, selectedPet.getIdOwner, selectedPet.id, "#txtMsgChat", "#msgChatBox", "#jpopMsgPet", true);
    stopInterval();

    funThread = function() {
        loadChatsAbstract(mProf.id, selectedPet.getIdOwner, selectedPet.id, "#txtMsgChat", "#msgChatBox", "#jpopMsgPet", false);
    }

    threadOne = setInterval(funThread, 10000);

    //interValChat.push(threadOne);

}
function sendMessageToPetOwner() {


    if (selectedPet == null)
        return;

    if ($("#txtMsgChat").val() == "")
        return;

    sendAbstractMessage(mProf.id, selectedPet.getIdOwner, selectedPet.id, "#txtMsgChat", "#msgChatBox");

}

function setChat(fR, tO, iDPet) {
    origem = 2;
    petKeyChat = iDPet;
    fFrom = fR;
    tTO = tO;
    //alert(fFrom + '-' + mProf.id);
    loadChatsAbstract(mProf.id, fR, petKeyChat, "#txtMsgChatPop", "#msgChatBoxPop", "#jpopChat1", true);

    stopInterval();

    funThread = function() {
        loadChatsAbstract(mProf.id, fR, petKeyChat, "#txtMsgChatPop", "#msgChatBoxPop", "#jpopChat1", false);
    }

    threadOne = setInterval(funThread, 10000);

    //interValChat.push(threadOne);
}
function loadPetChatInner12(isMine, idPet, idOwner) {
    loadPetChatInner(isMine, idPet, idOwner);
    stopInterval();

    funThread = function() {
        loadPetChatInner(isMine, idPet, idOwner);
    }

    threadOne = setInterval(funThread, 10000);
}

function loadPetChatInner(isMine, idPet, idOwner) {
    // alert(idPet);
    // alert(idOwner);
    petKeyChat = idPet;
    idPetOwner = idOwner;
    //alert(isMine);
    if (isMine) {
        window.location = "#jpopLMensagemInner";
        var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=47&idPet=" + idPet;
        myLoader.show();
        $.ajax({
            url: postTo,
            dataType: "jsonp",
            method: "GET",
            jsonp: 'callback',
            jsonpCallback: 'CHAT_AVATAR',
            success: function(data) {
                //alert(JSON.stringify(data));
                $("#btConfirmAdopt").show();
                mensagens = data.result;
                //alert(JSON.stringify(mensagens));
                content = '<li data-role="divider">Pretendentes para adoção (' + mensagens.length + ')</li>';

                try {
                    for (i = 0; i < mensagens.length; i++) {

                        var mP = mensagens[i];
                        //;
                        var pathImageChat;

                        var pathImageChat = mP.getPath.replace("http:", "https:");


                        content += '<li><a href="#" onclick=setChat("' + mP.getKey + '","' + idPetOwner + '","' + petKeyChat + '")><img src="' + pathImageChat
                                + '" style="border-radius: 50%;border-radius:1px" width="180"><h4>' + mP.getNome
                                + '</h4></a></li>';
                    }

                } catch (e) {
                    alert(e);
                } finally {
                    $("#listPetMessagesInner").html(content);
                    $("#listPetMessagesInner").listview("refresh");
                    myLoader.hide();
                }

                //myLoader.hide();
                //alert(JSON.stringify(data));*/
                myLoader.hide();
            },
            error: function(err) {
                //myLoader.hide();
                //alert(err);
                myLoader.hide();
            }

        });
    } else {
        chatFromTo.f = mProf.id;
        chatFromTo.t = idOwner;
        chatFromTo.p = idPet;

        var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=48&pet=" + idPet + "&from=" + mProf.id + "&to=" + idOwner;
        window.location = "#jpopChat1";
        myLoader.show();
        $.ajax({
            url: postTo,
            dataType: "jsonp",
            method: "GET",
            jsonp: 'callback',
            jsonpCallback: 'CHAT_MSG',
            success: function(data) {
                //alert(JSON.stringify(data));
                // $("#").css({position: 'fixed', top: '3'});
                //$("#jpopChat1").popup("open");
                $("#btConfirmAdopt").hide();
                $("#txtMsgChatPop").val("");
                $("#msgChatBoxPop").html('');
                $("#msgChatBoxPop").listview("refresh");
                //alert(JSON.stringify(data));
                //alert(localStorage.getItem("myPets"));
//msgChatBoxPop
                mensagens = data.chats;
                // alert(JSON.stringify(mensagens));
                content = '<h3>Mensagens de adoção</h3><li data-role="divider">Mensagens (' + mensagens.length + ')</li>';

                try {
                    for (i = 0; i < mensagens.length; i++) {

                        var mP = mensagens[i];
                        //;
                        var pathImageChat;

                        var pathImageChat = mP.getPath.replace("http:", "https:");


                        content += '<li><img src="' + pathImageChat
                                + '" style="border-radius: 50%;border-radius:1px" width="180"><p>' + mP.getNome + '</p><h4>' + mP.getMsg
                                + '</h4><p>' + mP.getTimestampChat
                                + '</p></li>';
                    }

                } catch (e) {
                    alert(e);
                } finally {
                    $("#msgChatBoxPop").html(content);
                    $("#msgChatBoxPop").listview("refresh");
                    myLoader.hide();
                }

                //myLoader.hide();
                //alert(JSON.stringify(data));*/
                myLoader.hide();
            },
            error: function(err) {
                //myLoader.hide();
                //alert(err);
                myLoader.hide();
            }

        });
    }

}


function loadPetChats() {
    window.location = "#jpopLMensagem";

    //46&idProfile=10210293740438879

    var postTo = "https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=46"
            + "&idProfile=" + mProf.id;

    myLoader.show();
    $.ajax({
        url: postTo,
        dataType: "jsonp",
        method: "GET",
        jsonp: 'callback',
        jsonpCallback: 'CHAT_LIST',
        success: function(data) {
            //alert(JSON.stringify(data));

            //$("#txtMsgChat").val("");
            $("#listPetMessages").html('');
            $("#listPetMessages").listview("refresh");
            // alert(JSON.stringify(data));
            //alert(localStorage.getItem("myPets"));

            mensagens = data.petMessages;
            //alert(JSON.stringify(mensagens));
            content = '<li data-role="divider">Você tem (' + mensagens.length + ') processos de adoção</li>';

            try {
                for (i = 0; i < mensagens.length; i++) {

                    var mP = mensagens[i];
                    //;
                    var pathImageChat;

                    var pathImageChat = mP.getPath.replace("http:", "https:");


                    content += '<li><a href="#" onclick=loadPetChatInner12(' + mP.mine + ',"' + mP.getKey + '","' + mP.getIdOwner + '")><img src="' + pathImageChat
                            + '" style="border-radius: 50%;border-radius:1px" width="180"><h4>' + mP.getTitulo
                            + '</h4></a></li>';
                }

            } catch (e) {
                alert(e);
            } finally {
                $("#listPetMessages").html(content);
                $("#listPetMessages").listview("refresh");
                myLoader.hide();
            }

            //myLoader.hide();
            //alert(JSON.stringify(data));*/
            myLoader.hide();
        },
        error: function(err) {
            //myLoader.hide();
            //alert(err);
            myLoader.hide();
        }

    });
}