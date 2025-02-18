// utils.js
// Martin Pravda

/*jslint browser */

function group_by(array, attribute) {
    return array.reduce(function (groups, item) {
        const key = item[attribute];
        if (groups[key] === undefined) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}

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

function format_timestamp(timestamp) {
    const [date, time] = timestamp.split("T");
    const european_date_format = date.split("-").reverse().join(".");
    return `${european_date_format} ${time.slice(0, -1)}`;
}

export default Object.freeze({
    format_timestamp,
    group_by,
    pick
});