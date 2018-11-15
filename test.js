/*
const {CHANNEL,ACTIONS,SUBJECT} = require("./controller/C")

console.log(CHANNEL)*/


let {Observable} = require("rxjs/Observable")
let {Scheduler, Subject} = require("rxjs")
require("rxjs/Rx");

class Core {
    constructor() {
        this.state = {};
        this.subject = new Subject();

        this.subject.subscribe((state) => {
            console.log("from constructor");
        })
    }

    updateState(newState) {
        this.state = Object.assign({}, this.state, newState);
        this.subject.next(this.state);
    }


    updateBell() {

        let mappedSubject = this.subject.map((item) => {
            // 사람이 걸어감
            if (item.a === 3) {
                throw Error()
            } else {
                return item;
            }
        });
        //불키는 Observable
        let delayObservable = Observable.of("finish").delay(7000)
            .map((item) => {
                console.log("delay observable");
                return item;
            });


        Observable.merge(mappedSubject, delayObservable)
            .subscribe((data) => {
                console.log(data)
            }, (err) => {
                console.log("err 2")
                //console.log(err)
            });
    }

}

let core = new Core();

//1초마다 상태 변경
Observable
    .interval(1000)
    .timeInterval()
    .take(10)
    .subscribe((item) => {
        core.updateState({a: item.value})
        //console.log(item)
    }, err => {
        console.log("err 1")
    });

//3초 후에 발생
Observable.of("")
    .subscribe((item) => {
        core.updateBell();
    }, err => {
        console.log("err 3")
    });
