#!/usr/bin/env node
const CellMemory = require('./CellMemory');
const Interpreter = require('./Interpreter');
const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
    .usage('Usage: node brainfuck.js <bf-path> [--input]')
    .help()
    .fail((msg, err, yargs) => {
        if (err) throw err;
        console.error("Try using 'node brainfuck.js --help' to learn more");
        process.exit();
    })
    .options({
        'd': {
            alias: 'debug',
            default: false,
            describe: 'Enable debug mode',
            type: 'boolean'
        },
        'rate': {
            default: 10,
            describe: 'The rate (in milliseconds) at which the program will run',
            type: 'number'
        }
    })
    .array('input').argv;

let memory = new CellMemory();
const BrainFuckFile = fs.readFileSync(argv._[0], {encoding: 'utf8'});
const BrainFuckString = BrainFuckFile.toString('utf-8');

// inputs is an array of values
const Inputs = argv.input;

const parseBFCode = bfString => {
    let stringArray = Array.from(bfString);
    let output = [];
    let validOperators = new RegExp(/\.|\,|\[|\]|\+|\-|>|</);
    stringArray.forEach(char => {
        if (char.match(validOperators)) {
            output.push(char);
        }
    });
    return output;
}

let bfArray = parseBFCode(BrainFuckString);
let interpreter = new Interpreter(bfArray, Inputs, memory, {
    debugMode: argv.d,
    clockRate: argv.rate,
});
interpreter.startEvalLoop();