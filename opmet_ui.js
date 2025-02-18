// opmet.js
// Martin Pravda

/*jslint browser */

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
    `;
}

const make_opmet = ui("ui-opmet", function (element, {
    url
}) {
    const shadow = element.attachShadow({mode: "closed"});
    const table_ui = dom("results");
    const style = dom("style");

    function clear_table() {
        table_ui.innerText = "";
    }

    function format_row(data) {
        const record = utils.pick(data, [
            "queryType",
            "reportTime",
            "textHTML"
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
        table_ui.append(table);
    }

    function on_submit(state) {
        clear_table();

        fetch(url, {
            body: JSON.stringify({
                id: "query01",
                method: "query",
                params: [{
                    countries: state.countries,
                    id: "briefing01",
                    reportTypes: state.report_types,
                    stations: state.stations
                }]
            }),
            method: "POST"
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            append_table(
                utils.group_by(data.result, "stationId")
            );
        });
    }
    const form_ui = make_form({on_submit});

    style.textContent = render_css();
    shadow.append(style, form_ui, table_ui);
});

//demo import config from "./config.js";
//demo document.documentElement.innerHTML = "";
//demo const opmet_ui = make_opmet({
//demo     url: config.json_rpc_url
//demo });
//demo document.body.appendChild(opmet_ui);

export default Object.freeze(make_opmet);