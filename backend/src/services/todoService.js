const config = require('config');

module.exports = function toDoService(externalToDoService) {

    function addTask(listName, task) {
        return getListId(listName)
            .then(function(listId) { 
                if (listId == null) {
                    return null;
                }
                return externalToDoService.addTask(listId, task); })
            .catch(err => console.error(err));
    }

    function listTasks(listName) {
        return getListId(listName)
            .then(function(listId) { 
                if (listId == null) {
                    return null;
                }
                return externalToDoService.listTasks(listId); })
            .catch(err => console.error(err));
    }

    function getListId(listName) {
        return externalToDoService.getAllLists()
            .then(function(lists) { 
                let list = lists.find(x => x.title.toLowerCase() == listName.toLowerCase());
                if (list === undefined) {
                    return null;
                } else {
                    return list.id;
                } 
            })
            .catch(err => console.error(err));
    }

    return {
        addTask: addTask,
        listTasks: listTasks,
    };
};

