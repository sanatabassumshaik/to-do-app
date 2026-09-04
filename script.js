"use strict";

/* =========================================
   APPLICATION STATE
========================================= */

let tasks = [];

let currentFilter = "all";

const STORAGE_KEY = "todoTasks";


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm =
    document.querySelector("#task-form");

const taskInput =
    document.querySelector("#task-input");

const taskList =
    document.querySelector("#task-list");

const emptyMessage =
    document.querySelector("#empty-message");

const taskCount =
    document.querySelector("#task-count");

const filterButtons =
    document.querySelectorAll(".filter-button");

const clearCompletedButton =
    document.querySelector("#clear-completed");


/* =========================================
   SAVE TASKS TO LOCAL STORAGE
========================================= */

function saveTasks() {

    window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* =========================================
   LOAD TASKS FROM LOCAL STORAGE
========================================= */

function loadTasks() {

    const savedTasks =
        window.localStorage.getItem(
            STORAGE_KEY
        );


    if (!savedTasks) {
        return;
    }


    try {

        const parsedTasks =
            JSON.parse(savedTasks);


        if (Array.isArray(parsedTasks)) {

            tasks = parsedTasks;

        }

    } catch (error) {

        console.error(
            "Could not load tasks:",
            error
        );

        tasks = [];

    }

}


/* =========================================
   CREATE TASK
========================================= */

function createTask(taskText) {

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();

    renderTasks();

}


/* =========================================
   GET FILTERED TASKS
========================================= */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(function (task) {

            return !task.completed;

        });

    }


    if (currentFilter === "completed") {

        return tasks.filter(function (task) {

            return task.completed;

        });

    }


    return tasks;

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    filteredTasks.forEach(function (task) {

        const listItem =
            document.createElement("li");


        listItem.className =
            "task-item";


        listItem.dataset.id =
            task.id;


        if (task.completed) {

            listItem.classList.add(
                "completed"
            );

        }


        /* Checkbox */

        const checkbox =
            document.createElement("input");


        checkbox.type =
            "checkbox";


        checkbox.className =
            "task-checkbox";


        checkbox.checked =
            task.completed;


        checkbox.setAttribute(
            "aria-label",
            `Mark "${task.text}" as complete`
        );


        /* Task text */

        const taskText =
            document.createElement("span");


        taskText.className =
            "task-text";


        taskText.textContent =
            task.text;


        /* Actions */

        const actions =
            document.createElement("div");


        actions.className =
            "task-actions";


        /* Edit button */

        const editButton =
            document.createElement("button");


        editButton.type =
            "button";


        editButton.className =
            "task-action edit-button";


        editButton.dataset.action =
            "edit";


        editButton.textContent =
            "Edit";


        /* Delete button */

        const deleteButton =
            document.createElement("button");


        deleteButton.type =
            "button";


        deleteButton.className =
            "task-action delete-button";


        deleteButton.dataset.action =
            "delete";


        deleteButton.textContent =
            "Delete";


        /* Build task */

        actions.appendChild(
            editButton
        );


        actions.appendChild(
            deleteButton
        );


        listItem.appendChild(
            checkbox
        );


        listItem.appendChild(
            taskText
        );


        listItem.appendChild(
            actions
        );


        taskList.appendChild(
            listItem
        );

    });


    /* Empty message */

    emptyMessage.hidden =
        filteredTasks.length !== 0;


    /* Remaining task count */

    const remainingTasks =
        tasks.filter(function (task) {

            return !task.completed;

        }).length;


    taskCount.textContent =
        remainingTasks;

}


/* =========================================
   UPDATE TASK
========================================= */

