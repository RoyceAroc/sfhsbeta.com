const param = new URLSearchParams(window.location.search);
const id = param.get("id") || getCookie("id");
const email = param.get("email") || getCookie("email");
const username = param.get("name") || getCookie("name");
const picture = param.get("picture") || getCookie("picture");
var admin = param.get("admin") || getCookie("admin");
const error = param.get("error") || null;

if(error == undefined) {
    if(admin != undefined || getCookie("admin") != undefined) {
        if(admin == undefined) {
            admin = getCookie("admin");
        } 
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText == "false") {
                    window.location.href = googleAuthLink;
                } else {
                    setCookie("id", id, 365);
                    setCookie("email", email, 365);
                    setCookie("name", username, 365);
                    setCookie("picture", picture, 365);
                    setCookie("admin", admin, 365);
                    $("#navbar-login").html("Logout");
                    $("#navbar-login").attr("href","javascript:logout()");
                    adminSetup(this.responseText);
                }
            } 
        };
        xhttp.open("POST", `${productionLink}/admin-data`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(admin);
    } else {
        if(getCookie("email") != undefined || getCookie("email") == "") {
            memberSetup();
        } else {
            if(email != undefined) {
                setCookie("id", id, 365);
                setCookie("email", email, 365);
                setCookie("name", username, 365);
                setCookie("picture", picture, 365);
                $("#navbar-login").html("Logout");
                $("#navbar-login").attr("href","javascript:logout()");
                memberSetup();
            } else {
                window.location.href = googleAuthLink;
            }
        }
    }
} else {
    switch (parseInt(error)) {
        /** Login errors */
        case 501:
            setErrorAlert("Error", "Invalid Google Account. Please sign in with your forsythk12 account. Ex: johndoe@forsythk12.org. Contact us if you have any questions.", {"labels":["Go Back", 'authScreen();']});
          break;
        case 502:
            setErrorAlert("Error", "There seems to be an error with signing you in. Please reach out to us ASAP.", {"labels":["Go Back", 'authScreen();']});
        break;
        case 503:
            setErrorAlert("Error", "You have not been added as a member on the SFHS Beta Member Spreadsheet. Reach out to us ASAP if you think this is a mistake.", {"labels":["Go Back", 'authScreen();']});
        break;

        /** Non-Signature Project Form error */
        case 504: 
        setErrorAlert("Project Submission Error", "There was an error when submitting your service project. Please try again or contact us ASAP.", {"labels":["Go Back", 'hideAlertModal();']});
    }
}


function environmentConstant() {
   // document.getElementById("attendance-video").pause();
}

document.addEventListener('visibilitychange', function() {
   if(document.visibilityState == "hidden") {
       environmentConstant();
   }
})

var current_display = 1;

function switchSect(i) {
    if(current_display != i) {
        document.getElementById(current_display).classList.remove("active");
        document.getElementById(i).classList.add("active");
        document.getElementById("section-" + current_display).style.display = "none";
        document.getElementById("section-" + i).style.display = "block";
        current_display = i;
    }
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    if(rhours == 1) {
        if(minutes == 0) {
            return `1 hour`
        } else {
            return `1 hour ${rminutes} minutes`
        } 
    } else {
        if(minutes == 0) {
            return `${rhours} hours`
        } else {
            return `${rhours} hours ${rminutes} minutes`
        } 
    }
}

