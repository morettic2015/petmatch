/*
 @Morettic.com.br ALL RIGHT RESERVED!
 https://morettic.com.br
 */
var fFrom = null;
var tTO = null;
var petKeyChat = null;
var idPetOwner = null
var mProf;
var selectedPet = null;
var chatPet = null;
var allPets = [];
var resposta = null;
var isEdit = false;
var petId = 0;
var avatarUrl = null
var pets = [];
var origem = null;

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
        mProf = getProfile();
        if (mProf != null) {

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
                //alert(postTo);
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

            /**
             * UI details
             * */
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
            // Set AdMobAds options:
            admob.setOptions({
                publisherId: "ca-app-pub-5450650045028162/5222338695", // Required
                //interstitialAdId: "ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII", // Optional
                //tappxIdiOS: "/XXXXXXXXX/Pub-XXXX-iOS-IIII", // Optional
                tappxIdAndroid: "/120940746/Pub-17452-Android-9564" // Optional
                        //tappxShare: 0.5                                        // Optional
            });

            // Start showing banners (atomatic when autoShowBanner is set to true)
            admob.createBannerView();

            // Request interstitial (will present automatically when autoShowInterstitial is set to true)
            setInterval(function() {
                admob.requestInterstitialAd();
            }, 180000);
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
///
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