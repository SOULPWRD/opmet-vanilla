// ui.js
// James Diacono
// 2024-02-16

// Custom Elements with a safer, more expressive interface.

// This module does not pass JSLint because it uses JavaScript's class syntax,
// so that you never have to.

// Public Domain.

let instances = new WeakMap();

function ui(tag, create) {

// It seems that the only way to efficiently monitor a DOM element's
// connectedness to a document, without knowledge of its parent, is thru
// connectedCallback and disconnectedCallback. If a better approach presents
// itself (perhaps https://github.com/whatwg/dom/issues/533), there will be no
// need to use Custom Elements and hence no need for this library.

    if (customElements.get(tag) === undefined) {
        customElements.define(tag, class extends HTMLElement {
            connectedCallback() {
                const connect = instances.get(this)?.connect;
                if (typeof connect === "function") {
                    connect();
                }
            }
            disconnectedCallback() {
                const disconnect = instances.get(this)?.disconnect;
                if (typeof disconnect === "function") {
                    disconnect();
                }
            }
        });
    }
    return Object.freeze(function make_element(params) {
        const element = document.createElement(tag);
        instances.set(element, create(element, params));
        return element;
    });
}


//demo document.documentElement.innerHTML = "";
//demo const make_blink = ui("blink-ui", function create(element, params) {
//demo     let {interval} = params;
//demo     let timer;
//demo     let shadow = element.attachShadow({mode: "closed"});
//demo     shadow.append(document.createElement("slot"));
//demo     function toggle_visibility() {
//demo         element.style.visibility = (
//demo             element.style.visibility === "hidden"
//demo             ? "visible"
//demo             : "hidden"
//demo         );
//demo     }
//demo     return {
//demo         connect() {
//demo             timer = setInterval(toggle_visibility, interval);
//demo         },
//demo         disconnect() {
//demo             clearInterval(timer);
//demo         }
//demo     };
//demo });
//demo const blink_element = make_blink({interval: 300});
//demo blink_element.textContent = "Look at me!";
//demo document.body.append(blink_element);


export default Object.freeze(ui);


