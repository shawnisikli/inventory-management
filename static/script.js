// Load items when page loads
document.addEventListener('DOMContentLoaded', loadItems);

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
                        <button onclick="deleteItem(${item.id})">Delete</button>
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
            alert('Item added successfully');
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
