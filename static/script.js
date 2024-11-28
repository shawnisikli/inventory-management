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
        const response = await fetch(`${BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                quantity: parseInt(quantity),
                price: parseFloat(price)
            })
        });

        console.log('Response status:', response.status);
        const contentType = response.headers.get('content-type');
        console.log('Response content type:', contentType);

        if (!response.ok) {
            let errorMessage;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error;
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                errorMessage = 'Server error occurred';
            }
            throw new Error(errorMessage || 'Failed to add item');
        }

        const data = await response.json();
        console.log('Success:', data);

        // Clear the form
        document.getElementById('itemName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';

        // Refresh the items list
        await loadItems();

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function loadItems() {
    console.log('Loading items...');
    try {
        const response = await fetch(`${BASE_URL}/items`);

        console.log('Load items response status:', response.status);
        const contentType = response.headers.get('content-type');
        console.log('Load items content type:', contentType);

        if (!response.ok) {
            let errorMessage;
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error;
            } else {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                errorMessage = 'Server error occurred';
            }
            throw new Error(errorMessage || 'Failed to load items');
        }

        const items = await response.json();
        console.log('Items loaded:', items);

        const tableBody = document.getElementById('itemsTableBody');
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

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');

    // Add click event listener to the button
    const addButton = document.getElementById('addButton');
    if (addButton) {
        addButton.addEventListener('click', addItem);
        console.log('Add button listener attached');
    } else {
        console.error('Add button not found!');
    }

    // Load initial items
    loadItems();
}); 
