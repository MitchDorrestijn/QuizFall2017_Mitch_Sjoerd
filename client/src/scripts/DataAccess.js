import 'whatwg-fetch';
export default class DataAccess {
	constructor (authString) {
		this.api = "/api";
	}

	_fetchApi (request, cb) {
		fetch (request).then ((res) => {
			return res.text ();
		}).then ((res) => {
			let parsedMessage = JSON.parse (res);
			if (parsedMessage.error) {
				cb (parsedMessage.error, null);
			} else {
				cb (null, parsedMessage)
			}
		});
	}

	getData (url, cb) {
		//let headers = new Headers ();
		let requestParams = {
			method: 'GET',
			// headers: headers,
			mode: 'cors',
			cache: 'default'
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	postData (url, body, cb) {
		let headers = new Headers ();
		headers.append ("Content-Type", "application/json");
		let requestParams = {
			method: 'POST',
			headers: headers,
			body: JSON.stringify (body)
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	putData (url, body, cb) {
		let headers = new Headers ();
		headers.append ("Content-Type", "application/json");
		let requestParams = {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify (body)
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}

	deleteData (url, cb) {
		let headers = new Headers ();
		let requestParams = {
			method: 'DELETE',
			headers: headers,
		};
		let request = new Request (this.api + url, requestParams);
		this._fetchApi (request, cb);
	}
}
