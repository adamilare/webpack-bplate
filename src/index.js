import './style.css';

let todos = [
  { decription: 'Double-tap to edit', completed: false, index: 0 },
  {
    decription: "Drag 'n drop to reorder your list",
    completed: false,
    index: 1,
  },
  {
    decription: 'Manage all your lists in one place',
    completed: false,
    index: 2,
  },
  { decription: 'Resync to clear out the old', completed: false, index: 3 },
];

let activeCount = todos.reduce((acc, todo) => {
  if (!todo.completed) {
    acc += 1;
  }
  return acc;
}, 0);

let lastIndex = 3;
let todoListDiv;

const createTodo = (todo) => {
  const newTodo = document.createElement('li');
  newTodo.classList.add('todo');
  newTodo.setAttribute('data-index', todo.index);
  newTodo.innerHTML = `<input type="checkbox"><textarea class="todo-description" rows="1">${todo.decription}</textarea><i class="todo-menu fa fa-ellipsis-vertical"></i>`;
  return newTodo;
};

const makeTodos = () => {
  const todoWrapper = document.getElementById('todo-main');
  const todeHeader = document.createElement('div');
  const todoInput = document.createElement('div');
  todoListDiv = document.createElement('ul');
  const todoClear = document.createElement('div');

  todeHeader.classList.add('todo-header');
  todeHeader.innerHTML = `<span>Demo</span><i id="clear-all" class="fa fa-rotate"></i></span><span id="active-count">${activeCount}</span>`;
  todoWrapper.appendChild(todeHeader);

  todoInput.classList.add('todo-input');
  todoInput.innerHTML = '<input id="add-todo" type="text" placeholder="Add to your list..."><i class="fa fa-arrow-turn-down"></i>';
  todoWrapper.appendChild(todoInput);

  todoListDiv.classList.add('todos');
  todos.forEach((todo) => {
    todoListDiv.appendChild(createTodo(todo));
  });
  todoWrapper.appendChild(todoListDiv);

  todoClear.classList.add('todo-clear');
  todoClear.innerHTML = '<span>Clear completed</span>';
  todoWrapper.appendChild(todoClear);
};

makeTodos();

function editing(e) {
  e.classList.toggle('fa-ellipsis-vertical');
  e.classList.toggle('fa-trash-can');
}

const activeCountSpan = document.getElementById('active-count');

function updateCount(countChange) {
  activeCount += countChange;

  if (activeCount <= 0) {
    activeCountSpan.hidden = true;
  } else {
    activeCountSpan.hidden = false;
    activeCountSpan.innerHTML = activeCount;
  }
}

function updateTodo(index, countChange = 0) {
  todos = todos.map((todo) => {
    if (todo.index === index) {
      todo.completed = !todo.completed;
    }
    return todo;
  });

  updateCount(countChange);
}

const refreshListeners = () => {
  document.querySelectorAll('textarea').forEach((item) => {
    item.addEventListener('focus', (e) => {
      editing(e.target.parentElement.querySelector('i'));
    });

    item.addEventListener('blur', (e) => {
      editing(e.target.parentElement.querySelector('i'));
    });

    item.addEventListener('input', (e) => {
      const textarea = e.target;
      textarea.rows = Math.ceil(textarea.scrollHeight / 20);
    });
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((item) => {
    item.addEventListener('change', (e) => {
      const parent = e.target.parentElement;
      let countChange = 0;
      if (e.target.checked) {
        parent.classList.add('completed');
        countChange = -1;
      } else {
        parent.classList.remove('completed');
        countChange = 1;
      }
      updateTodo(parent.getAttribute('data-index'), countChange);
    });
  });
};

refreshListeners();

const addNewTodo = (text) => {
  const todo = { decription: text, completed: false, index: lastIndex + 1 };
  todos.push(todo);
  lastIndex += 1;
  todoListDiv.appendChild(createTodo(todo));
  updateCount(1);
  refreshListeners();
};

document.querySelector('.todo-clear').addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  document.querySelectorAll('.completed').forEach((item) => {
    item.remove();
  });
});

document.getElementById('clear-all').addEventListener('click', () => {
  todos = [];
  document.querySelectorAll('.todo').forEach((item) => {
    item.remove();
  });
  updateCount(-activeCount);
});

document.getElementById('add-todo').addEventListener('input', (e) => {
  e.target.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && event.target.value !== '') {
      addNewTodo(event.target.value);
      event.target.value = '';
    }
  });
});
