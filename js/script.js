// Создаем самовызывающуюся функцию чтоб не загрязнять глобальную область видимости
(function () {
    const states = {
        0: 'task-not-ready',
        1: 'task-in-progress',
        2: 'task-ready'
    }

    // Исходные данные (должны подгружаться с бд, но это я организовать не могу пока))
    let tasks = [
        {
            name: 'Почистить зубы',
            state: 'task-not-ready'
        },
        {
            name: 'Помыть посуду',
            state: 'task-not-ready'
        },
        {
            name: 'Сделать уроки',
            state: 'task-ready'
        },
        {
            name: 'Придумать игру',
            state: 'task-in-progress'
        }

    ];

    // Функция для отрисовки новых заданий
    function renderTask(title, id, state) {
        return `
            <li class="task ${state}">
                <div class="task-left">
                    <input type="checkbox" name="" id="${id}" class="task-checkbox" ${state === 'task-ready' ? 'checked' : ''}>
                    <label for="${id}" class="task-name">${title}</label>
                </div>
                <div class="task-right">
                    <div class="edit-btn"></div>
                    <div class="delete-btn"></div>
                </div>
            </li>
        `;
    }

    // Добавить новое дело пользователя
    function addNewTask(title) {
        tasks.push({
            name: title,
            state: 'task-not-ready'
        });

        renderAllTasks();
    }

    // Изменить название задания
    function changeTaskName(id, value) {
        console.log(id, value);
        tasks[id].name = value;

        renderAllTasks();
    }

    const doList = document.querySelector('.do-list');

    //Отрисовываем изначальные задания
    function renderAllTasks () {
        doList.innerHTML = '';
        tasks.forEach((task, id) => {
            doList.innerHTML += renderTask(task.name, id, task.state);
        });
    }

    renderAllTasks();

    function deleteTask(id) {
        tasks.splice(id, 1);
        renderAllTasks();
    }

    function changeState(id, newState) {
        tasks[id].state = newState;
        renderAllTasks();
    }

    // Обработаем клики по области задач
    doList.addEventListener('click', (e) => {
        const target = e.target,
            task = target.closest('.task'),
            taskValue = task.querySelector('.task-name').textContent,
            taskChecker = task.querySelector('input[type="checkbox"]');

        // Удаляем задачу
        if (target.classList.contains('delete-btn')) {
            deleteTask(taskChecker.id);
            // Выходим, чтоб не обрабатывалось последнее условие в функции (клик по карточке для изменения состояния)
            return;
        }

        // Редактируем заметку
        if (target.classList.contains('edit-btn')) {
            editTaskForm(taskValue, taskChecker.id);
            // Выходим, чтоб не обрабатывалось последнее условие в функции (клик по карточке для изменения состояния)
            return;
        }

        // Изменяем состояние задания по клику      
        if (task) {
            if (task.classList.contains('task-ready')) {
                changeState(taskChecker.id, 'task-not-ready');
            } else if (task.classList.contains('task-in-progress')) {
                changeState(taskChecker.id, 'task-ready');
            } else {
                changeState(taskChecker.id, 'task-in-progress');
            }
            return;
        }
    });

    // Редактирование существующего дела
    function editTaskForm(value, id) {
        editForm.innerHTML = `
            <form action="#" class="edit-task-form">
                <input type="text" class="title-input" placeholder="Введите название дела" value="${value}" data-id="${id}">
                <div class="buttons">
                    <button class="ok">Изменить</button>
                    <button class="clear">Очистить</button>
                    <button class="cancel">Закрыть</button>
                </div>
            </form>
        `;
    }

    // Функция, отрисовывающая форму добавления нового задания / редактирования старого
    function renderNewTaskForm() {
        editForm.innerHTML = `
            <form action="#" class="new-task-form">
                <input type="text" class="title-input" placeholder="Введите новое дело">
                <div class="buttons">
                    <button class="ok">Добавить</button>
                    <button class="clear">Очистить</button>
                    <button class="cancel">Закрыть</button>
                </div>
            </form>
        `;
    }

    // Удаление формы нового задания
    function removeNewTaskForm() {
        editForm.innerHTML = "";
    }

    // Обрабатываем взаимодействие с областью редактирования
    const editForm = document.querySelector('.change-area'),
        addNewTaskButton = document.querySelector('.add-button');

    addNewTaskButton.addEventListener('click', () => {
        renderNewTaskForm();
    });

    // Очистка формы
    function clearInput(input) {
        input.value = "";
    }

    // Клик на кнопки внутри формы
    editForm.addEventListener('click', (e) => {
        const target = e.target,
            button = target.closest('button'),
            formContainer = target.closest('form'),
            newTaskInput = document.querySelector('.title-input');

        if (button) {
            if (button.classList.contains('ok')) {
                if (formContainer.classList.contains('new-task-form')) {
                    addNewTask(newTaskInput.value);
                    clearInput(newTaskInput);
                } else if (formContainer.classList.contains('edit-task-form')) {
                    changeTaskName(newTaskInput.getAttribute('data-id'), newTaskInput.value);
                    clearInput(newTaskInput);
                    removeNewTaskForm();
                }


            } else if (button.classList.contains('clear')) {
                clearInput(newTaskInput);
            } else if (button.classList.contains('cancel')) {
                removeNewTaskForm();
            }
        }
    });
})();