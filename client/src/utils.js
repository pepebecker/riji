module.exports.generateChineseDate = function (date) {
	date = date || new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return {
		mandarin: year + '年' + month + '月' + day + '日',
		english: year + '-' + month + '-' + day
	}
}

module.exports.generateChineseWeekday = function (date) {
	date = date || new Date()
	const weekday = date.getDay()
	const days = {
		'星期天': 'Sunday',
		'星期一': 'Monday',
		'星期二': 'Tuesday',
		'星期三': 'Wednesday',
		'星期四': 'Thursday',
		'星期五': 'Friday',
		'星期六': 'Saturday'
	}
	return {
		mandarin: Object.keys(days)[weekday],
		english: Object.values(days)[weekday]
	}
}