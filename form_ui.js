// form.js
// Martin Pravda

// This is a main form component that fetches OPMET data

/*jslint browser */

import ui from "./ui.js";
import dom from "./dom.js";
import make_validator from "./validator.js";

// a simple input sanitizer

const rx_delete_default = /[<>&%"\\]/g;

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
        inputs > p {
            font-size: xx-small;
            background-color: tomato
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

const make_form = ui("form-ui", function (element, {
    on_submit
}) {
    const shadow = element.attachShadow({mode: "closed"});
    const validator = make_validator();
    const report_types = new Set();
    const stations = new Set();
    const countries = new Set();

    const style = dom("style");

    function get_state() {
        return Object.freeze({
            countries: [...countries],
            report_types: [...report_types],
            stations: [...stations]
        });
    }

    function validate_input(type) {
        return function () {
            validator.validate(type);
        };
    }

    function update_report_type(type) {
        return function (event) {
            const checked = event.target.checked;
            type = type.toUpperCase();

            if (checked) {
                report_types.add(type);
            } else {
                report_types.delete(type);
            }

            validator.validate("message_type");
        };
    }

    function update_input_text(store) {
        return function (event) {
            store.clear();
            const value = event.target.value;

            if (value) {
                value.replace(
                    rx_delete_default,
                    ""
                ).toUpperCase().split(" ").forEach(function (value) {
                    store.add(value);
                });
            }

            validator.validate("stations_countries");
        };
    }

    function make_title(title) {
        return dom("p", [title]);
    }

    function make_validation_message(message) {
        return dom("p", {style: {display: "none"}}, [message]);
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
        onblur: validate_input("message_type"),
        type: "checkbox"
    });
    const sigmet_checkbox = dom("input", {
        id: "sigmet",
        onclick: update_report_type("sigmet"),
        onblur: validate_input("message_type"),
        type: "checkbox"
    });
    const taf_checkbox = dom("input", {
        id: "taf",
        onclick: update_report_type("taf_longtaf"),
        onblur: validate_input("message_type"),
        type: "checkbox"
    });

    const stations_input = dom("input", {
        id: "airports",
        oninput: update_input_text(stations),
        onblur: validate_input("stations_countries"),
        type: "text"
    });
    const countries_input = dom("input", {
        id: "countries",
        oninput: update_input_text(countries),
        onblur: validate_input("stations_countries"),
        type: "text"
    });

    const vm_message_types = make_validation_message(
        "At least one of the options has to be selected"
    );
    const message_types_ui = dom("message-types", [
        metar_checkbox,
        make_label("Metar"),
        sigmet_checkbox,
        make_label("Sigmet"),
        taf_checkbox,
        make_label("Taf")
    ]);
    const vm_airports_countries = make_validation_message(
        "At least one country or airport code has to be specified"
    )
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
        disabled: true,
        type: "submit",
        value: "Create briefing"
    });

    const inputs = dom("inputs", [
        message_types_ui,
        vm_message_types,
        airports_ui,
        countries_ui,
        vm_airports_countries
    ]);

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

// a simple input validation

    validator.register("message_type", {
        predicate() {
            return report_types.size >= 1
        },
        effect(passes) {
            if (passes) {
                vm_message_types.style.display="none"
                return;
            }

            vm_message_types.style.display="block";
        }
    });

    validator.register("stations_countries", {
        predicate() {
            return (
                stations.size >= 1
                || countries.size >= 1
            );
        },
        effect(passes) {
            if (passes) {
                vm_airports_countries.style.display="none"
                return;
            }

            vm_airports_countries.style.display="block";
        }
    });

    validator.on_valid(function (passes) {
        if (passes) {
            submit_button.disabled = false;
            return;
        }

        submit_button.disabled = true;
    });

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