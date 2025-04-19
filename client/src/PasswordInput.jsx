import { useState } from 'react';

function PasswordInput({ label, value, onChange }) {
  const [showPassword, setShowPassword] = useState(false); // State to toggle show/hide

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle the state
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={showPassword ? "text" : "password"}  // Toggle between password and text
        className="form-control"
        value={value}
        onChange={onChange}  // Update password state
        placeholder="Enter your password"
      />
      <button
        type="button"
        onClick={handleToggleShowPassword}
        className="btn btn-link">
        {showPassword ? "Hide" : "Show"} Password
      </button>
    </div>
  );
}

export default PasswordInput;
