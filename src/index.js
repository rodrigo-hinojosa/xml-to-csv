const { transform, prettyPrint } = require('camaro')
const { parse } = require('json2csv');

/**
 * the template can be an object or an array depends on what output you want the XML to be transformed to.
 * 
 * ['players/player', {name, ...}] means that: Get all the nodes with this XPath expression `players/player`.
 *      - the first param is the XPath path to get all the XML nodes.
 *      - the second param is a string or an object that describe the shape of the array element and how to get it.
 * 
 * For each of those XML node
 *      - call the XPath function `title-case` on field `name` and assign it to `name` field of the output.
 *      - get the attribute `jerseyNumber` from XML node player
 *      - get the `yearOfBirth` attribute from `yearOfBirth` and cast it to number.
 *      - cast `isRetired` to true if its string value equals to "true", and false otherwise.
 */

(async () => {
    const fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, '../input-files/sku-pruebas-carga.xml');

    // camaro XML reader
    const template = ['catalog/product', {
        id: '@product-id',
        online: 'boolean(online-flag = "true")',
        available: 'boolean(available-flag = "true")',
        searchable: 'boolean(searchable-flag = "true")'
    }];

    // csv parser
    const fields = ['id', 'online', 'available', 'searchable'];
    const opts = { fields , quote: ''};

    fs.readFile(filePath, {encoding: 'utf-8'}, async (err, data) => {
        if (!err) {
            const result = await transform(data, template);
            console.log('result', result);
            const csv = parse(result, opts);
            console.log('csv', csv);
            fs.writeFile('../output-files/products.csv', csv, (err) => {
                if (err) console.log(err);
                console.log("Successfully Written to File.");
              });
        } else {
            console.log(err);
        }
    });

    // const result = await transform(xml, template)
    // console.log(result)

    // const prettyStr = await prettyPrint(xml, { indentSize: 4})
    // console.log(prettyStr)
})()