// utils.js
// Martin Pravda

/*jslint browser */

function pick(object, properties = []) {
    return properties.reduce(function (o, property) {
        if (Array.isArray(property)) {
            const [prop, formatter] = property;
            o[prop] = formatter(object[prop]);
            return o;
        }

        o[property] = object[property];
        return o;
    }, {});
}
//demo pick({a: 1, b: 2}, ["a"]);
//demo pick({a: 1, b: 2}, [["b", function (value) {
//demo     return value * value;
//demo }]]);

function format_timestamp(timestamp) {
    const [date, time] = timestamp.split("T");
    const european_date_format = date.split("-").reverse().join(".");
    return `${european_date_format} ${time.slice(0, -1)}`;
}
// format_timestamp("2025-02-21T09:50:00Z")

function colorify(value, color) {
    return `<font color=\"${color}\">${value}</font>`;
}
//demo colorify("Hello world", "yellow");

function format_text(text) {
    const rx_text = /(BKN|FEW|SCT)(\d+)/g
    return text.replace(rx_text, function (string, ignore, number) {
        if (number < 30) {
            return colorify(string, "blue");
        }
        return colorify(string, "red");
    });
}
//demo format_text("FEW101");
//demo format_text("BKN01");

export default Object.freeze({
    format_text,
    format_timestamp,
    pick
});