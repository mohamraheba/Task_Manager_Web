const Loading = '<span class="loading"></span>'
const user = JSON.parse(localStorage.getItem('user'))

const url = (user_id, task_id) =>
	`https://6576997b0fd5d07e432eb060.mockapi.io/api/v1/users${
		user_id ? '/' + user_id + '/tasks' : ''
	}${task_id ? '/' + task_id : ''}`

const logOutLink = document.querySelector('.a-sign-out')

logOutLink.addEventListener('click', () => {
	localStorage.removeItem('user')
	window.location.href = '/pages/task.html'
})

// запрос на получение всез карточек
const getCards = async () => {
	const taskContainer = document.querySelector('.tasks')
	taskContainer.innerHTML = Loading
	try {
		const response = await fetch(url(user.id))
		const tasks = await response.json()
		await new Promise(resolve => setTimeout(resolve, 400))
		return [...tasks].reverse()
	} catch (e) {
		alert(e)
	} finally {
		taskContainer.innerHTML = ''
	}
}

// запрос на корректировку задачки
const amendCard = async (e, task_id, param) => {
	let text = e.target.innerText
	e.target.innerHTML = Loading
	try {
		await fetch(url(user.id, task_id), {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(param),
		})
		await showCards()
	} catch (e) {
		alert(e)
	} finally {
		e.target.innerHTML = text
	}
}

// запрос на удаление
const deleteCard = async (e, task_id) => {
	let text = e.target.innerText
	e.target.innerHTML = Loading
	try {
		await fetch(url(user.id, task_id), {
			method: 'DELETE',
		})
		await showCards()
	} catch (e) {
		alert(e)
	} finally {
		e.target.innerHTML = text
	}
}

// фукнция для отрисовки задач
async function showCards() {
	const tasks = await getCards()
	const taskContainer = document.querySelector('.tasks')
	taskContainer.innerHTML = tasks
		.map(
			task =>
				`
  <div class="card card-${task.id}">
      <div class="card-content card-front ${task.done ? 'done' : ''}">${
					task.title
				}</div>
      <div class="card-content card-back">
        <textarea class=${
					task.done ? `card-text-${task.id} done` : `card-text-${task.id}`
				}>${task.title}</textarea>
        <button class="btn card-change">Change</button>
        <button class="btn card-done">Done</button>
        <button class="btn card-delete">Delete</button>
      </div>
    </div>
    `
		)
		.join('')

	tasks.forEach(taskItem => {
		const card = document.querySelector(`.card-${taskItem.id}`)
		const textArea = document.querySelector(`.card-text-${taskItem.id}`)
		console.log(tasks)
		card.addEventListener('click', e => {
			if (e.target.classList.contains('card-change')) {
				amendCard(e, taskItem.id, { title: textArea.value })
				return
			}
			if (e.target.classList.contains('card-done')) {
				let done = taskItem.done
				amendCard(e, taskItem.id, { done: !done })
				return
			}
			if (e.target.classList.contains('card-delete')) {
				deleteCard(e, taskItem.id)
				return
			}
		})
	})
}

showCards()

// функция для отрисовки которые прошли фильтр
const filterTasks = async tasks => {
	const taskContainer = document.querySelector('.tasks')
	taskContainer.innerHTML = tasks
		.map(
			task =>
				`
  <div class="card card-${task.id}">
      <div class="card-content card-front ${task.done ? 'done' : ''}">${
					task.title
				}</div>
      <div class="card-content card-back">
        <textarea class=${
					task.done ? `card-text-${task.id} done` : `card-text-${task.id}`
				}>${task.title}</textarea>
        <button class="btn card-change">Change</button>
        <button class="btn card-done">Done</button>
        <button class="btn card-delete">Delete</button>
      </div>
    </div>
    `
		)
		.join('')
}

const textArea = document.querySelector('.sign-in-email')
const formTasks = document.querySelector('.form-task')

// запрос для создание задачи
const handleClickAddTask = async e => {
	let text = e.target.innerText
	e.target.innerHTML = Loading
	try {
		await fetch(url(user.id), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				title: textArea.value,
				done: false,
			}),
		})
		showCards()
		textArea.value = ''
	} catch (e) {
		alert(e)
	} finally {
		e.target.innerHTML = text
	}
}

//навесил функции на кнопки
formTasks.addEventListener('click', async e => {
	const tasks = await getCards()
	const filterButtons = document.querySelectorAll('.filter')
	filterButtons.forEach(btns => {
		btns.classList.remove('active-button')
	})

	if (e.target.classList.contains('btn-add-task')) {
		//функция добавления задачи
		handleClickAddTask(e)
	}

	if (e.target.classList.contains('filter-all')) {
		//показывать все
		filterTasks(tasks)
		e.target.classList.add('active-button')
	}

	if (e.target.classList.contains('filter-active')) {
		//фильтрация по активным
		filterTasks(tasks.filter(task => !task.done))
		e.target.classList
		e.target.classList.add('active-button')
	}

	if (e.target.classList.contains('filter-done')) {
		//фильтрация по выполненым
		filterTasks(tasks.filter(task => task.done))
		e.target.classList.add('active-button')
	}
})

const filters = document.querySelectorAll('.filter')
