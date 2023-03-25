var list = new Array();

function printList() {
	if (list.length == 0) {
		console.log('[ClientList] There are no client!')
	}
	else {
		console.log('[ClientList] There are ' + list.length + ' client:')
		list.forEach(function (data, index) {
			console.log('\t' + (index + 1) + '. email=' + data.email + ' id=' + data.id + ' ip=' + data.ip)
		})
	}
}

function add(email, id, ip) {
	list.push({ email: email, id: id, ip: ip })
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