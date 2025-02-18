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
        o[property] = object[property];
        return o;
    }, {});
}

export default Object.freeze({
    group_by,
    pick
});