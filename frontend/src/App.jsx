import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Get food items from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/foods")
      .then((response) => response.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // Add food to cart
  const addToCart = (food) => {
    const existingItem = cart.find((item) => item._id === food._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Place order
  const placeOrder = async () => {
    if (!name || !phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const orderData = {
      customerName: name,
      customerPhone: phone,
      items: cart.map((item) => ({
        foodItem: item._id,
        quantity: item.quantity,
      })),
      totalAmount: total,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order placed successfully! 🎉");
        setCart([]);
        setName("");
        setPhone("");
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error(error);
      alert("Server error.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🍔 Foodie Hub</h1>
        <p>Delicious food delivered to you</p>
      </header>

      <main>
        <section className="food-section">
          <h2>🍕 Our Menu</h2>

          <div className="food-grid">
            {foods.map((food) => (
              <div className="food-card" key={food._id}>
                <img src={food.image} alt={food.name} />

                <h3>{food.name}</h3>

                <p className="category">{food.category}</p>

                <p>{food.description}</p>

                <h3>₹{food.price}</h3>

                <button onClick={() => addToCart(food)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="cart-section">
          <h2>🛒 Your Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>₹{item.price} × {item.quantity}</p>
                  </div>

                  <div className="quantity">
                    <button onClick={() => decreaseQuantity(item._id)}>
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQuantity(item._id)}>
                      +
                    </button>
                  </div>

                  <button
                    className="remove"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <h2>Total: ₹{total}</h2>

              <div className="customer-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <button onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;