function updateTask(taskId, newText) {

    const task =
        tasks.find(function (item) {

            return item.id === taskId;

        });


    if (!task) {
        return;
    }


    task.text =
        newText;


    saveTasks();

    renderTasks();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(taskId) {

    tasks =
        tasks.filter(function (task) {

            return task.id !== taskId;

        });


    saveTasks();

    renderTasks();

}


/* =========================================
   TOGGLE TASK COMPLETION
========================================= */

function toggleTask(taskId) {

    const task =
        tasks.find(function (item) {

            return item.id === taskId;

        });


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();

}


/* =========================================
   START EDITING TASK
========================================= */

function startEditingTask(taskItem) {

    const taskId =
        Number(taskItem.dataset.id);


    const task =
        tasks.find(function (item) {

            return item.id === taskId;

        });


    if (!task) {
        return;
    }


    taskItem.innerHTML = "";


    /* Edit input */

    const editInput =
        document.createElement("input");


    editInput.type =
        "text";


    editInput.className =
        "edit-input";


    editInput.value =
        task.text;


    editInput.setAttribute(
        "aria-label",
        "Edit task"
    );


    /* Save button */

    const saveButton =
        document.createElement("button");


    saveButton.type =
        "button";


    saveButton.className =
        "task-action edit-button";


    saveButton.dataset.action =
        "save";


    saveButton.textContent =
        "Save";


    /* Cancel button */

    const cancelButton =
        document.createElement("button");


    cancelButton.type =
        "button";


    cancelButton.className =
        "task-action delete-button";


    cancelButton.dataset.action =
        "cancel";


    cancelButton.textContent =
        "Cancel";


    /* Actions */

    const actions =
        document.createElement("div");


    actions.className =
        "task-actions";


    actions.appendChild(
        saveButton
    );


    actions.appendChild(
        cancelButton
    );


    /* Build edit interface */

    taskItem.appendChild(
        editInput
    );


    taskItem.appendChild(
        actions
    );


    editInput.focus();

    editInput.select();

}


/* =========================================
   ADD TASK FORM
========================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const taskText =
            taskInput.value.trim();


        if (taskText === "") {
            return;
        }


        createTask(taskText);


        taskInput.value = "";

        taskInput.focus();

    }
);


/* =========================================
   TASK BUTTON EVENT DELEGATION
========================================= */

taskList.addEventListener(
    "click",
    function (event) {

        const clickedButton =
            event.target.closest("button");


        if (!clickedButton) {
            return;
        }


        const taskItem =
            clickedButton.closest(
                ".task-item"
            );


        if (!taskItem) {
            return;
        }


        const taskId =
            Number(
                taskItem.dataset.id
            );


        const action =
            clickedButton.dataset.action;


        /* Edit */

        if (action === "edit") {

            startEditingTask(
                taskItem
            );

            return;
        }


        /* Delete */

        if (action === "delete") {

            deleteTask(taskId);

            return;

        }


        /* Save */

        if (action === "save") {

            const editInput =
                taskItem.querySelector(
                    ".edit-input"
                );


            const newText =
                editInput.value.trim();


            if (newText === "") {

                editInput.focus();

                return;
            }


            updateTask(
                taskId,
                newText
            );

            return;

        }


        /* Cancel */

        if (action === "cancel") {

            renderTasks();

        }

    }
);


/* =========================================
   CHECKBOX EVENT DELEGATION
========================================= */

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {
            return;
        }


        const taskItem =
            event.target.closest(
                ".task-item"
            );


        if (!taskItem) {
            return;
        }


        const taskId =
            Number(
                taskItem.dataset.id
            );


        toggleTask(taskId);

    }
);


/* =========================================
   FILTER BUTTONS
========================================= */

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentFilter =
                    button.dataset.filter;


                filterButtons.forEach(
                    function (filterButton) {

                        filterButton.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderTasks();

            }
        );

    }
);


/* =========================================
   CLEAR COMPLETED TASKS
========================================= */

clearCompletedButton.addEventListener(
    "click",
    function () {

        tasks =
            tasks.filter(function (task) {

                return !task.completed;

            });


        saveTasks();

        renderTasks();

    }
);


/* =========================================
   INITIALIZE APPLICATION
========================================= */

function initializeApp() {

    loadTasks();

    renderTasks();

    taskInput.focus();

}


initializeApp();