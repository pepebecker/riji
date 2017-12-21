const bel = require('bel')
const csjs = require('csjs-inject')

const style = csjs`
	@font-face {
		font-family: 'STKaiti';
		src: url('fonts/stkaiti.ttf');
		unicode-range: U+4E00-9FFF;
	}
	.header {
		min-width: 400px;
		position: relative;
		display: flex;
		align-items: center;
	}
	.header__h1 {
		margin: 10px;
		padding: 10px;
		colorL #444;
		font-family: 'STKaiti', Helvetica, sans-serif;
	}
	.status {
		background: red;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		padding: 5px;
		box-sizing: border-box;
	}
	.status__inside {
		display: none;
		width: 100%;
		height: 100%;
		background: #eee;
		border-radius: 50%;
		position: relative;
	}
	.status__inside > div {
		width: 60%;
		height: 60%;
		background: blue;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		top: -35%;
		transform: translateX(-50%);
	}
	.status.online {
		background: orange;
	}
	.status.online.saved {
		background: green;
	}
	.status.loading {
		background: lightblue !important;
		animation: rotating 2s infinite;
	}
	.status.loading .status__inside {
		display: block;
	}
	.nav {
		position: absolute;
		right: 10px;
		margin: 0;
		padding: 10px;
		list-style: none;
		display: flex;
		align-items: center;
	}
	.day_nav_button {
		border: none;
		margin: 0 5px;
		padding: 0;
		font-size: 1.6em;
		background: transparent;
		outline: none;
		cursor: pointer;
	}
	.day_nav_button:hover path {
		fill: gray;
	}
	.day_nav_button:active path {
		fill: red;
	}
	.day_picker {
		font-size: 1em;
	}
	.doc {
		font-size: 14px;
	}
	.ribbon {
		background: #3F51B5;
		height: 200px;
	}
	.editor {
		position: relative;
		top: -150px;
		margin: 0 auto;
		min-width: 400px;
		width: 60%;
	}
	.editor__header {
		background: #444;
		padding: 5px;
		color: white;
		border-radius: 5px 5px 0 0;
		display: flex;
		align-items: center;
	}
	.history_button {
		background: transparent;
		border: none;
		outline: none;
		font-size: 1.4em;
		cursor: pointer;
	}
	.history_button path {
		fill: white;
	}
	.history_button:active path {
		fill: red;
	}
	.history_button.disabled {
		cursor: default !important;
	}
	.history_button.disabled path {
		fill: gray !important;
	}
	.history_slider {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		background: black;
		height: 4px;
		border-radius: 2px;
		outline: none;
		box-sizing: border-box;
	}
	.history_slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: white;
		border: none;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.history_slider::-moz-range-thumb {
		-mox-appearance: none;
		appearance: none;
		width: 14px;
		height: 14px;
		background: white;
		border: none;
		border-radius: 50%;
		box-sizing: border-box;
	}
	.history_slider::-moz-range-track {
		background: transparent;
	}
	.editor__title {
		background: #fff;
		border-bottom: 1px solid #ddd;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		font-size: 16px;
	}
	.editor_header_field {
		position: relative;
		font-size: 1em;
		border-bottom: 2px solid transparent;
		width: 30%;
	}
	.editor_header_field .english {
		bottom: 100%;
		min-width: 100%;
		width: max-content;
	}
	.editor_header_field:hover .english {
		display: block;
	}
	.placeholder {
		color: gray;
	}
	.date {
		text-align: left;
	}
	.weekday {
		text-align: center;
	}
	.weather {
		text-align: right;
		border: none;
		outline: none;
		border-bottom: 2px solid transparent;
	}
	.weather:focus {
		border-bottom: 2px solid skyblue;
	}
	.editor__text {
		background: #fff;
		min-height: 300px;
		font-size: 2em;
		outline: none;
		font-family: 'STKaiti', Helvetica, sans-serif;
		font-weight: lighter;
		padding: 10px;
		border-radius: 0 0 5px 5px;
	}
	.token {
		position: relative;
		display: inline-block;
		white-space: nowrap;
		cursor: pointer;
	}
	.token:hover {
		border-radius: 3px;
		background: rgba(0, 156, 255, 0.2);
	}
	.popup {
		background: rgba(255, 255, 255, 0.95);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		min-width: 50px;
		width: max-content;
		max-width: 300px;
		border: 1px solid #ddd;
		border-radius: 3px;
		margin: 0;
		padding: 5px;
		box-sizing: border-box;
		display: none;
		z-index: 100;
	}
	.popup_top {
		bottom: 100%;
		text-align: center;
		color: tomato;
		cursor: pointer;
	}
	.popup_top.empty {
		display: none !important;
	}
	.popup_bottom {
		top: 100%;
		text-align: left;
		margin-bottom: 50px;
	}
	.token:hover .popup {
		display: block;
	}
	.popup_bottom > li {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: .5em;
		color: tomato;
	}
	.popup_bottom > li > ul {
		color: #444;
		padding: 0 0 0 1.2em;
	}
	.popup_bottom > li > ul > li {
		white-space: normal;
	}
	.classifier {
		color: green;
	}
	.hidden {
		display: none !important;
	}
	@keyframes rotating {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`

