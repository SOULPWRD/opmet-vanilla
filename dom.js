// The 'dom' function creates a new DOM element with the specified 'tag' name,
// or modifies an existing element.

// The 'properties' parameter is an object containing values to assign to the
// element's properties.

// The 'children' parameter is either a string or an array of elements.

// The 'properties' parameter may be omitted.

/*jslint browser, global */

function dom(tag, properties = {}, children = []) {
    if (typeof properties === "string" || Array.isArray(properties)) {
        children = properties;
        properties = {};
    }
    if (!Array.isArray(children)) {
        children = [children];
    }
    const element = (
        typeof tag === "string"
        ? document.createElement(tag)
        : tag
    );
    element.append(...children);
    Object.keys(properties).forEach(function (name) {
        element[name] = properties[name];
    });
    Object.assign(element.style, properties.style);
    return element;
}


//demo document.documentElement.innerHTML = "";
//demo document.body.append(
//demo     dom("label", [
//demo         "First name ",
//demo         dom("input", {
//demo             oninput(event) {
//demo                 globalThis.console.log(event.target.value);
//demo             },
//demo             placeholder: "Grug"
//demo         })
//demo     ])
//demo );


export default Object.freeze(dom);
