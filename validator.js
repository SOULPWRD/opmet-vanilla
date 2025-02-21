// validator.js
// Martin Pravda

// A simple validator module

/*jslint browser */

function make_validator() {
    const pool = new Map();
    const global_effects = new Set();

    function validate_all() {
        const all_passes = Array.from(pool.values()).every(
            function ({predicate}) {
                return predicate();
            }
        );

        global_effects.forEach(function (effect) {
            effect(all_passes);
        });
    }

    function validate(type) {
        const {effect, predicate} = pool.get(type);
        effect(predicate());
        validate_all();
    }

    function register(type, {effect, predicate}) {
        pool.set(type, {effect, predicate});
    }

    function on_valid(effect) {
        global_effects.add(effect);
    }

    return Object.freeze({
        on_valid,
        register,
        validate
    });
}

//demo import dom from "./dom.js";
//demo const validator = make_validator();

//demo function validate_input(type) {
//demo     return function () {
//demo         validator.validate(type);
//demo     };
//demo }

//demo const validation_message_ui = dom("p", [
//demo     "Input can not be empty"
//demo ]);
//demo validation_message_ui.style.display = "none";
//demo const input_text_ui = dom("input", {
//demo     onblur: validate_input("input"),
//demo     oninput: validate_input("input"),
//demo     type: "text"
//demo });
//demo const button_ui = dom("input", {
//demo     disabled: true,
//demo     type: "button",
//demo     value: "submit"
//demo });

//demo validator.register("input", {
//demo     effect(passes) {
//demo         if (passes) {
//demo             validation_message_ui.style.display = "none";
//demo             return;
//demo         }

//demo         validation_message_ui.style.display = "block";
//demo     },
//demo     predicate() {
//demo         return input_text_ui.value !== "";
//demo     }
//demo });

//demo validator.on_valid(function (passes) {
//demo     if (passes) {
//demo         button_ui.disabled = false;
//demo         return;
//demo     }
//demo     button_ui.disabled = true;
//demo });

//demo document.body.innerHTML = "";
//demo document.body.append(
//demo     input_text_ui,
//demo     validation_message_ui,
//demo     button_ui
//demo );

export default Object.freeze(make_validator);