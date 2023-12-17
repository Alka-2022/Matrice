// InterviewTable.js

import React from 'react';
import axios, { AxiosError } from 'axios';

interface InterviewTableProps {
    interviews: any[];
    userId: string; // Add userId to the interface
    onDeleteInterview: (userId: string, interviewId: string) => void;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ interviews, userId, onDeleteInterview }) => {
    const handleDelete = async (interviewId: string) => {
        try {
            // Call the onDeleteInterview function with userId and interviewId
            onDeleteInterview(userId, interviewId);
        } catch (error: any) {
            console.error((error as AxiosError).response?.data);
        }
    };

    return (
        <div>
            <h2>Interviews</h2>
            <style>
                {`
                    .interview-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    .interview-table th, .interview-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }

                    .interview-table th {
                        background-color: #f2f2f2;
                    }

                    .interview-table tbody tr:hover {
                        background-color: #f5f5f5;
                    }

                    .interview-table button {
                        background-color: #ff5252;
                        color: #fff;
                        padding: 5px 10px;
                        border: none;
                        cursor: pointer;
                    }
                `}
            </style>
            <table className="interview-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Interview Status</th>
                        <th>Interview Feedback</th>
                        <th>Rating</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {interviews.map((interview: any) => (
                        <tr key={interview._id}>
                            <td>{interview.name}</td>
                            <td>{interview.status}</td>
                            <td>{interview.feedback}</td>
                            <td>{interview.rating} star</td>
                            {/* Add a delete button for each interview */}
                            <td>
                                <button onClick={() => handleDelete(interview._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InterviewTable;
