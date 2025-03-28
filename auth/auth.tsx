import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown"; 
import { Route } from "./types/home"; 

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authenticate" },
    { name: "description", content: "NurseEase Admin Authentication" },
  ];
}

const LoginPage = () => {
  const [hospitals, setHospitals] = useState([]); // State to store hospital list
  const [selectedHospital, setSelectedHospital] = useState(""); // State for selected hospital
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Fetch hospitals from the backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://localhost:8000/hospitals");
        if (!response.ok) {
          throw new Error("Failed to fetch hospitals");
        }
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = {
      hospitalId: selectedHospital,
      adminId,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      alert(`Login successful! Role: ${result.role}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <label className="block mb-2">
          Select Hospital:
          <Dropdown
            hospitals={hospitals}
            onHospitalSelect={(hospital) => setSelectedHospital(hospital)}
          />
        </label>
        <br />
        <label>
          Admin ID:
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
        </label>
        <br />
        <label className="block mb-2">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />
        </label>
        <br />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
