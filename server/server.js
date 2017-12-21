const level = require('level')
const io = require('socket.io')(7665)
const path = require('path')

const db = level(path.join(__dirname, 'db'), { valueEncoding: 'json' })

const state = {
	words: null
}

function generateDataKey (date) {
	date = date || new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return year + '-' + month + '-' + day
}

db.get('words', (err, words) => {
	if (err) {
		console.log(err.message || err)
		process.exit(1)
	}
	state.words = words
})

io.on('connect', socket => {
	if (state.words) {
		socket.emit('words', state.words)
	}

	db.get(generateDataKey(new Date()), (err, data) => {
		if (err) {
			console.log(err.message || err)
			socket.emit('data', { date: new Date(), text: '' })
		} else {
			data.date = data.date || new Date()
			socket.emit('data', data)
		}
	})

	socket.on('load', date => {
		date = new Date(date)
		db.get(generateDataKey(date), (err, data) => {
			if (err) {
				console.log(err.message || err)
				socket.emit('data', { date, text: '' })
			} else {
				data.date = data.date || date
				socket.emit('data', data)
			}
		})
	})

	socket.on('save', data => {
		db.put(generateDataKey(new Date(data.date)), data, err => {
			if (err) {
				console.log(err.message || err)
				socket.emit('saved', false)
			} else {
				socket.emit('saved', true)
			}
		})
	})
})

