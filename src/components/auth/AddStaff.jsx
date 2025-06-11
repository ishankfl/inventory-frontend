import React, { useState } from 'react';
import { addStaff } from '../../api/user';

const AddStaff = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || role === undefined || role === null) {
            setError('All fields are required');
            return;
        }

        const newStaff = { name, email, password, role };
        console.log('Submitting staff:', newStaff);

        try {
            const response = await addStaff(name, email, password, role);

            if (response.status === 201) {
                console.log("Staff added successfully:", response.data);
                setError('');  // Clear error message on success if you want
            } else {
                console.log("Unexpected response:", response);
                setError('Something went wrong. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log("Bad request error:", error.response.data);
                setError('Invalid data provided. Please check your input.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
                console.log("Unexpected error:", error.message);
            }
        }
    };

    return (
        <div className="container">
            <h2>Add New Staff</h2>
            <form onSubmit={handleSubmit}>
                {error && <label className="error-msg">{error}</label>}

                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} required>
                        <option value="">Select Role</option>
                        <option value="0">Admin</option>
                        <option value="1">Staff</option>
                    </select>
                </div>


                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddStaff;
