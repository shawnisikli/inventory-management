// Global variable to track if we're editing an item
let currentlyEditing = null;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');

    // Get the button and add click event listener
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        console.log('Found submit button');
        submitButton.addEventListener('click', function (e) {
            console.log('Button clicked');
            e.preventDefault();
            handleSubmit();
        });
    } else {
        console.error('Submit button not found!');
    }

    // Load initial items
    loadItems();
});

function handleSubmit() {
    console.log('handleSubmit called');
    if (currentlyEditing) {
        updateItem(currentlyEditing);
    } else {
        addItem();
    }
}

function addItem() {
    console.log('addItem function called');

    // Get form values
    const nameInput = document.getElementById('itemName');
    const quantityInput = document.getElementById('quantity');
    const priceInput = document.getElementById('price');

    console.log('Form elements:', { nameInput, quantityInput, priceInput });

    const name = nameInput.value;
    const quantity = quantityInput.value;
    const price = priceInput.value;

    console.log('Values:', { name, quantity, price });

    if (!name || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    const data = {
        name: name,
        quantity: parseInt(quantity),
        price: parseFloat(price)
    };

    console.log('Sending data:', data);

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log('Response status:', response.status);
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
            alert('Error adding item: ' + error.message);
        });
}

// ... rest of your existing code ... 
