const color = require('cli-color');
require('draftlog').into(console);

class Interpreter {
    constructor(bfArray, inputs, cellMemory, config) {
        this.config = {
            clockRate: 0,
            debugMode: 0,
        };

        if (config && config.clockRate) {this.config.clockRate = (config.clockRate || 100)}
        if (config && config.debugMode) {this.config.debugMode = config.debugMode}

        this.mem = cellMemory;
        this.inputs = inputs;
        this.instructionPointer = 0;
        this.loopStartIndex = 0;
        this.instructions = bfArray;
        this.output = [];

        if (this.config.debugMode === true) {
            this.currentInstructionLog = console.draft(`Current Instruction: ---`);
            this.memStateLog = console.draft(`Memory State: ---`);
            this.outputLog = console.draft(`Output: ---`);
        }

    }

    get currentInstruction() {
        return this.instructions[this.instructionPointer];
    }

    get strOutput () {
        return this.output.join("");
    }

    evalInstruction(instruction) {
        switch (instruction) {
            case '+':
                this.mem.increment();
                return;
            case '-':
                this.mem.decrement();
                return;
            case '<':
                this.mem.moveLeft();
                return;
            case '>':
                this.mem.moveRight();
                return;
            case '.':
                this.output.push(String.fromCharCode(this.mem.readChar()));
                return;
            case ',':
                if (!this.inputs) {this.mem.writeChar(0); return}
                let inputChar = this.inputs.shift();
                if (inputChar) {
                    inputChar = inputChar.charCodeAt(0);
                } else {
                    inputChar = 0;
                }
                this.mem.writeChar(inputChar);
                return;
            case '[':
                if (this.mem.readChar() == 0) {
                    while (this.currentInstruction !== "]") {
                        this.instructionPointer++;
                    }
                    return;
                } else {
                    this.loopStartIndex = this.instructionPointer - 1;
                    return;
                }
            case ']':
                this.instructionPointer = this.loopStartIndex;
                return;
        }
    }

    startEvalLoop() {
        setInterval(() => {

            if (this.config.debugMode === true) {
                this.currentInstructionLog(`Current Instruction: ${(this.currentInstruction || '---')}`);
                this.memStateLog(this.mem.memState(false));
                this.outputLog(color.green(`Output: ${(this.strOutput || '---')}`));   
            }


            if (!this.currentInstruction) {
                if (!this.config.debugMode) {
                    console.log(color.green(`Output: ${(this.strOutput || '---')}`));
                }
                process.exit();
            }
            this.evalInstruction(this.currentInstruction);
            this.instructionPointer++;
        }, this.config.clockRate)
    }
}

module.exports = Interpreter;