const elements = { style }

const cn = (...list) => list.join(' ')

elements.status = bel`
	<div class=${ style.status }>
		<div class=${ style.status__inside }>
			<div></div>
		</div>
	</div>
`

elements.previousDayButton = bel`
	<button class=${ cn(style.day_nav_button, style.previous_day_button) } title="Previous Day">
		<i class="fas fa-caret-left"></i>
	</button>
`

elements.nextDayButton = bel`
	<button class=${ cn(style.day_nav_button, style.next_day_button) } title="Next Day">
		<i class="fas fa-caret-right"></i>
	</button>
`

elements.dayPicker = bel`
	<div class=${ style.day_picker }></div>
`

elements.header = bel`
	<header class=${ style.header }>
		<h1 class=${ style.header__h1 }>我的日记</h1>
		${ elements.status }
		<nav class=${ style.nav }>
			${ elements.previousDayButton }
			${ elements.dayPicker }
			${ elements.nextDayButton }
		</nav>
	</header>
`

elements.ribbon = bel`
	<div class=${ style.ribbon }/>
`

elements.dateField = bel`
	<div class=${ cn(style.editor_header_field, style.date) }>
		<span class=${ style.placeholder }>日期</span>
	</div>
`

elements.mandarinWeekdayField = bel`
	<span class=${ style.mandarin }>
		<span class=${ style.placeholder }>星期几</span>
	</span>
`

elements.englishWeekdayField = bel`
	<span class=${ cn(style.popup, style.english) }></span>
`

elements.weekdayField = bel`
	<div class=${ cn(style.editor_header_field, style.weekday) }>
		${ elements.mandarinWeekdayField }
		${ elements.englishWeekdayField }
	</div>
`

elements.weatherField = bel`
	<input type="text" placeholder="天气" class=${ cn(style.editor_header_field, style.weather) }>
`

elements.titleEditor = bel`
	<div class=${ style.editor__title }>
		${ elements.dateField }
		${ elements.weekdayField }
		${ elements.weatherField }
	</div>
`

elements.textEditor = bel`
	<div class=${ style.editor__text } />
`

elements.undoBtn = bel`
	<button class=${ cn(style.history_button, style.undo_button, style.disabled) } title="Undo">
		<i class="fas fa-caret-left"></i>
	</button>
`

elements.redoBtn = bel`
	<button class=${ cn(style.history_button, style.redo_button, style.disabled) } title="Redo">
		<i class="fas fa-caret-right"></i>
	</button>
`

elements.historySlider = bel`
	<input type="range" min="0" max="0" value="0" class=${ style.history_slider }>
`

elements.editorHeader = bel`
	<div class=${ style.editor__header }>
		${ elements.undoBtn }
		${ elements.redoBtn }
		${ elements.historySlider }
	</div>
`

elements.editor = bel`
	<div class=${ style.editor }>
		${ elements.editorHeader }
		${ elements.titleEditor }
		${ elements.textEditor }
	</div>
`

elements.doc = bel`
	<div class=${ style.doc }>
		${ elements.ribbon }
		${ elements.editor }
	</div>
`

elements.container = bel`
	<div class=${ style.container }>
		${ elements.header }
		${ elements.doc }
	</div>
`

elements.createToken = function (data) {
	const variant = data.traditional || data.simplified
	const popupTop = bel`
		<div class=${ style.popup + ' ' + style.popup_top}>
			${ variant }
		</div>
	`

	if (!variant) {
		popupTop.classList.add(style.empty)
	}

	const popupBottom = bel`
		<ul class=${ style.popup + ' ' + style.popup_bottom}>
			${ Object.keys(data.definitions).map(pinyin => {
				return bel`
					<li>
						${ pinyin }
						<ul>
							${ data.definitions[pinyin].map(def => {
								if (def.substr(0, 3) === 'CL:') {
									const classifier = def.slice(3)
									const clList = classifier.split(',').map(cl => {
										const parts = cl.substr(0, cl.length - 1).split('[')
										return bel`
											<span class=${ style.classifier }>
												${ parts[1] + ' (' + parts[0] + ')' }
											</span>
										`
									})
									return bel`
										<li>
											${ clList }
										</li>
									`
								} else {
									return bel`<li>${ def }</li>`
								}
							}) }
						</ul>
					</li>
				`
			}) }
		</ul>
	`

	const token = bel`
		<div class=${ style.token }>
			${ data.word }
			${ popupTop }
			${ popupBottom }
		</div>
	`

	return {
		token,
		popupTop,
		popupBottom
	}
}

elements.clearElement = function  (element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild)
	}
}

module.exports = elements
