import React, { useState} from "react";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen bg-[#0a0f1f] text-white flex items-start justify-center px-4 pt-28 pb-12">
            <div className="w-full max-w-4xl grid md:grid-cols-[420px_1fr] gap-12 items-center" padding-top="10px">
                <form 
                    onSubmit={handleSubmit}
                    className="w-full bg-[#11182d] border border-cyan-400/20 rounded-2xl p-6 shadow-xl"
                >
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-300 mb-6">Log in to continue your MathDex journey</p>

                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full mb-4 px-4 py-2.5 rounded-lg bg-white text-black"
                    />
                    <br /><br />

                    <input 
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full mb-6 px-4 py-2.5 rounded-lg bg-white text-black" 
                    />
                    <br /><br />

                    <button 
                        type="submit"
                        className="w-full bg-cyan-400 text-black font-semibold py-2.5 rounded-lg hover:bg-cyan-300"
                        >Login</button>

                    <p className="mt-4 text-sm text-gray-300 text-center">
                        No account?{" "}
                        <Link to="/register" className="text-cyan-400 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>

                <div className="w-[480px] flex flex-col items-center justify-center text-center">
                    <img 
                        src="/images/login_image.png" 
                        alt="MathDex login animation" 
                        className="w-[400px] h-[380px] md:w-[380px] rounded-xl shadow-lg"
                    />

                    <p className="mt-4 text-gray-300 max-w-[350px]">
                        Enter the world of challenges, rewards, and leaderboard glory.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
