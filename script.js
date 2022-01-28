const outputWrapper = document.querySelector('.output-wrapper');
const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');

let todos = [];

 const fetchTodos = async (url) => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        todos = data;
        listTodos();
    }
    catch {
        const todoError = document.createElement('p');
        todoError.innerText = 'Det gick tyvärr inte att hämta dina TODOs just nu...';
        todoError.classList.add('todo-error')
        outputWrapper.appendChild(todoError);
    }
 }

fetchTodos('https://jsonplaceholder.typicode.com/todos/?_limit=10');


const listTodos = () => {
    outputWrapper.innerHTML = '';
    todos.forEach(todo => {
        outputWrapper.appendChild(createTodoElement(todo))
    })
}

const createTodoElement = todo => {

    let todoOutput = document.createElement('div');
    todoOutput.classList.add('todo-output', 'flex-center');

    let checkbox = document.createElement('input')
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('id', 'checkbox')

    let title = document.createElement('p');
    title.classList.add('todo-title');
    title.innerText = todo.title;

    let btnRemove = document.createElement('button');
    btnRemove.classList.add('btn', 'btn-remove')
    btnRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';

    todoOutput.appendChild(checkbox)
    todoOutput.appendChild(title)
    todoOutput.appendChild(btnRemove)

    if(todo.completed){
        todoOutput.classList.add('done')
        checkbox.checked = true;
    }

    btnRemove.addEventListener('click', () => removeTodo(todo.id))

    checkbox.addEventListener('click', () => {
        if(checkbox.checked){
            todoOutput.classList.add('done');
            todo.completed = true;
        } else if (!checkbox.checked){
            todoOutput.classList.remove('done');
            todo.completed = false;
        }
    })

    return todoOutput;    
}


function removeTodo(id) {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
    })

    todos = todos.filter(todo => todo.id !== id)
    listTodos();
}

const createNewTodo = title => {
    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
  .then(response => response.json())
  .then(data => {
      todos.unshift(data);
      listTodos()
  })
}

todoForm.addEventListener('submit', e => {
    const errorText = document.querySelector('.error-text');
    e.preventDefault()
    if(todoInput.value.trim() !== '') {
        createNewTodo(todoInput.value);
        todoInput.value = '';
        todoInput.focus();
        errorText.classList.remove('error');
    } else {
        errorText.classList.add('error');
        todoInput.focus();
    }
})