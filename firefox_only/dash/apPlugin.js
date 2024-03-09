const storage = {
    getItem: async (key) => (await browser.storage.local.get(key))[key],
    setItem: (key, val) => browser.storage.local.set({ [key]: val }),
    removeItem: (keys) => browser.storage.local.remove(keys)
}

const settings = {
    'bg': null,
    'fg': null,
    'ln': null,
    'fs': null,
    'ff': null,
    'ps': null
}

const toastId = document.getElementById("toast")
const toast = new bootstrap.Toast(toastId, {'autohide': true, 'delay': 2000})

function send(type, data) {
    settings[type] = data
	browser.runtime.sendMessage(
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
            send('ff', 'Arial')
            send('fs', '20')
		} else if(data == 'B') {
			send('bg', '54,54,54')
			send('fg', '0,255,0')
			send('ln', '205,50,50')
            send('ff', 'Arial')
            send('fs', '20')
		} else if(data == 'C') {
			send('bg', '189,181,165')
			send('fg', '0,0,0')
			send('ln', '50,50,205')
            send('ff', '"Comic Sans MS", "Comic Sans", cursive')
            send('fs', '20')
		} else if(data == 'D') {
			send('bg', '20,20,25')
			send('fg', '255,255,255')
			send('ln', '0,180,255')
            send('ff', 'ap_custom_dyslexiaFont')
            send('fs', '18')
		} else if(data == 'E') {
			send('bg', '25,20,20')
			send('fg', '255,255,255')
			send('ln', '255,180,0')
            send('ff', 'ap_custom_dyslexiaFont')
            send('fs', '18')
		}
	} else {
		send(type, data)
	}
}

let e = document.getElementsByClassName('option')
for (let i = 0; i < e.length; i++) {
    e[i].addEventListener('click', apUpdate, false)
}

document.getElementById("remember").addEventListener("click", () => {
    toastId.innerHTML = "Settings Remembered"
    toast.show()
    browser.runtime.sendMessage(
        JSON.stringify(
            {
                type: 'remember',
                data: true,
                settings: settings
            }
        )
    )
})

document.getElementById("forget").addEventListener("click", () => {
    toastId.innerHTML = "Settings Forgotten"
    toast.show()
    browser.runtime.sendMessage(
        JSON.stringify(
            {
                type: 'remember',
                data: false,
                settings: null
            }
        )
    )
})

fetch("http://localhost/api/software", {
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": JSON.stringify({ project: "AccessibilityPlus" })
})
