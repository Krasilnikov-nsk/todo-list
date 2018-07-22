var addButton = document.getElementById('add'); //переменные элементов разметки
var inputTask = document.getElementById('new-task');
var tasks = document.getElementById('tasks');
var finish = document.getElementById('finish');

function createNewElement(task, finished) { //метод для создания элемента списка
	var listItem = document.createElement('li'); //элемент li в списке
	var checkbox = document.createElement('button'); //кнопка checkbox с иконкой, далее по списку

	if(finished){
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box</i>";
    }else {
        checkbox.className = "material-icons checkbox";
        checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";
    }

	
	var label = document.createElement('label');
	label.innerText = task; // передаем параметр строка
	var input = document.createElement('input');
	input.type = "text"; 
	var deleteButton = document.createElement('button');
	deleteButton.className = "material-icons delete" ;
	deleteButton.innerHTML = "<i class='material-icons'>delete</i>";
	var editButton = document.createElement('button');
	editButton.className = "material-icons edit" ;
	editButton.innerHTML = "<i class='material-icons'>edit</i>";
	//добавляем элементы в список li 
	listItem.appendChild(checkbox);
	listItem.appendChild(label);
	listItem.appendChild(input);
	listItem.appendChild(deleteButton);
	listItem.appendChild(editButton);

	return listItem;
}

function addTask() { // метод для работы кнопки "Добавить"
	if(inputTask.value) {
		var listItem = createNewElement(inputTask.value, false);
		tasks.appendChild(listItem);
		bindTaskEvents(listItem, finishTask)
		inputTask.value = "";
	}
	save(); // элемент сохранения данных
}

addButton.onclick = addTask;//прикрепляем метод к кнопке "Добавить"

function deleteTask() { // метод для кнопки удаления дел
	var listItem = this.parentNode;
	var ul = listItem.parentNode;
	ul.removeChild(listItem);
	save();
}

function editTask() { // метод для кнопки редактирования дел
	var editButton = this;
	var listItem = this.parentNode;
	var label = listItem.querySelector('label');
	var input = listItem.querySelector('input[type = text]');

	var containsClass = listItem.classList.contains('editMode');

    if (containsClass) {
        label.innerText = input.value;
        editButton.className = "material-icons edit";
        editButton.innerHTML = "<i class='material-icons'>edit</i>";
        save();
    } else {
        input.value = label.innerText;
        editButton.className = "material-icons save";
        editButton.innerHTML = "<i class='material-icons'>save</i>";

    }
    listItem.classList.toggle('editMode'); // метод для переключения класса
}

function finishTask() { // метод для кнопки check_box в списке дел завершения
	var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box</i>";

    finish.appendChild(listItem);
    bindTaskEvents(listItem, tasksTask);
    save();
}

function tasksTask() { // метод для кнопки check_box в завершенных
	var listItem = this.parentNode;
    var checkbox = listItem.querySelector('button.checkbox');
    checkbox.className = "material-icons checkbox";
    checkbox.innerHTML = "<i class='material-icons'>check_box_outline_blank</i>";

    tasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
    save();

}

function bindTaskEvents(listItem, checkboxEvent) { // привязка методов к новым элементам
 	var checkbox = listItem.querySelector('button.checkbox');
 	var editButton = listItem.querySelector('button.edit');
 	var deleteButton = listItem.querySelector('button.delete');

 	checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
}

function save() { // метод для сохранения данных

    var tasksTasksArr = [];
    for (var i = 0; i < tasks.children.length; i++) {
        tasksTasksArr.push(tasks.children[i].getElementsByTagName('label')[0].innerText);
    }

    var finishTasksArr = [];
    for (var i = 0; i < finish.children.length; i++) {
        finishTasksArr.push(finish.children[i].getElementsByTagName('label')[0].innerText);
    }


	localStorage.removeItem('todo'); // преобразования в строку для хранения объекта
    localStorage.setItem('todo', JSON.stringify({
        tasks: tasksTasksArr,
        finish: finishTasksArr
    }));

}

function load(){ // метод выполняющий загрузку из локальных хранилищ, обратное преобразование из строки
    return JSON.parse(localStorage.getItem('todo')); 
}
var data = load(); // возвращение данных из загрузки

for(var i = 0; i < data.tasks.length;i++){
    var listItem = createNewElement(data.tasks[i], false);
    tasks.appendChild(listItem);
    bindTaskEvents(listItem, finishTask);
}

for(var i = 0; i < data.finish.length; i++){
    var listItem = createNewElement(data.finish[i], true);
    finish.appendChild(listItem);
    bindTaskEvents(listItem, tasksTask);
}