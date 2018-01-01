const config = require('config');

module.exports = function toDoService(externalToDoService) {

    function addTask(listName, task) {
        return getListId(listName)
            .then(listId => externalToDoService.addTask(listId, task))
            .catch(err => console.error(err));
    }

    function listTasks(listName) {
        return getListId(listName)
            .then(listId => externalToDoService.listTasks(listId))
            .catch(err => console.error(err));
    }

    function getListId(listName) {
        return externalToDoService.getAllLists()
            .then(lists => lists.find(x => x.title.toLowerCase() == listName.toLowerCase()).id)
            .catch(err => console.error(err));
    }

    return {
        addTask: addTask,
        listTasks: listTasks,
    };
};

