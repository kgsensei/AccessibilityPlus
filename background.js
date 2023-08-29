const storage = {
    getItem: async (key) => {
        return (await chrome.storage.local.get(key))[key]
    },
    setItem: (key, val) => {
        chrome.storage.local.set({[key]:val})
    },
    removeItem: (keys) => {
        chrome.storage.local.remove(keys)
    }
}

function update(type, data) {
	// Background color
    if(type == 'bg') {
		document.body.style.backgroundColor = `rgb(${data})`
        // Update divs
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.backgroundColor = `rgb(${data})`
		}
        // Update h1 tags
        let f = document.getElementsByTagName('h1')
		for(let i = 0; i < f.length; i++) {
			f[i].style.backgroundColor = `rgb(${data})`
		}
        // Update h2 tags
        let g = document.getElementsByTagName('h2')
		for(let i = 0; i < g.length; i++) {
			g[i].style.backgroundColor = `rgb(${data})`
		}
        // Update h3 tags
        let h = document.getElementsByTagName('h3')
		for(let i = 0; i < h.length; i++) {
			h[i].style.backgroundColor = `rgb(${data})`
		}
        // Update h4 tags
        let j = document.getElementsByTagName('h4')
		for(let i = 0; i < j.length; i++) {
			j[i].style.backgroundColor = `rgb(${data})`
		}
	}

    // Font color
	if(type == 'fg') {
		document.body.style.color = `rgb(${data})`
        // Update divs
		let e = document.getElementsByTagName('div')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data})`
		}
        // Update spans
        let f = document.getElementsByTagName('span')
		for(let i = 0; i < f.length; i++) {
			f[i].style.color = `rgb(${data})`
		}
	}

    // Font size
	if(type == 'fs') {
		document.body.style.fontSize = `${data}px`
		let e = document.getElementsByTagName('p')
		for(let i = 0; i < e.length; i++) {
			e[i].style.fontSize = `${data}px`
		}
	}

    // Link color
    if(type == 'ln') {
		let e = document.getElementsByTagName('a')
		for(let i = 0; i < e.length; i++) {
			e[i].style.color = `rgb(${data})`
			e[i].style.textDecorationLine = 'underline'
		}
	}

    // Font family
    if(type == 'ff') {
		document.body.style.fontFamily = `${data}`
		let e = document.getElementsByTagName('p')
		for(let i = 0; i < e.length; i++) {
			e[i].style.fontFamily = `${data}`
		}
	}

    return true
}

async function getDomain() {
    let x = await chrome.tabs.query({active: true})
    if(x[0].url == undefined) {
        return false
    }
    let u = new URL(x[0].url)
    return u.hostname.replaceAll(".", "-")
}

async function removeTheme() {
    let x = await getDomain()
    if(x == false) {
        return
    }
    storage.removeItem(x)
}

async function saveTheme(data) {
    let x = await getDomain()
    if(x == false) {
        return
    }
    let d = JSON.stringify(data)
    storage.setItem(x, d)
}

async function loadSaved(i) {
    let u = await getDomain()
    storage.setItem("currentSite", u || false)
    if(u == false) {
        return
    }
    let d = await storage.getItem(u)
    if(d == undefined) {
        return
    }
    d = JSON.parse(d)
    for (const t in d) {
        if(t != null) {
            chrome.scripting.executeScript({
                target: {
                    tabId: i,
                    allFrames: true
                },
                func: update,
                args: [t, d[t]]
            })
        }
    }
}

chrome.runtime.onMessage.addListener(async (data) => {
	let x = await chrome.tabs.query({active: true})
	let ap = JSON.parse(data)
    if(ap.type == "remember") {
        if(ap.data == true) {
            saveTheme(ap.settings)
        } else {
            removeTheme()
        }
    } else {
        chrome.scripting.executeScript({
            target: {
                tabId: x[0].id,
                allFrames: true
            },
            func: update,
            args: [ap.type, ap.data]
        })
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status == 'complete') {
        loadSaved(tabId)
    }
})
