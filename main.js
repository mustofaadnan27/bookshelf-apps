const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addData();
    })
    if (isStorageExist()) {
        loadDataFromStorage();
      }
});

function addData() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, title, author, year, isCompleted)
    
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateTodoObject(id, title, author, year, isCompleted) {
    const yearInt = parseInt(year)
    return {
        id, title, author, year:yearInt, isCompleted
    }
}
document.addEventListener(RENDER_EVENT, function () {
    console.log(todos);
  });


  function makeTodo(todoObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = todoObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis : ' + todoObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun : ' + todoObject.year;

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear);

    const action = document.createElement('div');
    action.classList.add('action');

    if(todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum Selesai Dibaca';

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(todoObject.id);
        })

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        })
        action.append(undoButton, trashButton)
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai Dibaca';

        checkButton.addEventListener('click', function() {
            addTaskToCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';


        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        })
        action.append(checkButton, trashButton);
    }
    article.append(action);
    return article;
  }

  document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completeBookshelfList');
    completedTODOList.innerHTML = '';

    for(const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if(!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
        } else {
            completedTODOList.append(todoElement);
        }
    }
  });

  function findTodo(todoId) {
    for(const todoItem of todos) {
        if(todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
  }
  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
   
    return -1;
  }

function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if(todoTarget == null) return;
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
   
    if (todoTarget === -1) return;
   
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitFormSearch = document.getElementById('searchBook');
    submitFormSearch.addEventListener('submit', function(event) {

        event.preventDefault();
        searchResult();
    })
});

function searchResult() {
    const search = document.getElementById('searchBookTitle').value;
    const searchKapital = search.toUpperCase();
    const uncompletedTODOList = document.getElementById('incompleteBookshelfList');
    const completedTODOList = document.getElementById('completeBookshelfList');

    uncompletedTODOList.innerHTML = '';
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const title = todoItem.title.toUpperCase();
        const todoElement = makeTodo(todoItem);

        const check = title.includes(searchKapital);

        if (check) {
            if (todoItem.isCompleted) {
                completedTODOList.appendChild(todoElement);
            } else {
                uncompletedTODOList.appendChild(todoElement);
            }
        }
    }
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_BOOKSHELF';

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

 
    function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
    }

    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(STORAGE_KEY));
        alert("Data telah disimpan");

    });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }