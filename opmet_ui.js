// opmet.js
// Martin Pravda

/*jslint browser */
/*global crypto */

import ui from "./ui.js";
import make_form from "./form_ui.js";
import utils from "./utils.js";
import dom from "./dom.js";

function render_css() {
    return `
        :host {
            font-family: monospace;
        }
        table, th, td {
            border: 1px solid black;
        }
        th {
            background-color: grey;
        }
        td {
            padding: 0.5em;
        }
        error {
            padding: 1em;
            display: block;
            border: 1px solid black;
            background-color: tomato;
        }
        noresult {
            padding: 1em;
            background-color: powderblue;
            display: block;
            border: 1px solid black;
        }
    `;
}

const make_opmet = ui("opmet-ui", function (element, {
    url
}) {
    const shadow = element.attachShadow({mode: "closed"});
    const results_ui = dom("results");
    const style = dom("style");

    function clear_results() {
        results_ui.innerText = "";
    }

    function format_row(data) {
        const record = utils.pick(data, [
            "queryType",
            ["reportTime", utils.format_timestamp],
            ["text", utils.format_text]
        ]);

        const columns = Object.values(record).map(function (value) {
            const column = dom("td");
            column.innerHTML = value;
            return column;
        });

        return dom("tr", columns);
    }

    function append_table(data) {
        const rows = Object.entries(data).flatMap(function ([
            key,
            values
        ]) {
            const head = dom("tr", [dom("th", [key])]);
            return [head, ...values.map(format_row)];
        });

        const table = dom("table", rows);
        results_ui.append(table);
    }

    function show_error(message, code) {
        const error = dom("error", [
            dom("p", ["An error occured."]),
            dom("p", [`Code: ${code}`]),
            dom("p", [`Message: ${message}`])
        ]);

        results_ui.append(error);
    }

    function show_no_results() {
        const no_result = dom("noresult", [
            dom("p", ["No results found for given query"])
        ]);

        results_ui.append(no_result);
    }

    function on_submit(state) {
        const uuid = crypto.randomUUID();
        clear_results();
        fetch(url, {
            body: JSON.stringify({
                id: `query-${uuid}`,
                method: "query",
                params: [{
                    countries: state.countries,
                    id: `briefing-${uuid}`,
                    reportTypes: state.report_types,
                    stations: state.stations
                }]
            }),
            method: "POST"
        }).then(function (response) {
            return response.json();
        }).then(function (data) {

// JSON-RPC returns an error object if some error occurs

            if (data.error) {
                show_error(data.error.message, data.error.code);
                return;
            }

            if (data.result.length === 0) {
                show_no_results();
                return;
            }

            append_table(
                Object.groupBy(data.result, function ({stationId}) {
                    return stationId;
                })
            );
        });
    }
    const form_ui = make_form({on_submit});

    style.textContent = render_css();
    shadow.append(style, form_ui, results_ui);
});

//demo import config from "./config.js";
//demo document.documentElement.innerHTML = "";
//demo const opmet_ui = make_opmet({
//demo     url: config.json_rpc_url
//demo });
//demo document.body.appendChild(opmet_ui);

export default Object.freeze(make_opmet);