var googleAuthLink;
var productionLink;
var testing = true; // Set to false before deployment

if(testing) {
    googleAuthLink = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=111902926359-qrt4s7bebpvin1st81vpn6rnh1hv5n1o.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgoogle-auth';
    productionLink = 'http://localhost:3000';
} else {
    googleAuthLink = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=111902926359-qrt4s7bebpvin1st81vpn6rnh1hv5n1o.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsfhsbeta.herokuapp.com%2Fgoogle-auth';
    productionLink = 'https://sfhsbeta.herokuapp.com';
}

let maintenance = false;
if(maintenance) {
    googleAuthLink = "maintenance.htm";
    let url = new URL(window.location.href);
    if(url.pathname.includes("dashboard.html")) {
        window.location.href = "maintenance.htm";
    } 
}

function setCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0;i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function logout() {
    eraseCookie("id");
    eraseCookie("email");
    eraseCookie("admin");
    eraseCookie("name");
    eraseCookie("picture");
    let url = new URL(window.location.href);
    if(url.pathname.includes("dashboard.html")) {
        window.location.href = "index.html";
    } else {
        window.location.href = (url.origin + url.pathname);
    }
}

function setAlert(title, body, buttons) {
    $('#modal-title').text(title);
    $('#modal-body').text(body);
    for(let i=0; i<buttons.labels.length; i+=2) {
        var div = document.createElement("div");
        div.innerHTML = `<button type="button" class="btn btn-secondary" onclick="${buttons.labels[i+1]}" data-bs-dismiss="modal">${buttons.labels[i]}</button>`;
        document.getElementById("modal-footer").appendChild(div);
    }
    $('#setModal').modal('show');
}

function setErrorAlert(title, body, buttons) {
    $(window).on('load', function () {
        $('#modal-title').text(title);
        $('#modal-body').text(body);
        for(let i=0; i<buttons.labels.length; i+=2) {
            var div = document.createElement("div");
            div.innerHTML = `<button type="button" class="btn btn-secondary" onclick="${buttons.labels[i+1]}" data-bs-dismiss="modal">${buttons.labels[i]}</button>`;
            document.getElementById("modal-footer").appendChild(div);
        }
        $('#setModal').modal('show');
    });
}

function hideAlertModal() {
    $('#setModal').modal('hide');
    $('#modal-title').text('');
    $('#modal-body').text('');
    document.getElementById("modal-footer").innerHTML = '';
}

function authScreen() {
    window.location.href = googleAuthLink;
}

$(window).on('load', function () {
    $("#main-header").sparkle({
        color: "#FFD700",
        count: 150,
        overlap: 0,
        speed: 0.3,
        minSize: 4,
        maxSize: 7,
        direction: "both"
    });
});
