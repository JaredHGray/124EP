// script.js: BYU IT&C 210a JavaScript
// Insert the Lab 1b JavaScript.
function on_submit(event) {
    let formData = new FormData(event.currentTarget);
    let json = JSON.stringify(Object.fromEntries(formData));
    alert(json);
    event.preventDefault();
}

// Insert the Lab 2a JavaScript.



class Instruction {
    constructor({text, defn}) {
        // HINT This method is the constructor. In C++, this would be
        // the Task() method. The curly braces inside the constructor is // a JavaScript syntax that is called 'deconstruction'. This
        // means the constructor will ask for an object
        // (`{i: 'am', an: 'object'}`) with the parameters `text`,
        // `date`, `done`, and `id`. This will make it easier to
        // convert it from the local storage database we will set up.
        this.text = text
        this.defn = defn
    }
    toHTML() {
        // TODO: Fill out this method. It should return a string version
        // of this task, including an `<li>` tag and all of the
        // css classes you used to make it look pretty. It should
        // display the `text`, `date`, and `done` property of this
        // Task. It should also have two inline event handlers, which call the
        // update and delete function, with this Task's `id` as a
        // parameter.

        return `
        <li class="task">
    <span class="task-description">${this.text}</span>
    </li>`
    }
    toHTML1() {
        // TODO: Fill out this method. It should return a string version
        // of this task, including an `<li>` tag and all of the
        // css classes you used to make it look pretty. It should
        // display the `text`, `date`, and `done` property of this
        // Task. It should also have two inline event handlers, which call the
        // update and delete function, with this Task's `id` as a
        // parameter.

        return `
        <li class="task">
    <span class="task-description">${this.defn}</span>
    </li>`
    }
}

let tasks = [];

function updateStorage(newData) {
    // ... update the local storage
    let jsonString = JSON.stringify(newData);
    localStorage.setItem('database', jsonString);
    readStorage();
}

function readStorage() {
    // ... read from the local storage
    let jsonString = localStorage.getItem('database');
    let result = JSON.parse(jsonString) || [];
    result = result.map(taskData => new Instruction(taskData));
    tasks = result;
    updateForm();
    //return result;
    readTasks();
}

function updateSortStorage(newData) {
    // ... update the local storage
    let jsonString = JSON.stringify(newData);
    localStorage.setItem('sortDatabase', jsonString);
    readSortStorage();
}

function readSortStorage() {
    // ... read from the local storage
    let jsonString = localStorage.getItem('sortDatabase');
    let result = JSON.parse(jsonString) || [];
    result = result.map(sortTaskData => new Task(sortTaskData));
    sortedTasks = result;
    updateForm();
    //return result;
}

function saveForm(event){
    let formData = new FormData(event.currentTarget);
    let formObj = Object.fromEntries(formData);
    localStorage.setItem('formData', JSON.stringify(formObj));
}

function updateForm(){
    var gotFormObj = JSON.parse(localStorage.getItem('formData'));
    document.getElementById("formText").value = gotFormObj.text;
}



