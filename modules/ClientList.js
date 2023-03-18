var list = new Array();

function printList() {
	console.log();
	if (list.length == 0) {
		console.log('[ClientList] There are no client!')
	}
	else {
		console.log('[ClientList] There are ' + list.length + ' client:')
		list.forEach(function (data, index) {
			console.log((index + 1) + '. username=' + data.username + ' id=' + data.id + ' ip=' + data.ip)
		})
	}
	console.log();
}

function add(username, id, ip) {
	list.push({ username: username, id: id, ip: ip })
}

function removeId(id) {
	let index = list.findIndex(x => x.id === id)
	if (index >= 0) {
		let data = list.at(index)
		list.splice(index, 1)
		return data
	}
	else {
		console.log('[ClientList][ERROR] Cannot find user with id=' + id)
		return null
	}
}

module.exports = {
	add,
	removeId,
	printList
};