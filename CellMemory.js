const color = require('cli-color');

class CellMemory {
    constructor(length = 10, start = 0) {
        this.cells = Array(length).fill(0);
        this.length = length - 1;
        this.pointer = start;
    }

    get memDump() {
        let dump = [...this.cells];
        dump[this.pointer] = color.underline(`${dump[this.pointer]}`);
        return `Memory Dump: ${this.cells}`;
    }

    memState(verbose) {
        let dump = [...this.cells];
        dump[this.pointer] = color.underline(`${dump[this.pointer]}`);
        if (verbose) {
            return `Memory State (verbose): ${dump}`;
        } else {
            let startIndex = this.pointer - 5;
            if (startIndex < 0) {
                startIndex = 0;
            }
            let endIndex = this.pointer + 5;
            if (endIndex > this.length) {
                endIndex = this.length;
            }
            let shortDump = dump.slice(startIndex, endIndex + 1);
            return `Memory State: ${shortDump}`;
        }
    }

    readChar() {
        if (this.pointer > this.length) {
            console.error(color.red(`Pointer out of bounds`));
            console.error(this.memDump);
            process.exit();
        }
        return this.cells[this.pointer];
    }

    writeChar(char) {
        if (typeof char === 'number'&& char >= 0 && char <= 127) {
            this.cells[this.pointer] = char;
        } else {
            this.cells[this.pointer] = 0;
        }
    }

    increment() {
        this.cells[this.pointer]++;
        if (this.cells[this.pointer] > 127) {
            this.cells[this.pointer] = 127;
        }
    }

    decrement() {
        this.cells[this.pointer]--;
        if (this.cells[this.pointer] < 0) {
            this.cells[this.pointer] = 0;
        }
    }

    moveRight() {
        this.pointer++;
    }

    moveLeft() {
        this.pointer--;
        if (this.pointer < 0) {
            this.pointer = 0;
        }
    }
}

module.exports = CellMemory;