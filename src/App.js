import { useEffect, useState } from 'react';
import { AgGridReact} from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddTodo from './components/AddTodo';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


import './App.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [todos, setTodos] = useState([]);

   // Add keys into the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setTodos(valueKeys);
  }

  useEffect (() =>{
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch("https://todolist-b7bee-default-rtdb.europe-west1.firebasedatabase.app/items/.json")
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  const addTodo = (newTodo) => {
    fetch('https://todolist-b7bee-default-rtdb.europe-west1.firebasedatabase.app/items/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(response => fetchItems()
    .catch(err => console.error(err)))
  }

  const deleteTodo = (id) => {
    fetch(`https://todolist-b7bee-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" margin='auto'>
            TodoList
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo} /> 
      <div className='ag-theme-material' style={{height: 400, width: 700, margin: 'auto'}}>
        <AgGridReact 
          rowData={todos} 
          columnDefs={[
            {sortable:'true' , filter:'true', field:'description'}, 
            {sortable:'true' , filter:'true', field:'date'},
            {sortable:'true' , filter:'true', field:'priority'},
            {field:'id', headerName: '', width: 90, 
            cellRenderer: (params) => {  
              return(
                <IconButton onClick={()=> deleteTodo(params.value)} size='small' color='error'>
                  <DeleteIcon/>
                </IconButton>
              );
                }
             }]}
            
        />
      </div>
     
    </div>
  );
}

export default App;
