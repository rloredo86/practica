"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for client-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    // Direct Supabase fetch for real-time stock updates
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .gt("stock", 0) // Only show items in stock
      .order("name");

    if (data) setProducts(data);
    if (error) console.error("Error fetching products:", error);
    setLoading(false);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Don't add if it exceeds stock
        if (existing.quantity >= product.stock) {
          alert(`Not enough stock for ${product.name}`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!confirm(`Confirm sale of $${total.toFixed(2)}?`)) return;

    setProcessing(true);
    try {
      const payload = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sale completed successfully! ID: " + data.saleId);
        setCart([]);
        fetchProducts(); // Refresh stock
      } else {
        alert("Error: " + data.error);
      }

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Transaction failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", padding: "2rem", fontFamily: "system-ui", height: "100vh" }}>

      {/* Product Catalog */}
      <div style={{ overflowY: "auto" }}>
        <h1>POS Terminal</h1>
        {loading ? <p>Loading products...</p> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "1rem" }}>
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  transition: "transform 0.1s"
                }}
              >
                <h3>{product.name}</h3>
                <p style={{ color: "#666" }}>{product.sku}</p>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>${product.price}</p>
                <p style={{ fontSize: "0.8rem", color: product.stock < 5 ? "red" : "green" }}>
                  Stock: {product.stock}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart & Checkout */}
      <div style={{ borderLeft: "1px solid #eee", paddingLeft: "1rem", display: "flex", flexDirection: "column" }}>
        <h2>Current Order</h2>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 ? <p style={{ color: "#999" }}>Cart is empty</p> : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {cart.map(item => (
                <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
                  <div>
                    <div>{item.name}</div>
                    <small>${item.price} x {item.quantity}</small>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}>×</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ borderTop: "2px solid #000", paddingTop: "1rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: processing ? "#ccc" : "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.2rem",
              cursor: processing ? "default" : "pointer"
            }}
          >
            {processing ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
