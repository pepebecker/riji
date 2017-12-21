'use strict'

const level = require('level')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const files = [
	path.join(__dirname, '../data/cedict_1_0_ts_utf-8_mdbg.txt'),
	path.join(__dirname, '../data/extra.txt')
]

buildData(files)

function buildData (files) {
	Promise.all(files.map(processFile))
	.then(values => {
		const data = values.reduce((chunk, current) => Object.assign(current, chunk), {})
		const db = level(path.join(__dirname, '../db'), { valueEncoding: 'json' })
		db.put('words', data, err => {
			if (err) {
				throw err
			} else {
				console.log('Successfully built data\n')
			}
		})
	})
}

function processFile (file) {
	return new Promise((resolve, reject) => {
		const data = {}
		const rl = readline.createInterface({
			input: fs.createReadStream(file)
		})
		rl.on('line', line => {
			if (line == '' || /^#/.test(line)) {
				return
			}

			const params = line.slice(0, -1).split('/')
			const mandarin = params[0].slice(0, -1).substr(0, params[0].length - 2).split(' [')
			const definitions = params.slice(1)

			const characters = mandarin[0].split(' ')
			const traditional = characters[0]
			const simplified = characters[1]
			const pinyin = mandarin[1].replace(/\u:/g, 'ü')

			data[simplified] = data[simplified] || {}
			data[simplified].definitions = data[simplified].definitions || {}
			data[simplified].definitions[pinyin] = (data[simplified].definitions[pinyin] || []).concat(definitions)

			if (simplified !== traditional) {
				data[simplified].traditional = traditional
				data[traditional] = {
					definitions: data[simplified].definitions,
					simplified
				}
			}
		})
		rl.on('close', () => {
			resolve(data)
		})
	})
}
