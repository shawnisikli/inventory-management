from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventory.db'
db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([{'id': item.id, 'name': item.name, 'quantity': item.quantity, 'price': item.price} for item in items])

@app.route('/items', methods=['POST'])
def add_item():
    print("Received POST request to /items")
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        new_item = Item(
            name=data['name'],
            quantity=data['quantity'],
            price=data['price']
        )
        
        db.session.add(new_item)
        db.session.commit()
        
        print("Item added successfully")
        return jsonify({
            'message': 'Item added successfully',
            'item': {
                'id': new_item.id,
                'name': new_item.name,
                'quantity': new_item.quantity,
                'price': new_item.price
            }
        })
    except Exception as e:
        print(f"Error adding item: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/items/<int:id>', methods=['PUT'])
def update_item(id):
    data = request.get_json()
    item = Item.query.get(id)
    if not item:
        return jsonify({'message': 'Item not found'}), 404
    item.name = data['name']
    item.quantity = data['quantity']
    item.price = data['price']
    db.session.commit()
    return jsonify({'message': 'Item updated successfully'})

@app.route('/items/<int:id>', methods=['DELETE'])
def delete_item(id):
    item = Item.query.get(id)
    if not item:
        return jsonify({'message': 'Item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted successfully'})

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)


