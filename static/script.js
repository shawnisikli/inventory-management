// Add debug logging
console.log('Script loaded!');

async function addItem() {
    console.log('Add item function called');

    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    console.log('Form values:', { name, quantity, price });

    if (!name || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    try {
        console.log('Sending POST request...');
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                quantity: parseInt(quantity),
                price: parseFloat(price)
            })
        });

        console.log('Response received:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add item');
        }

        const data = await response.json();
        console.log('Success:', data);

        // Clear the form
        document.getElementById('itemName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';

        // Refresh the items list
        loadItems();

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function loadItems() {
    console.log('Loading items...');
    try {
        const response = await fetch('/items');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to load items');
        }

        const items = await response.json();
        console.log('Items loaded:', items);

        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="editItem(${item.id})" class="edit-btn">✏️</button>
                    <button onclick="deleteItem(${item.id})" class="delete-btn">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading items:', error);
        alert(error.message);
    }
}

// Also add a click event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    loadItems();

    // Add click event listener to the button
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', addItem);
        console.log('Add button listener attached');
    } else {
        console.error('Add button not found!');
    }
}); 
