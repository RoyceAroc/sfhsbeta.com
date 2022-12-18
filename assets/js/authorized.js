const param = new URLSearchParams(window.location.search);
const id = param.get("id") || getCookie("id");
const email = param.get("email") || getCookie("email");
const username = param.get("name") || getCookie("name");
const picture = param.get("picture") || getCookie("picture");
var admin = param.get("admin") || getCookie("admin");
const error = param.get("error") || null;
var total = 0;
var mainObj;

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
    console.log(obj);
    /* Past Attendance Tab */
    for(let i=0; i<obj.attendance.past_attendance.length; i++) {
        let main_div = document.createElement("li");
        main_div.innerHTML = 
        `
        ${obj.attendance.past_attendance[i].completed ? "<b>COMPLETED</b>": "<b>INCOMPLETE</b>"} attendance for the ${obj.attendance.past_attendance[i].type} meeting. View the <a target="_blank"  href="${obj.attendance.past_attendance[i].video_url}"> Meeting Video</a>. View the <a target="_blank"  href="${obj.attendance.past_attendance[i].slideshow_url}"> Meeting Slideshow Presentation</a>. 
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

 /*    if(obj.attendance.current_attendance[i].type == "December" && !obj.attendance.current_attendance[i].completed) {
        document.getElementById("monthly_video").style.display = "block";
    } else if(obj.attendance.current_attendance[i].type == "December" && obj.attendance.current_attendance[i].completed) {
        document.getElementById("monthly_video").style.display = "none";
        document.getElementById("completed_video").style.display = "block";
    }*/

    }
    
   /* document.getElementById("nonSignatureForm").action = `${productionLink}/submitServiceProjectSubmission`;
    let token = 0; 
    if(obj.nonSignatureServiceProjects.length > 0) {
        for(let i=0; i<obj.nonSignatureServiceProjects.length; i++) {
            let main_div = document.createElement("div");
            main_div.innerHTML = 
            `
            <div style="background-color: ${obj.nonSignatureServiceProjects[i].status == 'approved' ? "green": (obj.nonSignatureServiceProjects[i].status == 'denied' ? "red": "grey")}; padding: 20px; border-radius: 10px; text-align: center; color: white; margin-bottom: 30px;">
                <h2> ${obj.nonSignatureServiceProjects[i].status == 'approved' ? "APPROVED": (obj.nonSignatureServiceProjects[i].status == 'denied' ? "DENIED": "PENDING")}</h2>
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
                        ${obj.nonSignatureServiceProjects[i].comment == undefined ? "No comment": obj.nonSignatureServiceProjects[i].comment} 
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
        document.getElementById("past_submissions").innerHTML = "You haven't submitted service projects yet!";
        document.getElementById("past_submissions").style.marginLeft = "0px";
    }
    */
    /* Hour Status Tab */
    /*if(obj.makeUpHours > 0) {
        document.getElementById("content_makeupstatus").innerHTML = `
        <span style="background-color: #FF7F7F;">You have to make up an additional ${obj.makeUpHours} hours this semester due to incomplete hours from last year. </span>
        <br> All members are required to submit 7 hours of service this semester, in addition to watching all videos to maintain active status. Once your hours are verified, they will appear below.
        `;
    } else {
        document.getElementById("content_makeupstatus").innerHTML = `
        <span style="background-color: #50C878;">Congrats on being an active member! You do not have any hours that you have to make up this year. </span>
        <br> All members are required to submit 7 hours of service this semester, in addition to watching all videos to maintain active status. Once your hours are verified, they will appear below.
        `;
    }*/
    console.log(obj.hourStatus);
    if(obj.hourStatus.fall_status == 0) {
        document.getElementById("content_hourstatus").innerHTML = `
        <span style="background-color: #50C878;">Congrats on being an active member!</span>
        <br>
        <h4> <b> Note </b> <br>
        If you are a new member, skip the next section since you didn't have to submit any hours first semester and you have active status!
        <br>
        <h4> <b> Old Members - How the math works? </b> <br> You had to make up ${obj.hourStatus.make_up} hour(s) from the last school year. You submitted ${obj.hourStatus.fall_hours} hour(s) this semester and completed ${obj.hourStatus.fall_attendance} hour(s) in meeting attendance. 
        Your fall status was calculated by the formula as follows: <br><br> <center> [make up hours] + [10 hours this semester] - [fall hours] - [attendance - 1 hour buffer] </center> <br> 
        In other words, you had to submit a minimum of 10 hours plus your make up hours from last year through watching the meetings and submitting hours to the 'Service Project Submissions' form. 
        With that being said, you met all the requirements!!
        <br> 
        <h4> <b> What's next? </b> <br> 
        Once again, all members are required to submit 7 hours of service during second semester, in addition to watching all videos to maintain active status.
        <br>
        <h4> <b> Any questions/concerns? </b> <br>
        Please email us at sfhsbeta@gmail.com and we will correct any mistakes as we see fit! 
        `;
    } else {
        document.getElementById("content_hourstatus").innerHTML = `
        <span style="background-color: #FF7F7F;">You have to make up an additional ${obj.hourStatus.fall_status} hour(s) this semester.</span>
        <br>
        <h4> <b> How the math works? </b> <br> You had to make up ${obj.hourStatus.make_up} hour(s) from the last school year. You submitted ${obj.hourStatus.fall_hours} hour(s) this semester and completed ${obj.hourStatus.fall_attendance} hour(s) in meeting attendance. 
        Your fall status was calculated by the formula as follows: <br><br> <center> [make up hours] + [10 hours this semester] - [fall hours] - [attendance - 1 hour buffer] </center> <br> 
        In other words, you had to submit a minimum of 10 hours plus your make up hours from last year through watching the meetings and submitting hours to the 'Service Project Submissions' form. 
        <br>
        <h4> <b> Computing your hours </b> <br>
        ${obj.hourStatus.make_up} + 10 - ${obj.hourStatus.fall_hours} - (${obj.hourStatus.fall_attendance} - 1) = ${obj.hourStatus.fall_status} hour(s) that you have to make up this semester. 
        <br> 
        <h4> <b> What's next? </b> <br> 
        Once again, all members are required to submit 7 hours of service during second semester, in addition to watching all videos to maintain active status.
        <br>
        <h4> <b> Any questions/concerns? </b> <br>
        Please email us at sfhsbeta@gmail.com and we will correct any mistakes as we see fit! 
        `;
    }
    /* Account Tab */
    document.getElementById("user_img").src = getCookie("picture");
    document.getElementById("user_name").innerHTML = `Name: ${getCookie("name")}`;
    document.getElementById("user_email").innerHTML = `Email: ${getCookie("email")}`;
    document.getElementById("user_id").innerHTML = `Member ID: ${getCookie("id")}`;


    /* COMPLETED */
    document.getElementById("loader").style.display = "none";
    document.getElementById("dashboardNav").style.display = "block";
    document.getElementById("section-1").style.display = "block";
    if(document.getElementById("main_video")) {
       // document.getElementById("main_video").controls = false;
    }
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

function showSection(num) {
    for(let i=0; i<3; i++) {
        document.getElementById(i+"-section").style.display = "none";
    }
    document.getElementById(num+"-section").style.display = "block";
}

function goBack() {
    displayPortal();
    document.getElementById("_groupfile").style.display = "none";
    document.getElementById("_tabgroup").style.display = "table";
    document.getElementById("_searchgroup").style.display = "flex";
    document.getElementById("_groupfile").innerHTML = `
    <button onclick="goBack()"> Go Back </button>
    `
}

function updateProject(user_id, proj_relation, number) {
    let approved = document.getElementById(`${number}-flexRadioDefault1`).checked;
    let denied = document.getElementById(`${number}-flexRadioDefault2`).checked;
    let comment = document.getElementById(`${number}-comment_textarea`).value;
    if(!approved && !denied) {
        alert("Choose to either approve or deny the project!")
    } else {
        // Send request to server

        var data = {
            "user_id": user_id,
            "proj_relation": proj_relation,
            "approved": "denied",
            "comment": comment
        };

        if(approved) {
            data = {
                "user_id": user_id,
                "proj_relation": proj_relation,
                "approved": "approved",
                "comment": comment
            };
        } 
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText == "Done!") {
                    // Success updating it
                    /* Update mainObj */
                    for(let i=0; i<mainObj.nonSignatureServiceProjects.length; i++) {
                        if(mainObj.nonSignatureServiceProjects[i].userid == user_id) {
                            for(let m=0; m<mainObj.nonSignatureServiceProjects[i].projects.length; m++) {
                                if(mainObj.nonSignatureServiceProjects[i].projects[m].relation == proj_relation) {
                                    if(approved) {
                                        mainObj.nonSignatureServiceProjects[i].projects[m].status = "approved";
                                    } else {
                                        mainObj.nonSignatureServiceProjects[i].projects[m].status = "denied";
                                    }
                                    mainObj.nonSignatureServiceProjects[i].projects[m].comment = comment;
                                }
                            }
                        }
                    }
                    /* Update panel */
                    if(approved) {
                        document.getElementById(number + '-obj').innerHTML = 'approved';
                    } else {
                        document.getElementById(number + '-obj').innerHTML = 'denied';
                    }
                    let panelElem = document.getElementById(number + '-obj').nextSibling.nextSibling.childNodes;
                    for(let j=0; j<panelElem.length; j++) {
                        if((panelElem[j].className == 'form-check' || panelElem[j].className == 'mb-3') || panelElem[j].tagName == 'BUTTON') {
                            panelElem[j].remove();
                        } 
                    }
                    document.getElementById(number + '-obj').classList.toggle("Aactive");
                    document.getElementById(number + '-obj').nextSibling.nextSibling.style.display = "none";
                } else {
                    alert("Error! Try again!");
                }
            } 
        };
        xhttp.open("POST", `${productionLink}/admin-updateProject`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(data));
    }
}

function updateHourLog(userid) {
    let denied = document.getElementById(`user1-flexRadioDefault2`).checked;
    let comment = document.getElementById(`user1-comment_textarea`).value;

        // Send request to server

        var data = {
            "user_id": userid,
            "approved": "Denied",
            "note": comment
        };

        if(!denied) {
            data = {
                "user_id": userid,
                "approved": "Approved",
                "note": comment
            };
        } 
        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if(this.responseText == "Done!") {
                    // Success updating it
                    /* Update mainObj */
                    for(let m=0; m<obj.memberLogistics.length; m++) {
                        if(obj.memberLogistics[m].user_id == userid) {
                            obj.hourStatus.push({
                                id: userid,
                                status: data.approved,
                                note: comment
                            });
                        }
                    }
                    goBack1();
                } else {
                    alert("Error! Try again!");
                }
            } 
        };
        xhttp.open("POST", `${productionLink}/admin-updateHourLog`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(data));
}

function displayPortal() {
    obj = mainObj;
    document.getElementById("_tabgroup").innerHTML = "";
    document.getElementById("_tabgroup").innerHTML = `
    <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Grade</th>
          <th>Pending</th>
          <th>Approved</th>
          <th>Denied</th>
    </tr>
    `;
    var firstName = ""; var lastName = ""; var grade = 0; var pending = 0; var approved = 0; var denied = 0;
    for(let i=0; i<obj.nonSignatureServiceProjects.length; i++) {
        let userid = obj.nonSignatureServiceProjects[i].userid;
        for(let m=0;m<obj.memberLogistics.length; m++) {
            if(obj.memberLogistics[m].user_id == userid) {
                firstName = obj.memberLogistics[m].firstName;
                lastName = obj.memberLogistics[m].lastName;
                if(obj.memberLogistics[m].grade == 0) {
                    grade = 12;
                } else if(obj.memberLogistics[m].grade == 1) {
                    grade = 11;                    
                } else {
                    grade = 10;
                }
            }
        }
        for(let j=0; j<obj.nonSignatureServiceProjects[i].projects.length; j++) {
            let status = obj.nonSignatureServiceProjects[i].projects[j].status;
            if(status == "pending") {
                pending++;
            } else if(status == "denied") {
                denied++;
            } else {
                approved++;
            }
        }
        if(document.getElementById('name_search-ns').value == "" || (firstName.toUpperCase().includes(document.getElementById('name_search-ns').value.toUpperCase()) || lastName.toUpperCase().includes(document.getElementById('name_search-ns').value.toUpperCase()))) {
            let gradeSearch = document.getElementById('grade_search-ns').value;
            if(gradeSearch == 0 || ((gradeSearch == 1 && grade == 10) || ((gradeSearch == 2 && grade == 11)||(gradeSearch == 3 && grade == 12))) ) {
                let statusSearch = document.getElementById('status_search-ns').value;
                if((statusSearch == 3 || (statusSearch == 0 && pending != 0)) || ((statusSearch == 1 && approved !=0) || (statusSearch == 2 && denied !=0))) {
                    const trelement = document.createElement("tr");
                    let trobj = `
                    <td> ${firstName} </td>
                    <td> ${lastName} </td>
                    <td> ${grade} </td>
                    <td> ${pending} </td>
                    <td> ${approved} </td>
                    <td> ${denied} </td>
                    `;
                    trelement.innerHTML = trobj;
                    trelement.onclick = function() {
                        let user_id = obj.nonSignatureServiceProjects[i].userid;
                        document.getElementById("_tabgroup").style.display = "none";
                        document.getElementById("_searchgroup").style.display = "none";
                        document.getElementById("_groupfile").innerHTML = 
                        `
                            <button onclick="goBack()"> Go Back </button>
                        `
                        let basicText = document.createElement("div");
                        basicText.innerHTML = `
                        Student ID: ${user_id} <br>
                        `
                        document.getElementById("_groupfile").appendChild(basicText);
                        total = obj.nonSignatureServiceProjects[i].projects.length;
                        for(let j=0; j<obj.nonSignatureServiceProjects[i].projects.length; j++) {
                            let status = obj.nonSignatureServiceProjects[i].projects[j].status;
                            let text = document.createElement("div");
                            var subtext = document.createElement("div");
                            if(status == "pending") {
                                subtext = `
                                <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="${j}-flexRadioDefault1" checked>
                                <label class="form-check-label" for="flexRadioDefault1">
                                    Approved
                                </label>
                                </div>
                                <div class="form-check">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="${j}-flexRadioDefault2">
                                <label class="form-check-label" for="flexRadioDefault2">
                                    Denied
                                </label>
                                </div>
                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label">Optional Comment</label>
                                    <textarea class="form-control" id="${j}-comment_textarea" rows="3"></textarea>
                                </div>
                                <button onclick="updateProject(${user_id},'${obj.nonSignatureServiceProjects[i].projects[j].relation}', ${j})"> Approve/Deny Project </button><br><br>
                                `
                            } 
                            text.innerHTML = `
                                <button id="${j}-obj" class="accordion">${status}</button>
                                <div class="panel">
                                <br>
                                <iframe style="margin: 0 auto;display: block;min-height: 300px; min-width: 300px;" src="https://docs.google.com/file/d/${obj.nonSignatureServiceProjects[i].projects[j].relation}/preview?usp=drivesdk">
                                </iframe>
                                <br>
                                <b>Description: </b> ${obj.nonSignatureServiceProjects[i].projects[j].description} <br>
                                <b>Comment: </b> ${obj.nonSignatureServiceProjects[i].projects[j].comment == "" ? "No comment added yet." : obj.nonSignatureServiceProjects[i].projects[j].comment} <br>
                                <b>Total minutes: </b> ${obj.nonSignatureServiceProjects[i].projects[j].minutes} 
                                ${status == "pending" ? subtext : ""}
                                </div>
                            `
                            
                            document.getElementById("_groupfile").appendChild(text);
                            document.getElementById(j+"-obj").addEventListener("click", function() {
                                this.classList.toggle("Aactive");
                                var panel = this.nextElementSibling;
                                if (panel.style.display === "block") {
                                    panel.style.display = "none";
                                } else {
                                    panel.style.display = "block";
                                }
                            });
                        }
                        document.getElementById("_groupfile").style.display = "block";
                    };
                    
                    document.getElementById("_tabgroup").appendChild(trelement);
                }
            }
        }
    firstName = ""; lastName = ""; grade = 0; pending = 0; approved = 0; denied = 0;
    }
   
}
let dds = ""; let mdds = 0;

function adminSetup(data) {
    document.getElementsByTagName("body")[0].style.backgroundColor = "lightgrey";
   // document.getElementById("dashboardNav").style.display = "none";
   // document.getElementById("dashboard_img").style.display = "none";
   // document.getElementsByTagName("footer")[0].style.display = "none";
    document.getElementById("portal").style.marginTop = "78px";
    document.getElementById("portal").innerHTML = data;
    //Get necessary data for components
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText == "false") {
                alert("Error!");
                location.reload();
            } else {
                mainObj = JSON.parse(this.responseText);
                console.log(mainObj);
                displayPortal();
                var acc = document.getElementsByClassName("accordion");
                var i;

                    for (i = 0; i < acc.length; i++) {
                    acc[i].addEventListener("click", function() {
                        this.classList.toggle("Aactive");
                        var panel = this.nextElementSibling;
                        if (panel.style.display === "block") {
                        panel.style.display = "none";
                        } else {
                        panel.style.display = "block";
                        }
                    });
                }
                // Edit Vol Op
                let urlA = "https://raw.githubusercontent.com/RoyceAroc/sfhsbeta.com/main/web/data/content/files/volunteeringOpportunities.json";

let settings = { method: "Get" };

fetch(urlA, settings)
    .then(res => res.json())
    .then((json) => {
        let a = json;
        for(let i=0; i<a.length; ++i) {
            if(a[i] != null) {
                let test = document.createElement("option");
                test.value = i;
                test.innerHTML = a[i].title;
                document.getElementById("editOp").appendChild(test);
            }
    
        }
        while(true) {
            let m = 0;
            m++;
            if(a[m] != null) {
                updateOP(m, a);
                break;
            }
            if(m == a.length - 1) {break;}
        }
        document.getElementById("editOp").addEventListener("change", function() {
           updateOP(document.getElementById("editOp").value, a);
        });
    });
                // 
               document.getElementsByTagName("body")[0].style.backgroundColor = "white";
               document.getElementById("portal").style.opacity = "1";
            }
        } 
    };
    xhttp.open("POST", `${productionLink}/admin-data-components`, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(admin);

    // Finished adding data into components
}

function updateVOP() {

    let dataABC = {
        title: document.getElementById("op1").value,
        description: document.getElementById("op2").innerHTML,
        links: document.getElementById("oldOP").innerHTML,
        image: dds,
        value: mdds
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let a = this.responseText;
            window.location = "dashboard.html";
        } 
    };
    xhttp.open("POST", `${productionLink}/updateVOP`, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(dataABC));
}


function deleteVOP() {
    let dataABC = {
        value: mdds
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let a = this.responseText;
            window.location = "dashboard.html";
        } 
    };
    xhttp.open("POST", `${productionLink}/deleteVOP`, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(JSON.stringify(dataABC));
}

function updateOP(val, op) {
    mdds = val;
    dds = op[val].image;
    document.getElementById("oldOP").innerHTML = "";
    document.getElementById("op1").value = op[val].title;
    document.getElementById("op2").innerHTML = op[val].body;
    
    for(let i=0; i<op[val].links.length; i++) {
        document.getElementById("oldOP").innerHTML +=
        `<b> Link ${i+1} </b> <br>
        Title: ${op[val].links[i].title} <br>
        Link: ${op[val].links[i].href} <br><br>`;
    }
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

function validateHourLogForm() {
    let upload_file = document.getElementById("document_file_hourLog").files.length;
    if(upload_file != 0) {
        document.getElementById("userID_hourLog").value = email;
        return true;
    } else {
        setAlert("Incomplete field", "Upload your hour log", {"labels":["Upload hour log", 'hideAlertModal();']});
    }
    return false;
}


function showCreateVolunteeringOpportunity() {
    document.getElementById("createVoluOP").style.display = "block";
}

function showEditVolunteeringOpportunity() {
    document.getElementById("editVoluOP").style.display = "block";
}

function closeEditVolunteeringOpportunity() {
    document.getElementById("editVoluOP").style.display = "none";
}

function closeCreateVolunteeringOpportunity() {
    document.getElementById("createVoluOP").style.display = "none";
}


 function validateVolunteeringOpportunity() {
    document.getElementById("volOPS").action = `${productionLink}/addVolunteeringOpportunity`;
    let upload_image = document.getElementById("document_file").files.length;
    let title = document.getElementById("title_volunteeringOP").value;
    let description = document.getElementById("description_volunteeringOP").innerHTML;
    let links = document.getElementById("links_volunteeringOP").innerHTML;
    document.getElementById("d_d").value = description.replace(/(\r\n|\n|\r)/gm, "");
    document.getElementById("l_l").value = links.replace(/(\r\n|\n|\r)/gm, "");
    if(title == "") {
        alert("Please type a title!");
    } else {
        if(description != "") {
            if(upload_image != 0) {
                return true;
            } else {
                alert("You need to upload an image!");
            }
        } else {
            alert("Add a Description!");
        }
    }
    return false;
 }


function completedAttendance(correct) {
    if(correct >= 2) {
        let dataABC = {
            "present": true,
            "userID": email,
            "init": 3
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let a = this.responseText;
                window.location = "dashboard.html";
            } 
        };
        xhttp.open("POST", `${productionLink}/checkAttendanceForMonth`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(dataABC));
    } else {
        let dataABC = {
            "present": false,
            "userID": email,
            "init": 3
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let a = this.responseText;
                window.location = "dashboard.html";
            } 
        };
        xhttp.open("POST", `${productionLink}/checkAttendanceForMonth`, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(JSON.stringify(dataABC));
    }
}