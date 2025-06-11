import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../api/category'; 
// import '../../styles/viewCategory.scss'; // Optional styling

const ViewCategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setError('Failed to fetch categories.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching categories.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-category-container">
      <h2>View All Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && categories.length === 0 && <p>No categories found.</p>}

      {!loading && categories.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>S.N.</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id || index}>
                <td>{index + 1}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCategory;
