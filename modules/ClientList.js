const configShowList = false;
var list = new Array();

function printList() {
	if (list.length == 0) {
		console.log('[ClientList] There are no client')
	}
	else {
		console.log('[ClientList] There are ' + list.length + ' client')
		if (configShowList) {
			list.forEach(function (data, index) {
				console.log('\t' + (index + 1) + '. email=' + data.email + ' page=' + data.page + ' id=' + data.id + ' ip=' + data.ip)
			})
		}
	}
}

function add(email, page, id, ip) {
	list.push({ email: email, page: page, id: id, ip: ip })
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
	list,
	add,
	removeId,
	printList
};