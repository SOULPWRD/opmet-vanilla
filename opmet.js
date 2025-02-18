// opmet.js
// Martin Pravda

// This a main entry file

import make_opmet from "./opmet_ui.js";
import config from "./config.js"

const opmet_ui = make_opmet({
    url: config.json_rpc_url
});
const root = document.getElementById(config.root);
root.append(opmet_ui);