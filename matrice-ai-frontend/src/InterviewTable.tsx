// InterviewTable.tsx
import React from 'react';

interface InterviewTableProps {
    interviews: any[];
}

const InterviewTable: React.FC<InterviewTableProps> = ({ interviews }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Interview Status</th>
                    <th>Interview Feedback</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                {interviews.map((interview: any) => (
                    <tr key={interview._id}>
                        <td>{interview.name}</td>
                        <td>{interview.status}</td>
                        <td>{interview.feedback}</td>
                        <td>{interview.rating} star</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default InterviewTable;
