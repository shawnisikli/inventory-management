// Add console logs for debugging
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    loadItems();

    // Add event listener to the submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        console.log('Submit button found');
        submitButton.addEventListener('click', handleSubmit);
    } else {
        console.error('Submit button not found');
    }
});

function handleSubmit() {
    console.log('Handle Submit Called');
    if (currentlyEditing) {
        console.log('Updating existing item');
        updateItem(currentlyEditing);
    } else {
        console.log('Adding new item');
        addItem();
    }
}

function addItem() {
    console.log('Add Item Function Called');
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    console.log('Form Values:', { name, quantity, price });

    if (!name || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            quantity: parseInt(quantity),
            price: parseFloat(price)
        })
    })
        .then(response => {
            console.log('Response received:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            alert('Item added successfully');
            clearForm();
            loadItems();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding item');
        });
} 
