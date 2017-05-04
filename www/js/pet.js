/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @SHow pet PopUP on Main Screen
 * */
function viewPet(petId) {
    $("#jpop").popup("open");
    selectedPet = allPets[petId];
    //alert(JSON.stringify(selectedPet));
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
    //chatPet = allPets[petId].id;
    //Show adopt button only to others
    if (mProf.id == selectedPet.getIdOwner) {
        $("#btAdotarPetMain").hide();
    } else {
        $("#btAdotarPetMain").show();
    }
    //sendMessageToPetOwner(to, idPet)
    //alert(JSON.stringify(allPets[petId]));

}

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

///Save pet
/**
 *
 * https://gaeloginendpoint.appspot.com/infosegcontroller.exec?action=41&sexo=1&vacinado=1&id=5678508399394816&idOwner=4520495223406592&castrado=1&idade=36&lat=21&lon=48&tit=LindoP555555555555555555555555555555555555et&desc=%20descricao%20do%20pet&sexo=1&vacinado=2&token=000000000000000000000000000000000000000000000000000&porte=3
 *
 * */
function searchForPets() {
    var distance = $("#distance-1").val();
    var intValOfIt = distance * 40;
    intValOfIt = intValOfIt > 4000 ? 4000 : intValOfIt;
    //alert(intValOfIt);
    loadMainPets(localStorage.getItem("lat"), localStorage.getItem("lon"), intValOfIt);
}

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
