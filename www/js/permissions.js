/*
 @Morettic.com.br


 @Request device permissions

 */

function initPermissions() {
    var permissions = cordova.plugins.permissions;
    //alert(JSON.stringify(permissions));

    /*permissions.hasPermission(permissions.ACCESS_COARSE_LOCATION, function(status) {
     if (status.hasPermission) {
     console.log("Yes :D ");
     }
     else {
     permissions.requestPermission(permissions.ACCESS_COARSE_LOCATION, successerrorPermission, errorPermission);
     console.warn("No :( ");
     }
     });*/
    permissions.hasPermission(permissions.ACCESS_FINE_LOCATION, function(status) {
        if (status.hasPermission) {
            console.log("Yes :D ");
        }
        else {
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, successerrorPermission, errorPermission);
            console.warn("No :( ");
        }
    });
    permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, function(status) {
        if (status.hasPermission) {
            console.log("Yes :D ");
        }
        else {
            permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, successerrorPermission, errorPermission);
            console.warn("No :( ");
        }
    });
    permissions.hasPermission(permissions.INTERNET, function(status) {
        if (status.hasPermission) {
            console.log("Yes :D ");
        }
        else {
            permissions.requestPermission(permissions.INTERNET, successerrorPermission, errorPermission);
            console.warn("No :( ");
        }
    });
    /*permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
     if (status.hasPermission) {
     console.log("Yes :D ");
     }
     else {
     permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, successerrorPermission, errorPermission);
     console.warn("No :( ");
     }
     });*/
    permissions.hasPermission(permissions.GET_ACCOUNTS, function(status) {
        if (status.hasPermission) {
            console.log("Yes :D ");
        }
        else {
            permissions.requestPermission(permissions.GET_ACCOUNTS, successerrorPermission, errorPermission);
            console.warn("No :( ");
        }
    });

    //SHA 1 credentials for plugin.......
    /*window.plugins.googleplus.getSigningCertificateFingerprint(
     function(fingerprint) {
     alert(fingerprint);
     }
     );*/
}


function errorPermission() {
    console.warn('Camera permission is not turned on');
}

function successerrorPermission(status) {
    if (!status.hasPermission)
        errorPermission();
}