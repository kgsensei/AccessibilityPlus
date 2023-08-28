function update(type, data) {
    console.log("update")
	// Background size
    if(type == 'bg') {
		document.body.style.backgroundColor = `rgb(${data}) !important`
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.backgroundColor = `rgb(${data}) !important`
		}
	}
    // Font color
	if(type == 'fg') {
		document.body.style.color = `rgb(${data}) !important`
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data}) !important`
		}
	}
    // Font size
	if(type == 'fs') {
		document.body.style.fontSize = `${data}px !important`
		let e = document.getElementsByTagName('p')
		for(let i = 0; i < e.length; i++) {
			e[i].style.fontSize = `${data}px !important`
		}
	}
    // Link color
    if(type == 'ln') {
		let e = document.getElementsByTagName('a')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data}) !important`
			e[i].style.textDecorationLine = 'underline !important'
		}
	}
    // Font family
    if(type == 'ff') {
		document.body.style.fontSize = `${data}px !important`
		let e = document.getElementsByTagName('p')
		for(let i = 0; i < e.length; i++) {
			e[i].style.fontSize = `${data}px !important`
		}
	}
    return true
}

chrome.runtime.onMessage.addListener(async (data) => {
	let x = await chrome.tabs.query({active: true})
	let ap = JSON.parse(data)
    console.log(ap)
    console.log(x[0].id)
	chrome.scripting.executeScript({
		target: {
            tabId: x[0].id,
            allFrames: true
        },
		func: update,
		args: [ap.type, ap.data]
	})
})
