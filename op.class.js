
/**
 *  Op)eration
 *  Written by necips@live.de, 29.12.2019
 */
class Op {    
    constructor(op, descr=null) {
        this.op = op;
        this.descr = descr;

        this.states = {STARTED: 0, RUNNING: 1, IDLE: 2, FINISHED: -1}
        this.state = this.states.STARTED;
    }

    run() {
        if (this.state === this.states.FINISHED)
            return true;

        if (this.state === this.states.STARTED) {
            this.state = this.states.RUNNING;
        }

        if (this.descr !== null)
            console.log(this.descr);

        if (this.op.condition !== undefined) {
            if (this.op.condition)
                this.op.then.run();
            else
                this.op.else.run();

            this.state = this.states.FINISHED;
        }        
        else if (this.op.from !== undefined) {
            if (this.op.value === undefined)
                this.op.value = this.op.from;
            if ((this.op.step > 0 && this.op.value > this.op.to) ||
                (this.op.step < 0 && this.op.value < this.op.to)) {
                this.state = this.states.FINISHED;
            }
            else {
                if (this.op.cb !== undefined)
                    this.op.cb(this.op.value);
                this.op.value += this.op.step;
            }
        }       
        else if (this.op.do !== undefined) {
            for(let i=0; i < this.op.do.length; i++) {             
                this.op.do[i].run()
            }
            this.state = this.states.FINISHED;
        }
        else if (this.op.value !== undefined) {
            console.log(this.op.value);
            this.state = this.states.FINISHED;
        }   
        
        
        return this.state === this.states.FINISHED;
    }
}


// Some functions ...

// Variables
let opValueOnly = new Op( {value: 1},
    'opValueOnly');

// Block
let opBlock = new Op( 
    { 
        do: [new Op({value: 1}), 
             new Op({value: 2})]
    },
    'opBlock');


// Condition
let opCondition = new Op(
    {
        condition:1, 
        then: new Op( {do: [new Op({value:  1}), 
                            new Op({value:  2})] }), 
        else: new Op( {do: [new Op({value: -1}),    
                            new Op({value: -2})] }) 
    }, 
    'opCondition');


// callback function for log
function _log(value) {
    console.log('_log.value: ' + value);
}

// callback function for opLoopSimple
function _cbLoopSimple(value) {
    console.log('_cbLoopSimple.value: ' + value);
}

// loop
let opLoopSimple = new Op(
    {
        from:3, to:1, step: -1, cb: _cbLoopSimple
    },
    'opLoopSimple');


// callback function for opLoopInLoop with inner loop
function _cbLoopInLoop(value) {
    console.log('_cbLoopInLoop - value: ' + value);

    opLoopSimple.state = opLoopSimple.states.STARTED;
    opLoopSimple.op.value = undefined;
    opLoopSimple.op.cb = _log;

    let finished = null;
    do {
        finished = true;
        finished &= opLoopSimple.run();
    } while(!finished);

}

// loop
let opLoopInLoop = new Op(
    {
        from:1, to:3, step: 1, cb: _cbLoopInLoop
    },
    'opLoopInLoop');


// Main Application

let finished = null;
do {
    finished = true;
    finished &= opValueOnly.run();
    finished &= opBlock.run();
    finished &= opCondition.run();
    finished &= opLoopInLoop.run();
} while(!finished);



/* TEST OUTPUT:
opValueOnly
1
opBlock
1
2
opCondition
1
2
opLoopInLoop
_cbLoopInLoop - value: 1
opLoopSimple
_log.value: 3
opLoopSimple
_log.value: 2
opLoopSimple
_log.value: 1
opLoopSimple
opLoopInLoop
_cbLoopInLoop - value: 2
opLoopSimple
_log.value: 3
opLoopSimple
_log.value: 2
opLoopSimple
_log.value: 1
opLoopSimple
opLoopInLoop
_cbLoopInLoop - value: 3
opLoopSimple
_log.value: 3
opLoopSimple
_log.value: 2
opLoopSimple
_log.value: 1
*/
