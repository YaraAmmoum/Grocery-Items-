document.addEventListener("DOMContentLoaded", function() //when the page is loaded
{//take the values of the varaible from the grocery.html page
    const alert = document.querySelector(".alert");
    const form = document.querySelector(".form");
    const input = document.getElementById("input");
    const submit = document.querySelector(".btnAdd");
    const list = document.querySelector(".list");
    const clear = document.querySelector(".btnClear");

    let editElement;
    let editFlag = false;//the value of the item is not changed
    let editId = "";
    form.addEventListener("submit", addItem);//addEventListener(when the action will work,what the action will work(function..))
    clear.addEventListener('click', removeItems);
    window.addEventListener("DOMContentLoaded", showAll);
    function addItem(event) {//to take input from input bar 
        event.preventDefault();
        const inputValue = input.value;//assign the value of input to variabe
        const id = new Date().getTime().toString();//create id by using Date() then convert it to string

 if (inputValue && !editFlag) 
            {
            createListItem(id, inputValue);//call the createListItem() function
            showAlert(`${inputValue} added to the list`, "success");//show alert when item is addes successfully
            setDefault();
               addToLocalStorage(id, inputValue);//add the value of input to the local storage
        }
 else if (inputValue && editFlag)
     {
  editElement.innerHTML = inputValue;
            showAlert("Value edited", "success");
            updateLocalStorage(editId, inputValue);//update the edited value on local storage
            setDefault();
        } else
         {
            showAlert("Please Enter Value", "success");
        }
    }
function showAlert(text, action) //show alert about the input item if successed or failed
    {
        alert.textContent = text;
        alert.classList.add(`${action}`,"success-alert");
 setTimeout(function() {
            alert.textContent = "";
            alert.classList.remove(`${action}`,"success-alert");
        }, 1500);
    }

    function setDefault() {//return the input status to the default one
        input.value = "";
        editFlag = false;
        editId = "";
        submit.textContent = "Add Item";
    }

    function createListItem(id, inputValue) {//to add items to the list by HTML tags,setAttribute...
        const element = document.createElement("article");
        element.classList.add("groceryItems");
        element.setAttribute("data-id", id);
        element.innerHTML = `
            <div class="icons">
                <p class="comp">${inputValue}</p>
                <button type="button" class="edit">
                    <i class="editItem"><img src="edit.png"></i>
                </button>
                <button type="button" class="delete">
                    <i class="deleteItem"><img src="delete.png"></i>
                </button>
            </div>`;

        const deleteBtn = element.querySelector(".delete");//select the class name then assign it to the variable
        const editBtn = element.querySelector(".edit");

        deleteBtn.addEventListener("click", deleteItem);
        editBtn.addEventListener("click", editItem);

        list.appendChild(element);
    }

    function deleteItem(event) {//delete the item from the list and local storage
        const element = event.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
        list.removeChild(element);
        showAlert("Item removed", "success");
        removeFromLocalStorage(id);
    }function editItem(event) {//edit the item in the list and local storage
        const element = event.currentTarget.parentElement.parentElement;
        editElement = element.querySelector('.comp');
        input.value = editElement.textContent;
        editFlag = true;
        editId = element.dataset.id;
        submit.textContent = "Edit";
    }function removeItems() {//delete all items from the list by click the clear button
        const items = document.querySelectorAll(".groceryItems");
        if (items.length > 0) {
            items.forEach(function(item) {
       list.removeChild(item);
            });
        }
        localStorage.removeItem("list");
        showAlert("All items removed", "success");
    }
    function addToLocalStorage(id, inputValue) {//add items to the local storage by using push() and JSON
        const grocery = { id, inputValue };
        let items = getLocalStorage();
        items.push(grocery);
        localStorage.setItem("list", JSON.stringify(items));
    }
    function removeFromLocalStorage(id) {//remove from the local storage by filtering and JSON
        let items = getLocalStorage();
        items = items.filter(function(item) {
            return item.id !== id;
        });
        localStorage.setItem("list", JSON.stringify(items));
    }
    function updateLocalStorage(id, inputValue) {//update the edited item in the local storage by map and JSON
        let items = getLocalStorage();
        items = items.map(function(item) {
            if (item.id === id) {
                item.inputValue = inputValue;
            }
            return item;
        });
        localStorage.setItem("list", JSON.stringify(items));  }
    function getLocalStorage() {
        return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
    }
function showAll() {//show all items in the local storage, until if the page is refresh
        let items = getLocalStorage();
        if (items.length > 0) {
            items.forEach(function(item) {
                createListItem(item.id, item.inputValue);
            });
        }
    }
});