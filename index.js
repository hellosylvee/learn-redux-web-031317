function createStore( reducer ){
  let state = reducer(undefined, {})
  let listeners = []
  return {
    getState: function (){
      return state
    },
    dispatch(action){
      // i want this to update our state based on the type of action that we have...
      state = reducer(state, action)
      listeners.forEach(listener => listener() )
    },
    subscribe(fn){
      listeners.push(fn)
    }
  }
}

function todosReducer(state=[{todos: [], users: []}, action){
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]
    case 'RESET_TODOS':
      return []
    case 'REMOVE_TODO':
      return state.filter(todo => todo !== action.payload )
    default:
      return state
  }
}

const store = createStore(todosReducer)
store.dispatch({type: 'ADD_TODO', payload: 'Buy Eggs'})

function renderTodos(){
  const todos = store.getState()
  const lis = todos.map( todo => `<li>${todo}</li>`)
  $('ul#todos').html(lis)
}

function renderCount(){
  $('p').html(`Count is ${store.getState().length}`)
}

renderTodos()
renderCount()
store.subscribe( renderTodos )
store.subscribe( renderCount )

$('form#add-todo').on('submit', function(event){
  event.preventDefault()
  $input = $('form#add-todo').children().first()
  store.dispatch({type: 'ADD_TODO', payload: $input.val() })
  $input.val('')
})

$('button').on('click', function(){
  store.dispatch({type: 'RESET_TODOS'})
})
