import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { deleteDepartmentById, getAllDepartments } from "../../api/departments";
import SearchBox from "../common/SearchBox";
const ViewAllDepartments = () => {
    const [departments, setDepartments] = useState([])
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [originalDepartment, setOriginalDepartments] = useState(true);
    const navigate = useNavigate();
    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments();
            if (response.status == 200) {
                console.log(response.data)
                setDepartments(response.data);
                setOriginalDepartments(response.data);
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

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this department?');
        if (!confirmed) return;

        try {
            await deleteDepartmentById(id);
            alert('Department deleted successfully.');
            // const department = departments.
            setDepartments(departments =>
                departments.filter(dept => dept.id !== id)
            );
            // navigate('/view-departments');
        } catch (error) {
            console.error('Error deleting department:', error);
            alert('Failed to delete department.');
        }
    };
    const handleEdit = (deptId) => {
        navigate(`/edit-department/${deptId}`);
    };
    const handleAddButtonClicked = () => {
        navigate('/add-department')
    }

    const handleSearchFilter = (details) => {
        if (!details || details.trim() === '') {
            setDepartments(originalDepartment);
            return;
        }

        const lowerDetails = details.trim().toLowerCase();



        const filteredDepartments = originalDepartment.filter(item =>
            item.name.toLowerCase().includes(lowerDetails) ||
            item.description.toLowerCase().includes(lowerDetails)
        );

        setDepartments(filteredDepartments);
    };

    return <div className="main-container-box">
        <button onClick={handleAddButtonClicked} className="nav-item" >+ Add New Department</button>
        <div className="view-container">
            <div className="flex justify-between">

                <h2>View All Departments</h2>
                <SearchBox handleSearchFilter={handleSearchFilter} label={'User '} />

            </div>

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