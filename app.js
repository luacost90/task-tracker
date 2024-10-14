let state = {
    todoList:[]
}

const tasksList = document.getElementById("tasks-list");


// Almacenar el estado del id en la localStarage [Check]
// Actualizar el status en localstorage [check]
// Actualizar visualmente el Tached del texto [check]

let id = 1;

const clearHTML = (nodo) =>{
    while(nodo.firstChild){
        nodo.firstChild.remove();
    }
}

const renderTasks = (data) => {

    if(!data){
        const message = document.createElement("p");
        message.textContent = "Lista de tarea vacia";
        tasksList.appendChild(message);
        return;
    }

    data.map(item =>{
        
        let {id, description, status} = item;

        const li = document.createElement("li");
        const taskGroup = document.createElement("div");
        const checkbox = document.createElement("input");
        const elementDescription = document.createElement("p");
        const btnDelete = document.createElement("button");
        const iconDelete = document.createElement("img");
        
        li.dataset.id = id;
        taskGroup.classList.add("task__group");
        checkbox.type = "checkbox";
        checkbox.checked = status;
        checkbox.id = "task-status";
        checkbox.classList.add("task__status");
        elementDescription.textContent = description;
        btnDelete.id = "btn-delete";
        iconDelete.src = "/assets/delete.svg";
        iconDelete.alt = "icon";
        iconDelete.classList.add("icon");

        checkbox.checked ? li.style.cssText = 'text-decoration: line-through;' : li.style.cssText = 'text-decoration: none;';
        checkbox.checked ? checkbox.disabled = true : checkbox.disabled = false;

        checkbox.checked ? elementDescription.style.cssText = 'color: #ccc' : elementDescription.style.cssText = 'color: #000';
   
        taskGroup.appendChild(checkbox);
        taskGroup.appendChild(elementDescription);
        btnDelete.appendChild(iconDelete);
        li.appendChild(taskGroup);
        li.appendChild(btnDelete);

        tasksList.appendChild(li);
    });

}

const registTask = (e)=> {
    e.preventDefault();

    const taskInput = document.getElementById("task-input");

    if(!taskInput.value.trim()) return;

    let lastState = JSON.parse(JSON.stringify(state));

    if(!localStorage.getItem("id")){
        localStorage.setItem("id", JSON.stringify(1));
    } 

    let idTask = JSON.parse(localStorage.getItem("id"));
    
    console.log(typeof idTask);

    lastState.todoList.push({
        id: idTask,
        description: taskInput.value,
        status: false
    });

    idTask++;

    localStorage.setItem("id", JSON.stringify(idTask));

    taskInput.value = "";
    taskInput.focus();

    state = {...lastState};

    localStorage.setItem("state", JSON.stringify(state));

    let stateLocalStorage = JSON.parse(localStorage.getItem("state"));

    clearHTML(tasksList);

    renderTasks(stateLocalStorage.todoList);
}

const updateStatusTask = (e) =>{
    if(!e.target.matches("#task-status")) return;

    const taskID = parseInt(e.target.parentElement.parentElement.dataset.id);
    const task = state.todoList.find(item => item.id === taskID);

    if(task){
        task.status = e.target.checked;
        e.target.parentElement.parentElement.style.cssText = task.status ? 'text-decoration: line-through' : 'text-decoration: none';
        
        task.status ? e.target.nextElementSibling.style.cssText = 'color: #ccc' : e.target.nextElementSibling.style.cssText = 'color: #000';

        task.status ? e.target.disabled = true : e.target.disabled = false;
        localStorage.setItem("state", JSON.stringify(state));
        console.log(state);
    }
    
}

const deleteTask = (e) =>{

    if(!e.target.matches(".icon")) return;

    const taskID = parseInt(e.target.parentElement.parentElement.dataset.id);

    const updateDeletedTasks = state.todoList.filter( item => item.id !== taskID);

    state.todoList = [...updateDeletedTasks];

    localStorage.setItem("state", JSON.stringify(state));

    let stateLocalStorage = JSON.parse(localStorage.getItem("state"));

    clearHTML(tasksList);

    renderTasks(stateLocalStorage.todoList);

}

document.addEventListener("DOMContentLoaded", () =>{
    // if(!stateTasks) return;

    if(localStorage.getItem("state")){
        let stateTasks = JSON.parse(localStorage.getItem("state"));
        state = {...stateTasks};
        renderTasks(stateTasks.todoList);
    }else{
        renderTasks(null);
    }

    
});

document.addEventListener("submit", registTask);
document.addEventListener("change", updateStatusTask);
document.addEventListener("click", deleteTask);


