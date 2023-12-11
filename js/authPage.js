var card = document.querySelector('.auth')
const linkUp = document.querySelector('.a-sign-up')
const linkIn = document.querySelector('.a-sign-in')
const Loading = '<span class="loading"></span>'

const url = id =>
	`https://6576997b0fd5d07e432eb060.mockapi.io/api/v1/users${
		id ? '/' + id : ''
	}`

// для переклучения между юзерами
const toggleForm = () => {
	card.classList.toggle('is-flipped')
}

linkIn.addEventListener('click', toggleForm)
linkUp.addEventListener('click', toggleForm)

const signUpEmail = document.querySelector('.sign-up-email')
const signUpPassword = document.querySelector('.sign-up-password')
const signUpSubmit = document.querySelector('.sign-up-submit')

// Функция для регистрации
const handleSubmitSignUp = async e => {
	let text = e.target.innerText
	e.target.innerHTML = Loading
	try {
		const response = await fetch(url())
		const allUsers = await response.json()
		if (
			allUsers.findIndex(
				user =>
					user.email === signUpEmail.value &&
					user.password === signUpPassword.value
			) !== -1
		) {
			alert('This user already exists')
			return
		}
		await fetch(url(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: signUpEmail.value,
				password: signUpPassword.value,
			}),
		})
		toggleForm()
	} catch (e) {
		alert(e)
	} finally {
		e.target.innerHTML = text
	}
}

signUpSubmit.addEventListener('click', handleSubmitSignUp)

const signInEmail = document.querySelector('.sign-in-email')
const signInPassword = document.querySelector('.sign-in-password')
const signInSubmit = document.querySelector('.sign-in-submit')

// Функция для логина
const handleSubmitSignIn = async e => {
	let text = e.target.innerText
	e.target.innerHTML = Loading
	try {
		const response = await fetch(url())
		const allUsers = await response.json()
		const foundUser = allUsers.find(
			user =>
				user.email === signInEmail.value &&
				user.password === signInPassword.value
		)
		if (!foundUser) return alert('User not found')
		localStorage.setItem('user', JSON.stringify(foundUser))
		window.location.href = '/pages/task.html'
		return
	} catch (e) {
		alert(e)
	} finally {
		e.target.innerHTML = text
	}
}

signInSubmit.addEventListener('click', handleSubmitSignIn)
