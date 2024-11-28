// Initialize when document loads
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');
    loadItems();  // Load initial items

    // Add event listener to Add Item button
    const addButton = document.querySelector('button[type="button"]');
    if (addButton) {
        addButton.addEventListener('click', addItem);
    }
});

// Function to load items
function loadItems() {
    console.log('Loading items...');
    fetch('/items')
        .then(response => response.json())
        .then(items => {
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = ''; // Clear existing items

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button onclick="editItem(${item.id})" class="edit-btn">Edit</button>
                        <button onclick="deleteItem(${item.id})" class="delete-btn">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading items:', error);
        });
}

// Function to add item
function addItem() {
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

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
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Clear form
            document.getElementById('itemName').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('price').value = '';
            // Reload items
            loadItems();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding item');
        });
}

// Function to delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/items/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(() => {
                loadItems(); // Reload the items list
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting item');
            });
    }
}

// Function to edit item
function editItem(id) {
    // Implementation for edit functionality
    console.log('Edit item:', id);
    // Add your edit logic here
} 
