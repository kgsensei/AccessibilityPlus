function send(type, data) {
	chrome.runtime.sendMessage(
		JSON.stringify(
			{
				type: type,
				data: data
			}
		)
	)
}

function apUpdate() {
	let type = this.getAttribute('ap-type')
	let data = this.getAttribute('ap-data')
	if(type == 'ps') {
		if(data == 'A') {
			send('bg', '133,234,113')
			send('fg', '0,0,255')
			send('ln', '205,50,50')
		}
		if(data == 'B') {
			send('bg', '54,54,54')
			send('fg', '0,255,0')
			send('ln', '205,50,50')
		}
		if(data == 'C') {
			send('bg', '189,181,165')
			send('fg', '0,0,0')
			send('ln', '50,50,205')
		}
		send('fs', '22')
	} else {
		send(type, data)
	}
}

var e = document.getElementsByClassName('option')
for (var i = e.length; i--; null) {
    e[i].addEventListener('click', apUpdate, false);
}
