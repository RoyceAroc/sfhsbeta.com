function updateBody(path) {
    $.getJSON(path, function(json) {
        for(let i=json.length-1; i>=0; i--) {
           let a = document.createElement("div");
           let listClassesMain = ['row', 'flex-lg-row-reverse', 'align-items-center', 'g-5', 'py-5'];
           for(let j=0; j<listClassesMain.length; j++) {
               a.classList.add(listClassesMain[j]);
           }
           if(i%2==0) {
                a.appendChild(createImageHolder(json[i]));
                a.appendChild(createBodyHolder(json[i]));
           } else {
                a.appendChild(createBodyHolder(json[i]));
                a.appendChild(createImageHolder(json[i]));
           }
           document.getElementById("volunteeringOpportunitiesContainer").appendChild(a);
        }
    });
}

function createImageHolder(json) {
    let a = document.createElement("div");
    let listClassesMain = ['col-10', 'col-sm-8', 'col-lg-4', 'align-items-center'];
    for(let j=0; j<listClassesMain.length; j++) {
        a.classList.add(listClassesMain[j]);
    }
    let b = document.createElement("img");
    b.src = "web/data/content/media/client/volunteering/" + json.image;
    b.style.width = "300px";
    b.setAttribute("loading", "lazy");
    let listClassesSub = ['d-block', 'mx-lg-auto', 'img-fluid'];
    for(let j=0; j<listClassesSub.length; j++) {
        b.classList.add(listClassesSub[j]);
    }
    a.appendChild(b);
    return a;
}

function createBodyHolder(json) {
    let a = document.createElement("div");
    a.classList.add("col-lg-8");
    let b = document.createElement("h1");
    let listClassesMain = ['display-5', 'fw-bold', 'lh-1', 'mb-3'];
    for(let j=0; j<listClassesMain.length; j++) {
        b.classList.add(listClassesMain[j]);
    }
    b.innerHTML = json.title;
    let c = document.createElement("p");
    c.classList.add("lead");
    c.innerHTML = json.body;
    let d = document.createElement("div");
    let listClassesSub = ['d-grid', 'gap-2', 'd-md-flex', 'justify-content-md-start'];
    for(let j=0; j<listClassesSub.length; j++) {
        d.classList.add(listClassesSub[j]);
    }
    for(let m=0; m<json.links.length; m++) {
        let e = document.createElement("a");
        let listClassesSubSub = ['btn', 'btn-lg', 'px-4', 'me-sm-3', 'btn-main-elem'];
        for(let j=0; j<listClassesSubSub.length; j++) {
            e.classList.add(listClassesSubSub[j]);
        }
        e.innerHTML = json.links[m].title;
        e.href = json.links[m].href;
        e.setAttribute("target", "_blank");
        d.appendChild(e);
    }
    a.appendChild(b);
    a.appendChild(c);
    a.appendChild(d);
    return a;
}