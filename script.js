const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// Array to hold our state
let items = [];

// Submit event handler
function handleSubmit(e) {
    e.preventDefault();
    // pull name data out of input item
    const name = e.currentTarget.item.value;
    if (!name) return; // prevents empty items from being added to list
    // store the data for each item in an object
    const item = {
        name,
        id: Date.now(),
        complete: false, // items are not complete by default
    };
    //push the items into our state
    items.push(item);
    console.log(`There are now ${items.length} items in your state.`);
    // clear the form
    e.target.reset();

    // fire off a custom event that will tell anyone else who cares that the items have been updated
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// Display items in the list
function displayItems() {
    console.log(items);
    // Take our items, loop over each & return a list item for each. Good use case for map
    const html = items.map(item => `<li class="shopping-item">
    <input 
        value="${item.id}" 
        type="checkbox"
        ${item.complete ? 'checked' : ''}
    >
    <span class="itemName">${item.name}</span>
    <button 
        aria-label="Remove ${item.name}"
        value="${item.id}"
    >&times;</button>
    </li>`).join(''); // must use join to turn array into a string. join on nothing. aria-label attribute added for accessibility
    // console.log(html);
    list.innerHTML = html;
}

// Function to mirror list items to local storage
function mirrorToLocalStorage() {
    console.info('Saving items to local storage');
    // Must convert the object to a string when put in local storage
    localStorage.setItem('items', JSON.stringify(items));
}

// Function to restore from local storage - run on pageload
function restoreFromLocalStorage() {
    console.info('Restoring from local storage');
    // pull the items from local storage. Use parse to turn back into an object
    const lsItems = JSON.parse(localStorage.getItem('items'));
    // check that there is something in local storage
    if (lsItems.length) {
        // dump list items into items variable
        // lsItems.forEach(item => items.push(item)); OR:
        items.push(...lsItems); // spread each array item as an argument to push

        // Dispatch custom event
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id) {
    console.log("DELETING ITEM", id);
    // update our items array without this one. Filter for every item that is not the one we are deleting
    items = items.filter(item => item.id !== id);
    // If the id is not equal to the one that got passed in, then keep it 
    console.log(items);
    // Update the list with new items & update local storage, respectively (order specified by event listeners)
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
};

function markAsComplete(id) {
    console.log("Marking as complete", id);
    // Need to find the reference to the item we want
    const itemRef = items.find(item => item.id === id);
    // console.log(itemRef);
    itemRef.complete = !itemRef.complete; // set it to the opposite of itself
    // Update check status in items list & local storage
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// Listen for submit event on the form
shoppingForm.addEventListener('submit', handleSubmit);
// Listen for custom event on the list (happens in handleUpdate)
list.addEventListener('itemsUpdated', displayItems);
// Mirror to local storage
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
// Event delegation: listen for click on list ul, but then delegate the click over to the button if that is what was clicked
list.addEventListener('click', function(e) {
    // console.log(e.target, e.currentTarget); // returns item we clicked on and the ul, respectively
    const id = parseInt(e.target.value);
    if(e.target.matches('button')) {
        // matches checks if an element matches a css selector
        deleteItem(id); // grab value, which equals button ID. Wrap in parseInt to convert from a string to a number for comparison
    }
    // listen for checkbox click
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
});

// run on pageload
restoreFromLocalStorage();