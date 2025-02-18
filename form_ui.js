// form.js
// Martin Pravda

// This is a main form component that fetches OPMET data

/*jslint browser */

import ui from "./ui.js";
import dom from "./dom.js";

function render_css() {
    return `
        :host {
            display: grid;
            margin: 1em;
            grid-template-columns: 10em 20em;
        }
        titles {
            margin-right: 10px;
        }
        inputs > * {
            display: block;
            margin: 1em;
        }
        airports > input, countries > input {
            width: 14em;
        }
        label {
            margin-right: 10px;
            margin-left: 2px;
        }
        #submit {
            margin: 1em;
            width: 11em;
            grid-column-end: 2;
            grid-column-end: 3;
            font-family: monospace;
        }
    `;
}

const make_form = ui("ui-form", function (element, {
    on_submit
}) {
    const shadow = element.attachShadow({mode: "closed"});
    const report_types = new Set();
    const stations = new Set();
    const countries = new Set();

    const style = dom("style");

    function update_report_type(type) {
        return function (event) {
            const checked = event.target.checked;
            type = type.toUpperCase();

            if (checked) {
                report_types.add(type);
                return;
            }

            report_types.delete(type);
        };
    }

    function update_input_text(store) {
        return function (event) {
            store.clear();
            const value = event.target.value;

            if (value) {
                value.split(" ").forEach(function (value) {
                    store.add(value);
                });
            }
        };
    }

    function make_title(title) {
        return dom("p", [title]);
    }

    function make_label(for_element) {
        return dom("label", {
            htmlFor: for_element.toLowerCase()
        }, [for_element]);
    }

    const titles = dom("titles", [
        make_title("Message Types"),
        make_title("Airports"),
        make_title("Countries")
    ]);

    const metar_checkbox = dom("input", {
        id: "metar",
        onclick: update_report_type("metar"),
        type: "checkbox"
    });
    const sigmet_checkbox = dom("input", {
        id: "sigmet",
        onclick: update_report_type("sigmet"),
        type: "checkbox"
    });
    const taf_checkbox = dom("input", {
        id: "taf",
        onclick: update_report_type("taf_longtaf"),
        type: "checkbox"
    });

    const stations_input = dom("input", {
        id: "airports",
        oninput: update_input_text(stations),
        type: "text"
    });
    const countries_input = dom("input", {
        id: "countries",
        oninput: update_input_text(countries),
        type: "text"
    });

    const message_types_ui = dom("message-types", [
        metar_checkbox,
        make_label("Metar"),
        sigmet_checkbox,
        make_label("Sigmet"),
        taf_checkbox,
        make_label("Taf")
    ]);
    const airports_ui = dom("airports", [
        stations_input
    ]);
    const countries_ui = dom("countries", [
        countries_input
    ]);
    const submit_button = dom("input", {
        id: "submit",
        onclick: function () {
            on_submit(get_state());
        },
        type: "submit",
        value: "Create briefing"
    });

    const inputs = dom("inputs", [
        message_types_ui,
        airports_ui,
        countries_ui
    ]);

    function get_state() {
        return Object.freeze({
            countries: [...countries],
            report_types: [...report_types],
            stations: [...stations]
        });
    }

    function clear() {
        stations_input.value = "";
        stations.clear();
        countries_input.value = "";
        countries.clear();
        [taf_checkbox, sigmet_checkbox].forEach(function (element) {
            if (element.checked === true) {
                element.click();
            }
        });
    }

    style.textContent = render_css();
    shadow.append(
        style,
        titles,
        inputs,
        submit_button
    );

    return {
        connect() {
            clear();
        }
    };
});

//demo document.documentElement.innerHTML = "";
//demo const form_ui = make_form({
//demo     on_submit: function (state) {
//demo         console.log(state);
//demo     }
//demo });
//demo document.body.appendChild(form_ui);

export default Object.freeze(make_form);