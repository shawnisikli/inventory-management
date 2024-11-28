let currentEditId = null;
const modal = document.getElementById('editModal');
const span = document.getElementsByClassName('close')[0];

// Fetch all items
function fetchItems() {
    fetch('/items')
        .then(response => response.json())
        .then(items => {
            const itemsList = document.getElementById('itemsList');
            itemsList.innerHTML = '';
            items.forEach(item => {
                itemsList.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td class="actions">
                            <button onclick="openEditModal(${item.id}, '${item.name}', ${item.quantity}, ${item.price})" class="btn-edit">
                                <span class="material-icons">edit</span>
                            </button>
                            <button onclick="deleteItem(${item.id})" class="btn-delete">
                                <span class="material-icons">delete</span>
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}

// Add new item
document.getElementById('addItemForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('name').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value)
    };

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(() => {
            fetchItems();
            document.getElementById('addItemForm').reset();
            showNotification('Item added successfully!');
        });
});

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/items/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                fetchItems();
                showNotification('Item deleted successfully!');
            });
    }
}

// Edit item modal
function openEditModal(id, name, quantity, price) {
    currentEditId = id;
    document.getElementById('editName').value = name;
    document.getElementById('editQuantity').value = quantity;
    document.getElementById('editPrice').value = price;
    modal.style.display = 'block';
}

// Handle edit form submission
document.getElementById('editItemForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('editName').value,
        quantity: parseInt(document.getElementById('editQuantity').value),
        price: parseFloat(document.getElementById('editPrice').value)
    };

    fetch(`/items/${currentEditId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            modal.style.display = 'none';
            fetchItems();
            showNotification('Item updated successfully!');
        });
});

// Close modal when clicking (x)
span.onclick = function () {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
} 