import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    date_of_birth: "",
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
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Register successful");
      navigate("/login");
    } else {
      const text = await response.text();
      alert(text);
    }
  } catch (error) {
    alert("Cannot connect to backend");
  }
};

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white flex items-center justify-center px-4 pt-28 pb-12">
      <div className="w-full max-w-4xl grid md:grid-cols-[420px_1fr] gap-12 items-center">
        <form 
          onSubmit={handleSubmit}
          className="w-full bg-[#11182d] border border-cyan-400/20 rounded-2xl p-6 shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-300 mb-6">Join MathDex and begin your challenge journey</p>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full mb-4 px-4 py-2.5 rounded-lg bg-white text-black"
          />
          <br /><br />

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
            className="w-full mb-4 px-4 py-2.5 rounded-lg bg-white text-black"
          />
          <br /><br />

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            placeholder="Date of birth"
            className="w-full mb-6 px-4 py-2.5 rounded-lg bg-white text-black"
          />
          <br /><br />

          <button 
              type="submit"
              className="w-full bg-cyan-400 text-black font-semibold py-2.5 rounded-lg hover:bg-cyan-300"
            >
              Register
            </button>
            <p className="mt-4 text-sm text-gray-300 text-center">
              Already signed up?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Login
              </Link>
            </p>
        </form>

        <div className="w-[550px] flex flex-col items-center justify-center text-center">
          <img 
            src="/images/registration_image.png" 
            alt="MathDex register animation" 
            className="w-[500px] h-[400px] md:w-[400px] rounded-xl shadow-lg"
          />

          <p className="mt-4 text-gray-300 max-w-[350px]">
            Start collecting rewards, badges, and progress through your adventure.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;