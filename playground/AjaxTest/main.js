const loadJson = (method, fileToRead, callback) => {
	let ajaxReqest = new XMLHttpRequest();
	ajaxReqest.overrideMimeType("application/json");
	ajaxReqest.open(method, fileToRead, true);
	ajaxReqest.onreadystatechange = function () {
		if (ajaxReqest.readyState == 4 && ajaxReqest.status == "200") {
			callback(ajaxReqest.responseText);
		}
	}
	ajaxReqest.send(null);
};

loadJson('GET', 'largeStarList.json', (response) => {
	let json = JSON.parse(response);
	document.getElementById("root").innerHTML = json[0].name;
});
