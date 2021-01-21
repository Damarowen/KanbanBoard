const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
//* Item Lists
const boardLists = document.querySelectorAll('.board-item-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

//* Items set once
let updatedOnLoad = false;

//* Initialize Arrays
let todoListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []

//* Drag Functionality
let draggeditems;
let currentColumn;

//* for update and delete list 
let dragging = false;


//* Get Arrays from localStorage if available, set default values if not
function getBoardList() {
  if (localStorage.getItem('todo')) {
    console.log('Get Item TRUE RUNNING..')
    todoListArray = JSON.parse(localStorage.todo);
    progressListArray = JSON.parse(localStorage.progress);
    completeListArray = JSON.parse(localStorage.complete);
    onHoldListArray = JSON.parse(localStorage.onHold);
  } else {
    console.log('Get Item FALSE RUNNING..')
    todoListArray = ['Learn React', 'Create First Project Reack'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Done First Project', 'Have knowledge on React'];
    onHoldListArray = ['Lazy'];
  }
}

//* Set localStorage Arrays
function savedBoardList() {
  listArrays = [todoListArray, progressListArray,
    completeListArray, onHoldListArray
  ];
  const arrayNames = ['todo', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arr, i) => {
    //* set to string from array
    localStorage.setItem(`${arr}`, JSON.stringify(listArrays[i]));
  })
}

//* filter Arrays to remove empty itemrs
function filterArray(arr) {
  const filterArr = arr.filter(x => x !== null);
  return filterArr;
}

//* Create DOM Elements for each list item
function createList(board, column, val, index) {

  //* List Item
  const list = document.createElement('li');
  list.classList.add('board-item');
  list.textContent = val
  list.id = index;

  //* Enable Drag
  list.draggable = true;
  list.setAttribute('onDragStart', 'drag(event)')
  list.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  list.contentEditable = true;

  board.appendChild(list)

}

//* Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateBoard() {
  //* Check localStorage once
  if (!updatedOnLoad) {
    getBoardList()
  }

  // TODO: IF updateOnload true , below code will run
  // TODO : First set textContent to zero

  //* todo Column
  todoList.textContent = '';
  todoListArray.forEach((val, i) => {
    createList(todoList, 0, val, i)
  })
  todoListArray = filterArray(todoListArray)

  //* Progress Column
  progressList.textContent = '';
  progressListArray.forEach((val, i) => {
    createList(progressList, 1, val, i)
  })
  progressListArray = filterArray(progressListArray)


  //* Complete Column
  completeList.textContent = '';
  completeListArray.forEach((val, i) => {
    createList(completeList, 2, val, i)
  })
  completeListArray = filterArray(completeListArray)


  //* On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((val, i) => {
    createList(onHoldList, 3, val, i)
  })
  onHoldListArray = filterArray(onHoldListArray)

  //* Run savedBoardList only once, Update Local Storage
  updatedOnLoad = true
  savedBoardList();

}


//* Update item - Delete Item

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  //*retrieve spesific id
  const selectedColumn = boardLists[column].children;
  //* delete
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      console.log(selectedColumn[id])
      delete selectedArray[id]
    } else {
      selectedArray[id] = selectedColumn[id].textContent
      console.log(" selectedArray " + selectedArray[id])
    }
    updateBoard()
  }

}


//* Add new list
function addNewList(column) {
  const item = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(item);
  addItems[column].textContent = '';
  updateBoard(column)
}

//* show add item input box

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}

//* hide item input box

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addNewList(column);
}

//* Allow array to reflect Drag and Drop items

function rebuildArrays() {


  // todoListArray = []
  // for (let i = 0; i < todoList.children.length; i++) {
  //   todoListArray.push(todoList.children[i].textContent)
  // }
  todoListArray = Array.from(todoList.children).map(x => x.textContent)
  console.log(todoListArray)


  // progressListArray = []

  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent)
  // }

  progressListArray = Array.from(progressList.children).map(x => x.textContent)
  console.log(progressListArray)

  // completeListArray = []

  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent)
  // }
  completeListArray = Array.from(completeList.children).map(x => x.textContent)
  console.log(completeListArray)


  // onHoldListArray = [] 

  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent)
  // }
  onHoldListArray = Array.from(onHoldList.children).map(x => x.textContent)
  console.log(onHoldListArray)


  //* update
  console.log(updatedOnLoad)
  updateBoard()
}

//* Drag Function
function drag(e) {
  draggeditems = e.target
  dragging = true;

}

//* Collumn Allow item to drop

function allowDrop(e) {

  e.preventDefault()
}


//* Drag enter column

function dragEnter(column) {
  boardLists[column].classList.add('over')
  currentColumn = column;
}

//* Droping list in column

function drop(e) {
  e.preventDefault()
  const parent = boardLists[currentColumn]

  //* Remove Background Color
  boardLists.forEach((column) => {
    column.classList.remove('over');
  });

  //* add list to board
  parent.appendChild(draggeditems)
  dragging = false;

  //* call rebuild
  rebuildArrays()
}

//* On Load

updateBoard();