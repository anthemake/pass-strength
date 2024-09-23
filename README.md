# Password Strength Analyzer App

This Password Strength Analyzer is a simple web app to evaluate the strength of a given password based on several criteria. It's important do use a secure password not only for company police but your own personal policy too, so take it seriously. Made good passwords a habit so you can prevent unauthorized access. The more complex the password, the better.

# Features

**Real-Time Password Evalutation:**

Provides instant feedback on password strength, allowing users to make adjustments as they type. Color-coded strength indicator (e.g., Weak, Medium, Strong).

**Strength Criteria:**
    
- UPPERCASE LETTERS
- lowercase letters
- Numbers
- Special characters
- Minimum length requirements

# Demo

![Home](./img/Home.png)
![Your grandmas Password](./img/your-grandmas-pass.png)
![Average Password](./img/average-pass.png)
![Standard Password](./img/standard-pass.png)



# How It Works

### Password Input:

The user enters a password in real-time, and the analyzer evaluates the strength based on predefined security criteria.

### Strength Assessment:

- The strength of the password is assessed using a combination of factors including:
- Length of the password (minimum 8 characters).
- Presence of both uppercase and lowercase letters.
- Inclusion of numbers and special characters.
- Avoiding common patterns (e.g., "12345" or "password").

### Strength Indicator:

The password is assigned a rating (Weak, Medium, or Strong) based on how well it meets the criteria. A color-coded bar gives visual feedback.


### Compliant with NIST Standards:

Adheres to modern password guidelines, such as those outlined by NIST SP 800-63B (Digital Identity Guidelines), ensuring that passwords are both secure and user-friendly. This compliance is an impressive aspect for those aiming to work in environments that prioritize security standards.

https://pages.nist.gov/800-63-3/sp800-63b.html

# Technologies Used

1. **Next.js:** Framework for building high-performance, scalable web applications.
2. **TypeScript:** Ensures type safety and helps prevent common programming errors.
3. **Tailwind CSS:** For responsive design and modern UI elements.
4. **ESLint:** Enforces code quality and security best practices during development.
5. **Custom Password Strength Algorithm:** Evaluates password complexity using entropy and pattern matching.

# Installation and Setup

1. Clone the Repository:



> git clone https://github.com/your-username/password-strength-analyzer.git

2. Navigate to the Project Directory:


> cd password-strength-analyzer

3. Install Dependencies:


> npm install

4. Run the Development Server:


> npm run dev

Navigate to http://localhost:3000 in your browser to view the app.


# Security Features Overview

**Entropy Calculation for Password Strength:**

Calculates the entropy of the password (unpredictability) and uses this to assign a strength rating. This is more sophisticated than checking for the presence of character types.

**Real-Time Suggestions:**

Feedback loops guide users towards best practices, helping them create more secure passwords on the fly.

**Compliant with Modern Password Policies:**

This project demonstrates compliance with guidelines like NIST SP 800-63B.



# Future Enhancements

- Simulations

- Integration with Authentication

- Breach Detection:
