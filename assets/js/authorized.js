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
       if(obj.attendance.current_attendance[i]) {
        if(obj.attendance.current_attendance[i].type == "April" && !obj.attendance.current_attendance[i].completed) {
            document.getElementById("monthly_video").style.display = "block";
        } else {
            document.getElementById("completed_video").style.display = "block";
        }
       }
    }
    for(let i=0; i<obj.attendance.current_attendance.length; i++) {
        let main_div = document.createElement("li");
        main_div.innerHTML = 
        `
        ${obj.attendance.current_attendance[i].completed ? "<b>COMPLETED</b>": "<b>INCOMPLETE</b>"} attendance for ${obj.attendance.current_attendance[i].type} meeting. View the <a target="_blank"  href="${obj.attendance.current_attendance[i].video_url}"> Meeting Video</a>. View the <a target="_blank"  href="${obj.attendance.current_attendance[i].slideshow_url}"> Meeting Slideshow Presentation</a>. 
        `;
       document.getElementById("p_attendance").appendChild(main_div);
    }
    /* NonSignatureService Project Tab 
    document.getElementById("nonSignatureForm").action = `${productionLink}/submitNonSignatureServiceProject`;
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
        document.getElementById("past_submissions").innerHTML = "You haven't submitted any non-signature projects yet!";
        document.getElementById("past_submissions").style.marginLeft = "0px";
    }
*/
    /* Hour Log Tab
    document.getElementById("hourLogForm").action = `${productionLink}/submitHourLog`;
    if(obj.hourLog.second_sem.status == "none" || obj.hourLog.second_sem.status == "denied") {
        document.getElementById("show_hourLog").style.display = "block";
    } else {
        document.getElementById("hide_hourLog").style.display = "block";
    }*/
    
    /* Hour Status Tab
    document.getElementById('content_secondsemhourstatus').innerHTML = `
    <h3> Second Semester</h3>
    <h5>
    Status: ${obj.hourLog.second_sem.status == 'pending' ? "Pending Approval" : obj.hourLog.second_sem.status} <br>
    Note: ${obj.hourLog.second_sem.note == undefined ? "None" : obj.hourLog.second_sem.note} <br>
    Hour Log: ${obj.hourLog.second_sem.pdf == 'none' ? "none" : `<iframe style="margin: 0 auto;display: block;min-height: 300px; min-width: 300px;" src="https://docs.google.com/file/d/${obj.hourLog.second_sem.pdf}/preview?usp=drivesdk">
    </iframe> `}
    `;



    if(obj.hourLog.make_up.total == 0) {
        document.getElementById('content_makeupstatus').innerHTML = `<h4 style="color: green;"><b>You do not need to make up any hours this semester </b></h4>`
    } else if(obj.hourLog.make_up.partial_hours != 0) {
        document.getElementById('content_makeupstatus').innerHTML = `<h4 style="color: red;"><b> You need to make up a total of <b> ${obj.hourLog.make_up.total} hours </b>. This is since you only logged ${7-obj.hourLog.make_up.partial_hours} hours last semester and missed ${obj.hourLog.make_up.missed_meetings} meetings.`
    } else if(obj.hourLog.make_up.partial_hours == 0) {
        document.getElementById('content_makeupstatus').innerHTML = `<h4 style="color: red;"><b> You need to make up a total of <b> ${obj.hourLog.make_up.total} hours </b>. This is since you missed ${obj.hourLog.make_up.missed_meetings} meetings.`
    }
    
   */

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
        document.getElementById("main_video").controls = false;
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
    for(let i=0; i<4; i++) {
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

function goBack1() {
    displayPortal1();
    document.getElementById("_groupfile1").style.display = "none";
    document.getElementById("_tabgroup1").style.display = "table";
    document.getElementById("_searchgroup1").style.display = "flex";
    document.getElementById("_groupfile1").innerHTML = `
    <button onclick="goBack1()"> Go Back </button>
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

function displayPortal1() {
    obj = mainObj;
    document.getElementById("_tabgroup1").innerHTML = "";
    document.getElementById("_tabgroup1").innerHTML = `
    <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Grade</th>
          <th>Member</th>
          <th>Status</th>
    </tr>
    `;
    var firstName = ""; var lastName = ""; var grade = 0; var member = ""; var status = "Missing"; var note = "None"; var userID = ""; var pdf = "";
    for(let i=0; i<obj.memberLogistics.length; i++) {
        
        firstName = obj.memberLogistics[i].firstName;
        lastName = obj.memberLogistics[i].lastName;
        if(obj.memberLogistics[i].grade == 0) {
            grade = 12;
        } else if(obj.memberLogistics[i].grade == 1) {
            grade = 11;                    
        } else {
            grade = 10;
        }
            
        
        for(let j=0; j<obj.newMembers.length; j++) {
            if(grade == 12) {
                if(obj.newMembers[0].seniors == "*") {
                    member = "New";
                } else if(obj.newMembers[0].seniors == "-") {
                    member = "Old";
                } else if(obj.newMembers[0].seniors.includes(obj.memberLogistics[i].user_id)) {
                    member = "New"
                } else if(!obj.newMembers[0].seniors.includes(obj.memberLogistics[i].user_id)) {
                    member = "Old"
                } 
            } else if(grade == 11) {
                if(obj.newMembers[1].juniors == "*") {
                    member = "New";
                } else if(obj.newMembers[1].juniors == "-") {
                    member = "Old";
                } else if(obj.newMembers[1].juniors.includes(obj.memberLogistics[i].user_id)) {
                    member = "New"
                } else if(!obj.newMembers[1].juniors.includes(obj.memberLogistics[i].user_id)) {
                    member = "Old"
                }  
            } else {
                if(obj.newMembers[2].sophomores == "*") {
                    member = "New";
                } else if(obj.newMembers[2].sophomores == "-") {
                    member = "Old";
                } else if(obj.newMembers[2].sophomores.includes(obj.memberLogistics[i].user_id)) {
                    member = "New"
                } else if(!newMembers[2].sophomores.includes(obj.memberLogistics[i].user_id)) {
                    member = "Old"
                }
            }
        }

        for(let m=0; m<obj.hourLogs.length; m++) {
            if(obj.hourLogs[m].name == obj.memberLogistics[i].user_id) {
                status = "Pending";
                pdf = obj.hourLogs[m].id;
                break;
            }
        }

        for(let k=0; k<obj.hourStatus.length; k++) {
            if(obj.hourStatus[k].id == obj.memberLogistics[i].user_id) {
                status = obj.hourStatus[k].status;
                note = obj.hourStatus[k].note;
                break;
            }
        }
        
        
        if(document.getElementById('name_search-ns1').value == "" || (firstName.toUpperCase().includes(document.getElementById('name_search-ns1').value.toUpperCase()) || lastName.toUpperCase().includes(document.getElementById('name_search-ns1').value.toUpperCase()))) {
            let gradeSearch = document.getElementById('grade_search-ns1').value;
            if(gradeSearch == 0 || ((gradeSearch == 1 && grade == 10) || ((gradeSearch == 2 && grade == 11)||(gradeSearch == 3 && grade == 12))) ) {
                let statusSearch = document.getElementById('status_search-ns1').value;
                if((statusSearch == 3 && status == "Missing") || ((statusSearch == 4 || (statusSearch == 0 && status == "Pending")) || ((statusSearch == 1 && status == "Approved") || (statusSearch == 2 && status == "Denied")))) {
                    let memberSearch = document.getElementById('member_search-ns1').value;
                    if(memberSearch == 2 || ((memberSearch == 0 && member == "Old") || (memberSearch == 1 && member == "New"))) {
                        const trelement = document.createElement("tr");
                        let trobj = `
                        <td> ${firstName} </td>
                        <td> ${lastName} </td>
                        <td> ${grade} </td>
                        <td> ${member} </td>
                        <td> ${status} </td>
                        `;
                        trelement.innerHTML = trobj;
                        trelement.status = status;
                        trelement.fName = firstName;
                        trelement.lName = lastName;
                        trelement.grade = grade;
                        trelement.member = member;
                        trelement.note = note;
                        trelement.pdf = pdf;
                        trelement.userid = obj.memberLogistics[i].user_id;
                        trelement.nonSignatureServiceProjects = 0;
                        trelement.nonSignatureServiceProjectsTotalMinutes = 0;
                        for(let d=0; d<obj.nonSignatureServiceProjects.length; d++) {
                            if(obj.nonSignatureServiceProjects[d].userid == trelement.userid) {
                                trelement.nonSignatureServiceProjects = obj.nonSignatureServiceProjects[d].projects.length;
                                for(let a=0; a< obj.nonSignatureServiceProjects[d].projects.length; a++) {
                                    if(obj.nonSignatureServiceProjects[d].projects[a].status == "approved") {
                                        trelement.nonSignatureServiceProjectsTotalMinutes += parseInt(obj.nonSignatureServiceProjects[d].projects[a].minutes);
                                    }
                                }
                                break;
                            }
                        }
                        trelement.onclick = function() {
                            let user_id = obj.memberLogistics[i].user_id;
                            document.getElementById("_tabgroup1").style.display = "none";
                            document.getElementById("_searchgroup1").style.display = "none";
                            document.getElementById("_groupfile1").innerHTML = 
                            `
                                <button onclick="goBack1()"> Go Back </button>
                            `
                            let basicText = document.createElement("div");
                            basicText.innerHTML = `
                            Student ID: ${user_id} <br>
                            `
                            document.getElementById("_groupfile").appendChild(basicText);
                            
                                var subtext = document.createElement("div");
                                if(trelement.status == "Missing") {
                                    subtext.innerHTML = `
                                   
                                    <br>
                                    Name: ${trelement.fName} ${trelement.lName} <br>
                                    Member ID: ${trelement.userid} <br>
                                    Member Grade: ${trelement.grade} <br>
                                    Member Age: ${trelement.member} <br>
                                    <br>
                                    Current Status: Missing Hour Log<br><br>
                                    
                                    Non-Signature Service Projects:<br>
                                    Completed ${trelement.nonSignatureServiceProjects} project(s) for a total of ${timeConvert(trelement.nonSignatureServiceProjectsTotalMinutes)}<br><br>
                                    
                                    Admin Section: 
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="user1-flexRadioDefault2">
                                    <label class="form-check-label" for="flexRadioDefault2">
                                        Denied
                                    </label>
                                    </div>
                                    <div class="mb-3">
                                        <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
                                        <textarea class="form-control" id="user1-comment_textarea" rows="3"></textarea>
                                    </div>
                                    <button onclick="updateHourLog(${trelement.userid})"> Deny Hour Log </button><br><br>
                                    
                                    `;
                                } else if(trelement.status == "Pending") {
                                    subtext.innerHTML = `
                                    <br>
                                    Name: ${trelement.fName} ${trelement.lName} <br>
                                    Member ID: ${trelement.userid} <br>
                                    Member Grade: ${trelement.grade} <br>
                                    Member Age: ${trelement.member} <br>
                                    <br>
                                    Current Status: Pending Approval<br><br>
                                    
                                    <a target ="_blank" href="https://drive.google.com/drive/u/3/folders/${trelement.pdf}"> Hour Log Submission </a><br>

                                    Non-Signature Service Projects: <br>
                                    Completed ${trelement.nonSignatureServiceProjects} project(s) for a total of ${timeConvert(trelement.nonSignatureServiceProjectsTotalMinutes)}<br><br>
                                    
                                    Admin Section: 
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="user1-flexRadioDefault1" checked>
                                    <label class="form-check-label" for="flexRadioDefault1">
                                        Approved
                                    </label>
                                    </div>
                                    <div class="form-check">
                                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="user1-flexRadioDefault2">
                                    <label class="form-check-label" for="flexRadioDefault2">
                                        Denied
                                    </label>
                                    </div>
                                    <div class="mb-3">
                                        <label for="exampleFormControlTextarea1" class="form-label">Optional Comment</label>
                                        <textarea class="form-control" id="user1-comment_textarea" rows="3"></textarea>
                                    </div>
                                    <button onclick="updateHourLog(${trelement.userid})"> Approve/Deny Hour Log </button><br><br>
                                    `;
                                } else {
                                    subtext.innerHTML = `
                                    <br>
                                    Name: ${trelement.fName} ${trelement.lName} <br>
                                    Member ID: ${trelement.userid} <br>
                                    Member Grade: ${trelement.grade} <br>
                                    Member Age: ${trelement.member} <br>
                                    <br>
                                    Current Status: ${trelement.status}<br><br>
                                    
                                    <a target ="_blank" href="https://drive.google.com/drive/u/3/folders/${trelement.pdf}"> Hour Log Submission </a><br>

                                    Non-Signature Service Projects: <br>
                                    Completed ${trelement.nonSignatureServiceProjects} project(s) for a total of ${timeConvert(trelement.nonSignatureServiceProjectsTotalMinutes)}<br><br>
                                    
                                    Note: ${trelement.note == undefined || trelement.note == "" ? "None": trelement.note}
                                    `;
                                }
                                
                                document.getElementById("_groupfile1").appendChild(subtext);
                           
                            document.getElementById("_groupfile1").style.display = "block";
                        };
                        
                        document.getElementById("_tabgroup1").appendChild(trelement);
                    }
                }
            }
        }
        firstName = "";  lastName = ""; grade = 0;  member = ""; status = "Missing"; note = "None"; userID = "";
        
    }
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
                displayPortal1();
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
            "init": 7
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
            "init": 7
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