import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/view.scss';
import { viewIssue } from '../../api/issue';

const ViewIssuePage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await viewIssue();
        setIssues(response.data);
        console.log(response.data)
      } catch (err) {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <p>Loading issues...</p>;
  if (error) return <p>{error}</p>;
  if (!issues || issues.length === 0) return <p>No issues to display.</p>;

  // Get unique department names
  const departmentNames = [];
  issues.forEach(issue => {
    if (!departmentNames.includes(issue.department.name)) {
      departmentNames.push(issue.department.name);
    }
  });
  console.log(issues[0].isCompleted)
  return (
    <div className='main-container-box' style={{marginTop:'100px'}}>
      <h1>Issued Product Summary</h1>
      
      {departmentNames.map(deptName => (
        <div key={deptName} className='view-container'>
          <h3>Department: {deptName}</h3>
          
          {issues
            .filter(issue => issue.department.name === deptName)
            .map(issue => (
              <div key={issue.id}>
                <p><strong>Issued By:</strong> {issue.issuedBy.fullName} ({issue.issuedBy.email})</p>
                <p><strong>Issue Date:</strong> {new Date(issue.issueDate).toLocaleDateString()}</p>

                <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '1rem' }}>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Description</th>
                      <th>Quantity Issued</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issue.issueItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.product.description}</td>
                        <td>{item.quantityIssued}</td>
                        <td>Rs. {item.product.price.toLocaleString()}</td>
                        <td>Rs. {(item.quantityIssued * item.product.price).toLocaleString()}</td>
                        <td>{issue.isCompleted==false?"Not Completed":"Completed"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <p><strong>Total Items Issued:</strong> {issue.issueItems.length}</p>
                <p><strong>Total Amount:</strong> Rs. {
                  issue.issueItems
                    .map(item => item.quantityIssued * item.product.price)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()
                }</p>
                <hr />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ViewIssuePage;