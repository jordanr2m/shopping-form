const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// We need an array to hold our state
const items = [];

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
    <input type="checkbox">
    <span class="itemName">${item.name}</span>
    <button aria-label="Remove ${item.name}">&times;</button>
    </li>`).join(''); // must use join to turn array into a string. join on nothing. aria-label attribute added for accessibility
    // console.log(html);
    list.innerHTML = html;
}

// Listen for submit event on the form
shoppingForm.addEventListener('submit', handleSubmit);
// Listen for custom event on the list (happens in handleUpdate)
list.addEventListener('itemsUpdated', displayItems);