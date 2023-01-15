function update(type, data) {
	if(type == 'bg') {
		document.body.style.backgroundColor = `rgb(${data})`
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.backgroundColor = `rgb(${data})`
		}
	}
	if(type == 'fg') {
		document.body.style.color = `rgb(${data})`;
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data})`
		}
	}
	if(type == 'fs') {
		document.body.style.fontSize = `${data}px`
		let e = document.getElementsByTagName('p')
		for(let i = 0; i < e.length; i++) {
			e[i].style.fontSize = `${data}px`
		}
	}
	if(type == 'ln') {
		let e = document.getElementsByTagName('a')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data})`
			e[i].style.textDecorationLine = 'underline'
		}
	}
}

chrome.runtime.onMessage.addListener(async (data) => {
	let x = await chrome.tabs.query({active: true})
	let ap = JSON.parse(data)
	chrome.scripting.executeScript({
		target: {
			tabId: x[0].id
		},
		function: update,
		args: [ap.type, ap.data]
	})
})
