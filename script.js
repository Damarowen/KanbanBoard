const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

//* Item Lists
const boardLists = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

//* Items set once
let updatedOnLoad = false;

//* Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []

//* Drag Functionality
let draggeditems;
let currentColumn;


//* Get Arrays from localStorage if available, set default values if not
function getBoardList() {
  if (localStorage.getItem('backlog')) {
    console.log('Get Item TRUE RUNNING..')
    backlogListArray = JSON.parse(localStorage.backlog);
    progressListArray = JSON.parse(localStorage.progress);
    completeListArray = JSON.parse(localStorage.complete);
    onHoldListArray = JSON.parse(localStorage.onHold);
  } else {
    console.log('Get Item FALSE RUNNING..')
    backlogListArray = ['Learn React', 'Create First Project Reack'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Done First Project', 'Have knowledge on React'];
    onHoldListArray = ['Lazy'];
  }
}

//* Set localStorage Arrays
function savedBoardList() {
  listArrays = [backlogListArray, progressListArray,
    completeListArray, onHoldListArray
  ];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((arr, i) => {
    //* set to string from array
    localStorage.setItem(`${arr}`, JSON.stringify(listArrays[i]));
  })
}


//* Create DOM Elements for each list item
function createList(board, column, val, index) {

  //* List Item
  const list = document.createElement('li');
  list.className = "drag-item"
  list.textContent = val
  //* Enable Drag
  list.draggable = true;
  list.setAttribute('onDragStart', 'drag(event)')

  board.appendChild(list)

}

//* Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateBoard() {
  //* Check localStorage once
  if (!updatedOnLoad) {
    getBoardList()
  }

  // TODO: IF updateOnload true , below code will run
  // TODO : Firs set textContent to zero

  //* Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((val, i) => {
    createList(backlogList, 0, val, i)
  })


  //* Progress Column
  progressList.textContent = '';
  progressListArray.forEach((val, i) => {
    createList(progressList, 1, val, i)
  })


  //* Complete Column
  completeList.textContent = '';
  completeListArray.forEach((val, i) => {
    createList(completeList, 2, val, i)
  })


  //* On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((val, i) => {
    createList(onHoldList, 3, val, i)
  })

  //* Run savedBoardList only once, Update Local Storage
   updatedOnLoad = true
  savedBoardList();

}


//* Allow array to reflect Drag and Drop items

function rebuildArrays() {
  backlogListArray = []
  progressListArray = []
  completeListArray = []
  onHoldListArray = []
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }


  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }

  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }

  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }

  //* update
  console.log(updatedOnLoad)
  updateBoard()
}

//* Drag Function
function drag(e) {
  draggeditems = e.target
  console.log(draggeditems)

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

//*? Droping list in column

function drop(e) {
  e.preventDefault()
  //* Remove Background Color
  boardLists.forEach(x => {
    x.classList.remove('over')
  })

  //* add list to board
  const parent = boardLists[currentColumn]
  parent.append(draggeditems)

  //* call rebuild
  rebuildArrays()
}

updateBoard();