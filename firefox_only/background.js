const storage = {
    getItem: async (key) => {return (await browser.storage.local.get(key))[key]},
    setItem: (key, val) => browser.storage.local.set({ [key]: val }),
    removeItem: (keys) => browser.storage.local.remove(keys)
}

function update(type, data) {
    const arrTag = (tag) => {
        return Array.from(document.getElementsByTagName(tag))
    }
    
    // Background color
    if(type == 'bg') {
		document.body.style.backgroundColor = `rgb(${data})`
		let e = arrTag('div')
        e = e.concat(arrTag('header'))
        e = e.concat(arrTag('h1'))
        e = e.concat(arrTag('h2'))
        e = e.concat(arrTag('h3'))
        e = e.concat(arrTag('h4'))
		for(let i = 0; i < e.length; i++) {
			e[i].style.backgroundColor = `rgb(${data})`
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
    let x = await browser.tabs.query({active: true})
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
            browser.scripting.executeScript({
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

browser.runtime.onMessage.addListener(async (data) => {
	let x = await browser.tabs.query({active: true})
	let ap = JSON.parse(data)
    if(ap.type == "remember") {
        if(ap.data == true) {
            saveTheme(ap.settings)
        } else {
            removeTheme()
        }
    } else {
        browser.scripting.executeScript({
            target: {
                tabId: x[0].id,
                allFrames: true
            },
            func: update,
            args: [ap.type, ap.data]
        })
    }
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if(changeInfo.status == 'complete') {
        loadSaved(tabId)
    }
})
