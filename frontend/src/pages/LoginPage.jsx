import React, { useState} from "react";

function LoginPage() {
    const [formData, setFormData] = useState ({
        email:"",
        password:"",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login successful");
                console.log(data);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            alert("Cannot connect to backend");
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="text-black bg-white rounded px-2 py-1"
            />
            <br /><br />

            <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="text-black bg-white rounded px-2 py-1" 
            />
            <br /><br />

            <button type="submit">Login</button>
        </form>
    );
}

export default LoginPage;
