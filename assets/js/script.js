var googleAuthLink = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fplus.me%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code&client_id=79115833877-9luor8cigdt8n4qfk3rb49nqt0og2ict.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgoogle-auth&flowName=GeneralOAuthFlow';

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
    $(window).on('load', function () {
        $('#modal-title').text(title);
        $('#modal-body').text(body);
        console.log(buttons.labels.length);
        for(let i=0; i<buttons.labels.length; i+=2) {
            var div = document.createElement("div");
            div.innerHTML = `<button type="button" class="btn btn-secondary" onclick="${buttons.labels[i+1]}" data-bs-dismiss="modal">${buttons.labels[i]}</button>`;
            document.getElementById("modal-footer").appendChild(div);
        }
        $('#setModal').modal('show');
    });
}

function authScreen() {
   // window.location.href = googleAuthLink;
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