const config = require('config');
const rp = require('request-promise');

module.exports = function wunderlist(accessToken) {

	let _accessToken = accessToken;
	let _clientId = config.get('wunderlist.clientId');

	function addTask(listId, task) {
		let options = {
			uri: 'https://a.wunderlist.com/api/v1/tasks',
			method: 'POST',
			body: {
				"list_id": listId,
				"title": task.title,
				"completed": false,
				"due_date": task.dueDate,
				"starred": false
			},
			headers: {
				"X-Access-Token": _accessToken,
				"X-Client-ID": _clientId
			},
			json: true
		}

		return rp(options)
			.then(function (response) {
				return response;
			})
			.catch(function (err) {
				console.error(JSON.stringify(err));
			});
	}

	function listTasks(listId) {
		let options = {
			uri: 'https://a.wunderlist.com/api/v1/tasks',
			qs: {
				"list_id": listId
			},
			headers: {
				"X-Access-Token": _accessToken,
				"X-Client-ID": _clientId
			},
			json: true
		}

		return rp(options)
			.then(function (response) {
				return response;
			})
			.catch(function (err) {
				console.error(JSON.stringify(err));
			});
	}

	function getAllLists() {
		let options = {
			uri: 'https://a.wunderlist.com/api/v1/lists',
			headers: {
				"X-Access-Token": _accessToken,
				"X-Client-ID": _clientId
			},
			json: true
		}

		return rp(options)
			.then(function (response) {
				return response;
			})
			.catch(function (err) {
				console.error(JSON.stringify(err));
			});
	}

	return {
		addTask: addTask,
		listTasks: listTasks,
		getAllLists: getAllLists,
	};
}