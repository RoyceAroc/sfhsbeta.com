function updateBody(path) {
    $.getJSON(path, function(json) {
        for(let i=0; i<json.length; i++) {
            document.getElementsByClassName("body-content")[0].appendChild(createRow(json[i]));
        }
    });
}

function createRow(json) {
    let parent = document.createElement("div"); 
    
    addComponents(parent, json);

    return parent;
}

function createChild(json) {
    var child;
    switch (json.type) {
        case "div":
            child = document.createElement("div");
        break;
        case "img":
            child = document.createElement("img");
        break;
        case "code":
            child = document.createElement("div");
        break;
        case "button":
            child = document.createElement("button");
        break;
        case "text":
            child = document.createElement("p");
        break;
    }
    addComponents(child, json);
    return child;
}

function addComponents(obj, json) {
    /* Add CSS styles to parent */
    if(json.styles) {
        for (var style in json.styles) {
            obj.style[style] = json.styles[style];
        }
    }
    
    /* Add classes to parent */
    if(json.classes) {
        for(let j=0; j<json.classes.length; j++) {
            obj.classList.add(json.classes[j]);
        }
    }

    /* Add click listener to parent */
    if(json.click) {
        const listener = obj.addEventListener('click',function(event){                          
            eval(json.click);
        }); 
    }

    /* Add text to parent */
    if(json.text) {
        obj.innerHTML = json.text;
    }

    /* Add src to parent */
    if(json.src) {
        obj.src = json.src;
    }

    /* Add code to parent */
    if(json.code) {
        obj.innerHTML = json.code;
    }

    /* Add children to parent (LAST statement) */
    if(json.children) {
        for(let i=0; i<json.children.length; i++) {
            obj.appendChild(createChild(json.children[i]));
        }
    }
}