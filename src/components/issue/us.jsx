// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ViewIssue from './ViewIssue';
// import { viewIssue } from '../../api/issue';

// const ViewIssuePage = () => {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchIssues = async () => {
//       try {
//         const response = await viewIssue(); // Replace with your real API endpoint
//         setIssues(response.data);
//       } catch (err) {
//         console.error('Error fetching issues:', err);
//         setError('Failed to load issues.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssues();
//   }, []);

//   if (loading) return <p>Loading issues...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Issued Product Summary</h1>
//       <ViewIssue issues={issues} />
//     </div>
//   );
// };

// export default ViewIssuePage;
