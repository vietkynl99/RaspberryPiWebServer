var uilog = require('../modules/uiLog')

const configShowList = false;
var list = new Array();

function printList() {
	if (list.length == 0) {
		uilog.log(uilog.Level.CLIENT, 'There are no client')
	}
	else {
		uilog.log(uilog.Level.CLIENT, 'There are ' + list.length + ' client')
		if (configShowList) {
			list.forEach(function (data, index) {
				uilog.log(uilog.Level.CLIENT, '\t' + (index + 1) + '. email=' + data.email + ' page=' + data.page + ' id=' + data.id + ' ip=' + data.ip)
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
		uilog.log(uilog.Level.ERROR, 'Cannot find user with id=' + id)
		return null
	}
}

module.exports = {
	list,
	add,
	removeId,
	printList
};