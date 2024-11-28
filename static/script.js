function loadItems() {
    fetch('/items')
        .then(response => response.json())
        .then(items => {
            const tableBody = document.getElementById('itemsTable');
            tableBody.innerHTML = '';

            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <button onclick="editItem(${item.id}, '${item.name}', ${item.quantity}, ${item.price})" class="edit-btn">✏️</button>
                        <button onclick="deleteItem(${item.id})" class="delete-btn">🗑️</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error loading items');
        });
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/items/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert('Item deleted successfully');
                loadItems();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error deleting item');
            });
    }
}

function editItem(id, name, quantity, price) {
    // Fill the form with current values
    document.getElementById('itemName').value = name;
    document.getElementById('quantity').value = quantity;
    document.getElementById('price').value = price;

    // Change the Add Item button to Update
    const addButton = document.querySelector('button');
    addButton.textContent = 'Update Item';
    addButton.onclick = () => updateItem(id);
}

function updateItem(id) {
    const name = document.getElementById('itemName').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    if (!name || !quantity || !price) {
        alert('Please fill in all fields');
        return;
    }

    fetch(`/items/${id}`, {
        method: 'PUT',
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
            alert('Item updated successfully');
            // Reset form and button
            document.getElementById('itemName').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('price').value = '';
            const addButton = document.querySelector('button');
            addButton.textContent = 'Add Item';
            addButton.onclick = addItem;
            // Reload items
            loadItems();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating item');
        });
} 
