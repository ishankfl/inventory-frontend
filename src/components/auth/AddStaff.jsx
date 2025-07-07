import React, { useState } from 'react';
import * as Yup from 'yup';
import { addStaff } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { staffSchema } from '../../utils/yup/staff-validation';

// Yup schema for validation


const AddStaff = ({ closeModal }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const newStaff = { name, email, password, role };

        try {
            await staffSchema.validate(newStaff, { abortEarly: false });

            const response = await addStaff(name, email, password, role);

            if (response.status === 201) {
                navigate('/view-users');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (validationError) {
            if (validationError.name === 'ValidationError') {
                const messages = validationError.errors.join(' ');
                setError(messages);
            } else if (validationError.response && validationError.response.status === 400) {
                setError('Invalid data provided. Please check your input.');
            } else {
                setError('An unexpected error occurred. Please try again later.');
                console.error(validationError);
            }
        }
    };

    return (
        <div className="!bg-white container">
            <h2>Add New Staff</h2>
            <form onSubmit={handleSubmit}>
                {error && <label className="error-msg" style={{ color: 'red' }}>{error}</label>}

                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="0">Admin</option>
                        <option value="1">Staff</option>
                    </select>
                </div>

                <div>
                    <button type="submit">Add</button>
                    <button type="button " className='!bg-red-600 hover:!bg-red-700' onClick={closeModal}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddStaff;