function createTask(event) {
    // TODO: Pull in form data from DOM
    // TODO: Format it to JSON
    // TODO: Save it to local storage
    // Hint - Look at the JavaScript code from lab 1B to see how to extract form data

    let formData = new FormData(event.currentTarget);
    let formObj = Object.fromEntries(formData);
    event.preventDefault();
    let stringy = formObj.text;
    let valid = true;
    if(stringy.length == 16){
        for (let i = 0; i < stringy.length; i++) {
            if (stringy[i] != 0 && stringy[i] != 1){
                valid = false;
                alert('Instruction must be valid binary');
                //throw 'Instruction must be valid binary';
                
            }
        }
    }
    else {
        valid = false;
        alert('Instruction must be 16 bits');
        //throw 'Instruction must be 16 bits';
        
    }
    if (valid) {
        document.getElementById("formDefn").value = "I AM HERE";

        tasks.push(
            new Instruction ({
                text: formObj.text.replaceAll("<", '&lt;').replaceAll(">", '&gt;').replaceAll("/", "&#47").replaceAll("\"", '&#34'),
            })
        )
        updateStorage(tasks);
    }
    //check for each type of assembly instruction
    let trans = '';
    if (stringy.substr(0, 4) == '0001') { //ADD Instruction
        trans = 'ADD '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += findR(stringy.substr(7, 3)), ', ';
        if (stringy[10] == 0) {
            trans += findR(stringy.substr(13, 3));
        }
        else {
            trans += '#' , parseInt(stringy.substr(11, 15), 2);
        }
    }
    if (stringy.substr(0, 4) == '0101') { //AND Instruction
        trans = 'AND '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += findR(stringy.substr(7, 3)), ', ';
        if (stringy[10] == 0) {
            trans += findR(stringy.substr(13, 3));
        }
        else {
            trans += '#' , parseInt(stringy.substr(11, 15), 2);
        }
    }
    if (stringy.substr(0, 4) == '0000') { //Branch Instruction - how to do PCoffset
        trans = 'BR '
        if (stringy[4] == 1) {
            trans += 'n'           
        }
        if (stringy[5] == 1) {
            trans += 'z'       
        }
        if (stringy[6] == 1) {
            trans += 'p'           
        }
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '1100') { //JMP Instruction
        trans = 'JMP '
        trans += findR(stringy.substr(7, 3));
    }
    if (stringy.substr(0, 4) == '0100') { //JSR & JSRR Instruction       
        if (stringy[4] == 1) {
            trans = 'JSR '
            trans += 'PCoffset of ' , parseInt(stringy.substr(5, 15), 2);
        }
        else {
            trans = 'JSRR '
            trans += findR(stringy.substr(7, 3)), ' ';
        }
    }
    if (stringy.substr(0, 4) == '0010') { //LD Instruction
        trans = 'LD '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '1010') { //LDI Instruction
        trans = 'LDI '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '0110') { //LDR Instruction
        trans = 'LDR '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += findR(stringy.substr(7, 3)), ', ';
        trans += 'offset of ' , parseInt(stringy.substr(10, 15), 2);
    }
    if (stringy.substr(0, 4) == '1110') { //LEA Instruction
        trans = 'LEA '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '1001') { //NOT Instruction
        trans = 'NOT '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += findR(stringy.substr(7, 3));
    }
    if (stringy.substr(0, 4) == '1100') { //RET Instruction
        trans = 'RET'
    }
    if (stringy.substr(0, 4) == '1000') { //RTI Instruction
        trans = 'RTI'
    }
    if (stringy.substr(0, 4) == '0011') { //ST Instruction
        trans = 'ST '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '1011') { //STI Instruction
        trans = 'STI '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += 'PCoffset of ' , parseInt(stringy.substr(7, 15), 2);
    }
    if (stringy.substr(0, 4) == '0111') { //STR Instruction
        trans = 'STR '
        trans += findR(stringy.substr(4, 3)), ', ';
        trans += findR(stringy.substr(7, 3)), ', ';
        trans += 'offset of ' , parseInt(stringy.substr(10, 15), 2);
    }
    if (stringy.substr(0, 4) == '1111') { //TRAP Instruction
        trans = 'TRAP'
        trans += 'parseInt(stringy.substr(8, 15), 2).toString(16).toUpperCase();
    }
    if (stringy.substr(0, 4) == '1101') { //reserved Instruction
        trans = 'reserved'
    }
    //document.write('<p>I am HERE</p>');
}

function findR(str0){
    if (str0 = '000'){
        return 'R0'
    }
    if (str0 = '001'){
        return 'R1'
    }
    if (str0 = '010'){
        return 'R2'
    }
    if (str0 = '011'){
        return 'R3'
    }
    if (str0 = '100'){
        return 'R4'
    }
    if (str0 = '101'){
        return 'R5'
    }
    if (str0 = '110'){
        return 'R6'
    }
    if (str0 = '111'){
        return 'R7'
    }
}

function readTasks() {
    // TODO: Pull in tasks from local storage
    // TODO: Parse tasks using the toHTML() function
    // TODO: Update DOM accordingly
    var finalHtml = '';
    
    for (const task of tasks) {
        const html = task.toHTML();
        finalHtml = finalHtml + html;        
    } 
    var ul = document.getElementById("taskList");
    ul.innerHTML = finalHtml;
}

function clearStorage() {
    for (const task of tasks) {
        tasks.filter(task);
    }
}

function deleteInput(){
    localStorage.clear();
}
