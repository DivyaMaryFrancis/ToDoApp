const taskInput = document.getElementById('taskInput');
const listContainer = document.getElementById('listContainer');
function addTask() {
    if(taskInput.value === ''){
        alert('You must write something!');         
    }
    else{
        let li=document.createElement("li");
        li.innerHTML = taskInput.value;
        let span=document.createElement("span");
        span.innerHTML="\u00d7";
         li.appendChild(span);
                listContainer.appendChild(li);

    }

    taskInput.value = "";
    saveList();
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveList();
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveList();
    }
}, false);

function saveList(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showList(){
    listContainer.innerHTML = localStorage.getItem("data");

}
showList();