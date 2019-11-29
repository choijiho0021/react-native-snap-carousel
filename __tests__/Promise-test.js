new Promise((resolve, reject) => {
	console.log('1')
	resolve('x')
})
.then(r => {
	console.log('2', r)
	return 'y'
})
.then(r => {
	console.log('3', r)
})
.then(r => {
	console.log('after catch', r)
	return new Promise((resolve, reject) => {
		console.log('another promise')
		reject()
	})
})
.catch(err => {
	console.log('err2', err)
})