function data_setup(obj) {
    /* Past Attendance Tab */
    console.log(obj.attendance.past_attendance.length);
    for(let i=0; i<obj.attendance.past_attendance.length; i++) {
        let main_div = document.createElement("li");
        main_div.innerHTML = 
        `
        ${obj.attendance.past_attendance[i].completed ? "<b>COMPLETED</b>": "<b>INCOMPLETE</b>"} attendance for ${obj.attendance.past_attendance[i].type} meeting. View the <a target="_blank"  href="${obj.attendance.past_attendance[i].video_url}"> Meeting Video</a>. View the <a target="_blank"  href="${obj.attendance.past_attendance[i].slideshow_url}"> Meeting Slideshow Presentation</a>. 
        `;
       document.getElementById("p_attendance").appendChild(main_div);
    }
    for(let i=0; i<obj.attendance.current_attendance.length; i++) {
        let main_div = document.createElement("li");
        main_div.innerHTML = 
        `
        ${obj.attendance.current_attendance[i].completed ? "<b>COMPLETED</b>": "<b>INCOMPLETE</b>"} attendance for ${obj.attendance.current_attendance[i].type} meeting. View the <a target="_blank"  href="${obj.attendance.current_attendance[i].video_url}"> Meeting Video</a>. View the <a target="_blank"  href="${obj.attendance.current_attendance[i].slideshow_url}"> Meeting Slideshow Presentation</a>. 
        `;
       document.getElementById("p_attendance").appendChild(main_div);
    }
    /* NonSignatureService Project Tab */
    document.getElementById("nonSignatureForm").action = `${productionLink}/submitNonSignatureServiceProject`;
    let token = 0; 
    if(obj.nonSignatureServiceProjects.length > 0) {
        for(let i=0; i<obj.nonSignatureServiceProjects.length; i++) {
            let main_div = document.createElement("div");
            main_div.innerHTML = 
            `
            <div style="background-color: ${obj.nonSignatureServiceProjects[i].status == 'accepted' ? "green": (obj.nonSignatureServiceProjects[i].status == 'rejected' ? "red": "grey")}; padding: 20px; border-radius: 10px; text-align: center; color: white; margin-bottom: 30px;">
                <h2> ${obj.nonSignatureServiceProjects[i].status == 'accepted' ? "ACCEPTED": (obj.nonSignatureServiceProjects[i].status == 'rejected' ? "REJECTED": "PENDING")}</h2>
                <div style="text-align: left;">
                    <p>
                        <a style="color: white;text-decoration: none;" data-bs-toggle="collapse" href="#token${token}" role="button" aria-expanded="false" aria-controls="token${token}">
                            Project Hours ⌛
                        </a>
                    </p>
                    <div style="color: black;" class="collapse" id="token${token}">
                        <div class="card card-body">
                            ${timeConvert(parseInt(obj.nonSignatureServiceProjects[i].minutes))} 
                        </div>
                    </div>
                    <p style="margin-top: 9px;" >
                        <a style="color: white;text-decoration: none;" data-bs-toggle="collapse" href="#tokenB${token}" role="button" aria-expanded="false" aria-controls="tokenB${token}">
                            Project Description 📋
                        </a>
                    </p>
                    <div style="color: black;" class="collapse" id="tokenB${token}">
                        <div class="card card-body">
                            ${obj.nonSignatureServiceProjects[i].description} 
                        </div>
                    </div>
                    <p style="margin-top: 9px;">
                        <a style="color: white;text-decoration: none;" data-bs-toggle="collapse" href="#tokenC${token}" role="button" aria-expanded="false" aria-controls="tokenC${token}">
                            Reviewed Comment 💬
                        </a>
                    </p>
                    <div style="color: black;" class="collapse" id="tokenC${token}">
                        <div class="card card-body">
                        ${obj.nonSignatureServiceProjects[i].comment == undefined ? "Service project is still under review": obj.nonSignatureServiceProjects[i].comment} 
                        </div>
                    </div>
                </div>
            </div>
            `;
            token++; 
            main_div.classList.add("col-12"); main_div.classList.add("col-md-6"); main_div.classList.add("col-lg-4");
           document.getElementById("past_submissions").appendChild(main_div);
        }
    } else {
        document.getElementById("past_submissions").innerHTML = "You haven't submitted any non-signature projects yet!";
        document.getElementById("past_submissions").style.marginLeft = "0px";
    }

    /* Account Tab */
    document.getElementById("user_img").src = getCookie("picture");
    document.getElementById("user_name").innerHTML = `Name: ${getCookie("name")}`;
    document.getElementById("user_email").innerHTML = `Email: ${getCookie("email")}`;
    document.getElementById("user_id").innerHTML = `Member ID: ${getCookie("id")}`;

}

function memberSetup() {
    window.onload = (event) => {
        document.getElementById("portal").style.opacity = "1";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                data_setup(JSON.parse(this.responseText));
            } 
        };
        xhttp.open("POST", `${productionLink}/member-setup`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(email);
    };
}

function adminSetup(data) {
    document.getElementById("portal").innerHTML = data;
    document.getElementById("portal").style.opacity = "1";
}


function SetVolume(val)
{
    var player = document.getElementById('attendance-video');
    console.log('Before: ' + player.volume);
    player.volume = val / 100;
    console.log('After: ' + player.volume);
}


function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
        $('.image-upload-wrap').hide();
        if(e.target.result.includes("application/pdf")) {
            $('.file-upload-image').attr('src', '');
            document.getElementById("uploaded_img").style.display = "none";
            $('.remove-image').css('margin-top', '30px');
        } else {
            $('.file-upload-image').attr('src', e.target.result);
            document.getElementById("uploaded_img").style.display = "block";
            $('.remove-image').css('margin-top', '0px');
        }
        $('.file-upload-content').show();
        $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}
  
function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-image').attr('src', '');
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

function validateNonSignatureForm() {
    let upload_image = document.getElementById("document_file").files.length;
    let description = document.getElementById("description_nonsignature").value;
    let s_hours = document.getElementById("s_hours").value;
    let s_minutes = document.getElementById("s_minutes").value;
    if(s_hours == "0" && s_minutes == "1") {
        setAlert("Select your project hours", "How many hours/minutes did your project take? Please select the appropriate fields. ", {"labels":["Add Hours", 'hideAlertModal();']});
    } else {
        if(description != "") {
            if(upload_image != 0) {
                document.getElementById("userID").value = email;
                return true;
            } else {
                setAlert("Incomplete field", "Please upload some sort of proof that you participated in your service project/opportunity", {"labels":["Add Proof", 'hideAlertModal();']});
            }
        } else {
            setAlert("Incomplete field", "Don't forget to describe your service project!", {"labels":["Add Description", 'hideAlertModal();']});
        }
    }
    return false;
}

