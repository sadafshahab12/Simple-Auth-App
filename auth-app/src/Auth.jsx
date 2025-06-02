import React, {  useState } from "react";

const API_URL = "http://localhost:5000/api/auth";
const Auth = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const endPoint = isRegister ? "register" : "login";
    try {
      const response = await fetch(`${API_URL}/${endPoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Error");
        return;
      }

      if (isRegister) {
        setMessage("Registration successful! Please login.");
        setForm({ username: "", password: "" });
        setIsRegister(false);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ username: data.username })
        );
        setUser({ username: data.username });
        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage("Network error");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMessage("Logout");
    setForm({ username: "", password: "" });
  }
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome , {user.username} </h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>{isRegister ? "register" : "login"}</h2>
          <form action="" onSubmit={handleSubmit}>
            <input 
              type="text"
              name="username"
              placeholder="username"
              value={form.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              value={form.password}
              onChange={handleChange}
            />
            <button>{isRegister ? "Register" : "Login"} </button>
          </form>
          <p>{message}</p>
          <p>
            {isRegister ? "Already have an account" : "Do not have Account"}
          </p>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister ? "Login here" : "Register Here"}
          </button>
        </>
      )}
    </div>
  );
};

export default Auth;
