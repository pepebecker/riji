const io = require('socket.io-client')
const elements = require('./elements')
const cursorManager = require('./cursor-manager')
const utils = require('./utils')
const socket = io('http://localhost:7665')

document.body.appendChild(elements.container)

const state = {
	connected: false,
	loaded: false,
	words: null,
	edited: false,
	currentDate: null,
	autosafeInterval: 3000,
	history: [],
	historyIndex: 0
}

function setConnected (value) {
	state.connected = value
	if (value) {
		elements.status.classList.add(elements.style.online)
	} else {
		elements.status.classList.remove(elements.style.online)
	}
}

function setEdited (value) {
	state.edited = value
	if (value) {
		elements.status.classList.remove(elements.style.saved)
	} else {
		elements.status.classList.add(elements.style.saved)
	}
}

function setLoaded (value) {
	state.loaded = value
	if (value) {
		elements.status.classList.remove(elements.style.loading)
	} else {
		elements.status.classList.add(elements.style.loading)
	}
}

function updateHistoryControls () {
	if (state.historyIndex > 0) {
		elements.undoBtn.classList.remove(elements.style.disabled)
	} else {
		elements.undoBtn.classList.add(elements.style.disabled)
	}
	if (state.historyIndex >= state.history.length - 1) {
		elements.redoBtn.classList.add(elements.style.disabled)
	} else {
		elements.redoBtn.classList.remove(elements.style.disabled)
	}
	elements.historySlider.max = state.history.length - 1
	elements.historySlider.value = state.historyIndex
}

socket.on('connect', () => {
	state.connected = true
	setConnected(true)
	setEdited(false)
	setLoaded(false)
})

socket.on('words', words => {
	state.words = words
	if (document.activeElement !== elements.textEditor) {
		tokenizeText(elements.textEditor)
	}
})

socket.on('data', data => {
	console.log('received:', data)
	fillEditorWithData(new Date(data.date), data.weather, data.text)
	cleaHistory()
	pushCurrentStateToHistory()
})

socket.on('saved', success => {
	if (success) {
		setEdited(false)
	} else {
		console.error('Could not save data')
	}
})

socket.on('disconnect', () => {
	setConnected(false)
})

function fillEditorWithData (date, weather, text) {
	if (typeof date === 'object' && typeof text === 'string') {
		state.currentDate = date
		state.weather = weather
		const dateObj = utils.generateChineseDate(date)
		const weekdayObj = utils.generateChineseWeekday(date)
		elements.dayPicker.innerText = dateObj.mandarin
		elements.dateField.innerText = dateObj.mandarin
		elements.mandarinWeekdayField.innerText = weekdayObj.mandarin
		elements.englishWeekdayField.innerText = weekdayObj.english
		elements.weatherField.value = weather || ''

		elements.textEditor.innerHTML = text.replace(/\n/g, '<br>')
		tokenizeText(elements.textEditor)
		setLoaded(true)
	} else {
		console.log('date:', typeof date, ' text:', typeof text)
	}
}

function cleaHistory () {
	state.history = []
	state.historyIndex = 0
}

function pushCurrentStateToHistory () {
	if (state.historyIndex < state.history.length - 1) {
		state.history = state.history.slice(0, state.historyIndex + 1)
	}
	state.history.push(elements.textEditor.innerText)
	state.historyIndex = state.history.length - 1
	updateHistoryControls()
}

function pullStateFromHistory (index) {
	if (index >= 0 && index < state.history.length) {
		state.historyIndex = index
		fillEditorWithData(state.currentDate, state.weather, state.history[index])
		setEdited(true)
		updateHistoryControls()
	} else {
		console.log('History index is out of range')
	}
}

function setAllPopupsHidden (hidden) {
	const tokens = document.getElementsByClassName(elements.style.token)
	for (let i = 0; i < tokens.length; i++) {
		const popupTop = tokens[i].querySelector('div')
		const popupBottom = tokens[i].querySelector('ul')
		if (hidden) {
			popupTop.classList.add(elements.style.hidden)
			popupBottom.classList.add(elements.style.hidden)
		} else {
			popupTop.classList.remove(elements.style.hidden)
			popupBottom.classList.remove(elements.style.hidden)
		}
	}
}

function save () {
	setAllPopupsHidden(true)
	const data = {
		date: state.currentDate,
		weather: elements.weatherField.value,
		text: elements.textEditor.innerText
	}
	socket.emit('save', data)
	setAllPopupsHidden(false)
}

setInterval(() => {
	if (state.edited) {
		save()
	}
}, state.autosafeInterval)

function getTokens (text) {
	if (state.words) {
		const tokens = []

		let index = 0
		while (index < text.length) {
			let word = text.substr(index)
			let count = word.length
			let wordFound = false
			while (count >= 0) {
				word = word.substr(0, count)
				if (state.words[word]) {
					index += count - 1
					const entry = state.words[word]
					entry.word = word
					tokens.push(entry)
					wordFound = true
					break
				}
				count --
			}
			if (!wordFound) {
				tokens.push(text[index])
			}
			index ++
		}
		return tokens
	} else {
		return text
	}
}

function tokenizeText (el) {
	const tokens = getTokens(el.innerText)
	elements.clearElement(el)
	for (let t of tokens) {
		if (typeof t === 'string') {
			if (t === '\n') {
				el.appendChild(document.createElement('br'))
			} else {
				el.appendChild(document.createTextNode(t))
			}
		} else {
			const { token, popupTop, popupBottom } = elements.createToken(t)
			el.appendChild(token)

			token.addEventListener('click', event => {
				popupTop.classList.add(elements.style.hidden)
				popupBottom.classList.add(elements.style.hidden)
			})

			popupTop.addEventListener('click', event => {
				event.stopPropagation()
				const current = token.firstChild.textContent
				const variant = popupTop.innerText
				token.replaceChild(document.createTextNode(variant), token.firstChild)
				popupTop.replaceChild(document.createTextNode(current), popupTop.firstChild)
				setEdited(true)
			})

			popupBottom.addEventListener('click', event => {
				event.stopPropagation()
			})
		}
	}
}

elements.textEditor.addEventListener('click', event => {
	if (document.activeElement !== elements.textEditor && state.connected && state.loaded) {
		elements.textEditor.innerHTML = elements.textEditor.innerText.replace(/\n/g, '<br>')
		elements.textEditor.contentEditable = true
		elements.textEditor.focus()
		cursorManager.setEndOfContenteditable(elements.textEditor)
	}
})

elements.textEditor.addEventListener('focusout', event => {
	elements.textEditor.contentEditable = false
	tokenizeText(elements.textEditor)
})

elements.textEditor.addEventListener('input', event => {
	pushCurrentStateToHistory()
	setEdited(true)
})

elements.weatherField.addEventListener('input', event => {
	setEdited(true)
})

elements.undoBtn.addEventListener('click', event => {
	pullStateFromHistory(state.historyIndex - 1)
})

elements.redoBtn.addEventListener('click', event => {
	pullStateFromHistory(state.historyIndex + 1)
})

elements.historySlider.addEventListener('input', event => {
	pullStateFromHistory(event.target.value)
})

elements.previousDayButton.addEventListener('click', event => {
	let date = new Date()
	date.setDate(state.currentDate.getDate() - 1)
	socket.emit('load', date)
	setLoaded(false)
})

elements.nextDayButton.addEventListener('click', event => {
	let date = new Date()
	date.setDate(state.currentDate.getDate() + 1)
	socket.emit('load', date)
	setLoaded(false)
})
