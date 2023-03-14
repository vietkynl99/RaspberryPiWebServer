class ClientList {
	#list;

	constructor() {
		this.#list = new Array();
	}

	printList() {
		console.log();
		if (this.#list.length == 0) {
			console.log('[ClientList] There are no client!')
		}
		else {
			console.log('[ClientList] There are ' + this.#list.length + ' client:')
			this.#list.forEach(function (data, index) {
				console.log((index + 1) + '. username=' + data.username + ' id=' + data.id + ' ip=' + data.ip)
			})
		}
		console.log();
	}

	add(username, id, ip) {
		this.#list.push({ username: username, id: id, ip: ip })
	}

	removeId(id) {
		let index = this.#list.findIndex(x => x.id === id)
		if (index >= 0) {
			let data = this.#list.at(index)
			this.#list.splice(index, 1)
			return data
		}
		else {
			console.log('[ClientList][ERROR] Cannot find user with id=' + id)
			return null
		}
	}
}

module.exports = ClientList;