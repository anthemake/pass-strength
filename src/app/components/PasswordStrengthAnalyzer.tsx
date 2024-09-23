"use client"; // Enables client-side rendering

import { useState } from "react";

const PasswordStrengthAnalyzer = () => {
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<string>("");

  // Function to analyze the strength of the password
  const analyzePasswordStrength = (password: string) => {
    // Minimum length of 8 characters
    if (password.length < 8) {
      setStrength("Password is too short. You aint even tryin.. Minimum length is 8 characters.");
      return;
    }

    let strengthLevel = "Weak - IT SUCKS, MAKE A BETTER ONE";
    
    // Password strength criteria
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
    );
    const mediumRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
    );

    if (strongRegex.test(password)) {
      strengthLevel = "Strong - GREAT PASSWORD, DONT FORGET IT";
    } else if (mediumRegex.test(password)) {
      strengthLevel = "Medium - Much better password, but could improve";
    }

    setStrength(strengthLevel);
  };

  // Handles user input and checks password strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;

    // Updates password state
    setPassword(userInput);

    // Analyze the password strength
    analyzePasswordStrength(userInput);
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Password Strength Analyzer</h2>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter your password"
        maxLength={64}
      />
      <p
        className={`font-semibold ${
          strength.includes("Strong") ? "text-green-600" : strength.includes("Medium") ? "text-yellow-600" : "text-red-600"
        }`}
      >
        {strength ? `Password Strength: ${strength}` : "Enter a password to check strength"}
      </p>
    </div>
  );
};

export default PasswordStrengthAnalyzer;
