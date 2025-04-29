import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { BASE_URL, API_PATHS } from '../utils/apiPaths';
import { UserContext } from '../context/userContext'; // For user authentication

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creditChanges, setCreditChanges] = useState({}); // Object to store credit change for each user
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}${API_PATHS.ADMIN.GET_ALL_USERS_CREDIT_SCORE}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                );

                const data = response.data;

                // Ensure we set only if array
                setUsers(Array.isArray(data.users) ? data.users : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchUsers();
        }
    }, [user]);

    const handleUpdateCredits = async (userId, creditChange) => {
        if (isNaN(creditChange) || creditChange === "") {
            alert('Please enter a valid number');
            return;
        }

        const newCredits = parseInt(creditChange);
        
        try {
            await axios.post(
                `${BASE_URL}${API_PATHS.ADMIN.UPDATE_USER_CREDITS_MANUALLY}`,
                { userId, credits: newCredits },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            alert('Credits updated successfully');
            setCreditChanges(prev => ({ ...prev, [userId]: "" })); // Clear input for that user after update
        } catch (error) {
            console.error('Error updating credits', error);
            alert('Failed to update credits');
        }
    };

    const handleCreditChangeInput = (userId, value) => {
        setCreditChanges(prev => ({
            ...prev,
            [userId]: value, // Store credit change for that specific user
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-medium">Users List</h3>
                <table className="table-auto w-full mt-4 border">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">User ID</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Credits</th>
                            <th className="px-4 py-2 border">Actions</th>
                            <th className="px-4 py-2 border">Change Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-4 py-2 border">{user._id}</td>
                                <td className="px-4 py-2 border">{user.name}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">{user.credits}</td>
                                <td className="px-4 py-2 border">
                                    <input
                                        type="number"
                                        value={creditChanges[user._id] || ""}
                                        onChange={(e) =>
                                            handleCreditChangeInput(user._id, e.target.value)
                                        }
                                        placeholder="Add/Subtract Credits"
                                        className="px-2 py-1 border rounded-md"
                                    />
                                </td>
                                <td className="px-4 py-2 border">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                                        onClick={() =>
                                            handleUpdateCredits(user._id, creditChanges[user._id])
                                        }
                                    >
                                        Update Credits
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
