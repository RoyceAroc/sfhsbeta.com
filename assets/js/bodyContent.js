function updateBody(path) {
    $.getJSON(path, function(json) {
        for(let i=0; i<json.length; i++) {
            document.getElementsByClassName("body-content")[0].appendChild(createRow(json[i]));
        }
    });
}

function createRow(json) {
    let parent = document.createElement("div"); 
    parent.classList.add("row");
    // Add Styles To Parent
    for (var style in json.styles) {
        parent.style[style] = json.styles[style];
    }

    for(let i=0; i<json.children.length; i++) {
        parent.appendChild(createChild(json.children[i]));
    }

    return parent;
}

function createChild(json) {
    var child;
    switch (json.type) {
        case "col": /* Add a column into parent */
            child = document.createElement("div");
            child.classList.add(`col-${json["size-s"]}`); 
            child.classList.add(`col-md-${json["size-l"]}`); 
            for (var style in json.styles) {
                child.style[style] = json.styles[style];
            }
            for(let i=0; i<json.children.length; i++) {
                child.appendChild(createChild(json.children[i]));
            }
        break;
        case "img":
            child = document.createElement("img");
            child.src = json.src;
            for (var style in json.styles) {
                child.style[style] = json.styles[style];
            }
        break;
        case "code":
            child = document.createElement("div");
            child.innerHTML = json.code;
            for (var style in json.styles) {
                child.style[style] = json.styles[style];
            }
        break;
        case "button":
            child = document.createElement("button");
            child.innerHTML = json.text;
            const listener = child.addEventListener('click',function(event){                          
                eval(json.click);
            }); 
            for (var style in json.styles) {
                child.style[style] = json.styles[style];
            }
        break;
        case "text":
            child = document.createElement("p");
            child.innerHTML = json.text;
            for(let j=0; j<json.classes.length; j++) {
                child.classList.add(json.classes[j]);
            }
            for (var style in json.styles) {
                child.style[style] = json.styles[style];
            }
        break;
    }
    return child;
}