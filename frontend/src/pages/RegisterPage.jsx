import React, { useState } from "react";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "", 
        password: "",
        age: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form className="text-white p-10" onSubmit={handleSubmit}>
            <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="text-black rounded" 
            />
            <br /><br />

            <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="text-black rounded"
            />
            <br /><br />

            <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="text-black rounded"
            />
            <br /><br />

            <input 
                type="date" 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="text-black rounded"
            />
            <br /><br />

            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterPage;