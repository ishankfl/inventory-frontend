import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getAllDepartments } from "../../api/departments";
const ViewAllDepartments = () => {
    const [departments, setDepartments] = useState([])
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments();
            if (response.status == 200) {
                console.log(response.data)
                setDepartments(response.data);
            } else {
                setError("Faild to fetch data")
            }
        }
        catch (err) {
            console.log(err);
            setError('An error occured while fetching users. ')
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDepartments();
    }, [])

    const handleDelete = () => {
        navigate('/add-user');
    };
    const handleEdit = () => {
        navigate('/add-user');
    };
    return <div className="main-container-box">
        <button >+ Add New User</button>
        <div className="view-container">
            <h2>View All Departments</h2>
            {loading && <p>Loading ...</p>}
            {error && <p className="error-msg">{error}</p>}
            {!loading && !error && departments.length === 0 && <p>No users found.</p>}
            {!loading && departments.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>S.N.</th>
                            <th>Name.</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>

                    </thead>
                    <tbody>
                        {
                            departments.map((department, index) => (

                                <tr key={department.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{department.name}</td>
                                    <td>{department.description}</td>
                                    <td>
                                        <button onClick={() => handleEdit(department.id)}>Edit</button>
                                        <button onClick={() => handleDelete(department.id)} style={{ marginLeft: '10px' }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tr>

                    </tr>
                </table>
            )}
        </div>
    </div>
}
export default ViewAllDepartments;