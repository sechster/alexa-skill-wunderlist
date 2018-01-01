const Alexa = require('alexa-sdk');
const moment = require('moment');
const todoService = require('./services/todoService');
const wunderlist = require('./externalServices/wunderlist');
const dueDateService = require('./services/dueDateService');

const APP_ID = 'amzn1.ask.skill.d3cafb51-55ce-4869-8d71-7bef5e41a256';

const HELP_MESSAGE = 'Just say: add task (something) due today or tomorrow. You can also list tasks saying: what is on my (something) list.';
const STOP_MESSAGE = 'Ok.';

exports.handler = function(event, context, callback) {
    console.log("Wunderlist assistant: executing.");
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        console.log("Wunderlist assistant: LaunchRequest.");
        this.emit('WhatToWearIntent');
    },
    'Unhandled': function() {
        console.log("Wunderlist assistant: Unhandled.");
        this.response.speak("I do not know what you are saying double o seven");
        this.emit(':ask', 'There was an error. Check the logs.');
    },
    'AddTaskIntent': function () {
        console.log("Wunderlist assistant: AddTaskIntent.");
        if (!isSlotValid(this.event.request, 'taskName')) {
            delegateSlotCollection(this.event, this.emit);
        } else {
            let accessToken = this.event.session.user.accessToken;
            let wunderlistInstance = new wunderlist(accessToken);
            let toDoServiceInstance = new todoService(wunderlistInstance);

            let listName = "inbox";
            if (isSlotValid(this.event.request, 'listName')) {
                listName = this.event.request.intent.slots.listName.value;
            }

            let dueDate = moment().toDate();
            if (isSlotValid(this.event.request, 'dueDate')) {
                dueDate = dueDateService.getDueDate(this.event.request.intent.slots.dueDate.value);
            }

            let task = { 
                title: this.event.request.intent.slots.taskName.value,
                dueDate: dueDate
            };

            self = this;

            toDoServiceInstance.addTask(listName, task)
                .then(function() { 
                    self.response.speak(`Successfully added ${task.title} to list ${listName}.`);
                    self.emit(':responseReady'); }
                );
        }
    },
    'ListTasksIntent': function () {
        console.log("Wunderlist assistant: ListTasksIntent.");
        if (!isSlotValid(this.event.request, 'listName')) {
            delegateSlotCollection(this.event, this.emit);
        } else {
            let accessToken = this.event.session.user.accessToken;
            let wunderlistInstance = new wunderlist(accessToken);
            let toDoServiceInstance = new todoService(wunderlistInstance);
            let listName = this.event.request.intent.slots.listName.value;

            self = this;

            toDoServiceInstance.listTasks(listName)
                .then(function(tasks) { 
                    console.log(JSON.stringify(tasks));
                    let concatenatedTasks = tasks.map(x => x.title).reduce((a, b) =>  a + ", " + b);
                    self.response.speak(`On list ${listName} you have ${concatenatedTasks}.`);
                    self.emit(':responseReady'); }
                );
        }
    },
    'AMAZON.HelpIntent': function () {
        console.log("Wunderlist assistant: HelpIntent.");
        this.response.speak(HELP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        console.log("Wunderlist assistant: CancelIntent.");
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        console.log("Wunderlist assistant: StopIntent.");
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

function delegateSlotCollection(event, emit){
    if (event.request.dialogState === "STARTED") {
        var updatedIntent = event.request.intent;
        emit(":delegate", updatedIntent);
    } else if (event.request.dialogState !== "COMPLETED") {
        emit(":delegate");
    }
}

function areAllSlotsValid(request) {
    return isSlotValid(request, "listName")
        && isSlotValid(request, "taskName")
        && isSlotValid(request, "dueDate");
}

function isSlotValid(request, slotName) {
    return (
        request.intent 
            && request.intent.slots 
            && request.intent.slots[slotName] 
            && request.intent.slots[slotName].value);
}