// App.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import InterviewTable from './InterviewTable';

const App: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [interviewName, setInterviewName] = useState('');
    const [interviewStatus, setInterviewStatus] = useState('');
    const [interviewFeedback, setInterviewFeedback] = useState('');
    const [interviewRating, setInterviewRating] = useState<number | undefined>(undefined);
    const [interviews, setInterviews] = useState<any[]>([]);

    useEffect(() => {
        if (loggedInUser) {
            // Fetch interviews for the logged-in user
            fetchInterviews();
        }
    }, [loggedInUser]);

    const fetchInterviews = async () => {
        try {
            console.log('User ID:', loggedInUser._id);

            if (loggedInUser && loggedInUser._id) {
                const response = await axios.get(`http://localhost:5000/interviews/${loggedInUser._id}`);
                setInterviews(response.data.interviews);
            } else {
                // Handle the case where loggedInUser or loggedInUser._id is null
            }
        } catch (error: any) {
            console.error((error as AxiosError).response?.data);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, password });
            console.log(response.data);
        } catch (error: any) {
            console.error((error as AxiosError).response?.data);
        }
    };

    const handleSignin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/signin', { username, password });
            console.log(response.data);
            setLoggedInUser(response.data.user);
        } catch (error: any) {
            console.error((error as AxiosError).response?.data);
        }
    };

    const handleAddInterview = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/addInterview/${loggedInUser._id}`, {
                name: interviewName,
                status: interviewStatus,
                feedback: interviewFeedback,
                rating: interviewRating,
            });
            console.log(response.data);

            // After adding the interview, fetch the updated interviews
            await fetchInterviews(); // Wait for fetchInterviews to complete

            // Clear the input fields after adding the interview
            setInterviewName('');
            setInterviewStatus('');
            setInterviewFeedback('');
            setInterviewRating(undefined);
        } catch (error: any) {
            console.error((error as AxiosError).response?.data);
        }
    };

    if (!loggedInUser) {
        return (
            <div>
                <h1>Matrice AI Full Stack</h1>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleSignup}>Signup</button>
                <button onClick={handleSignin}>Signin</button>
            </div>
        );
    }

    return (
        <div>
            <h1>Welcome, {loggedInUser.username}!</h1>
            <div>
                <label>Interview Name:</label>
                <input type="text" value={interviewName} onChange={(e) => setInterviewName(e.target.value)} />
            </div>
            <div>
                <label>Interview Status:</label>
                <input type="text" value={interviewStatus} onChange={(e) => setInterviewStatus(e.target.value)} />
            </div>
            <div>
                <label>Interview Feedback:</label>
                <input type="text" value={interviewFeedback} onChange={(e) => setInterviewFeedback(e.target.value)} />
            </div>
            <div>
                <label>Interview Rating:</label>
                <input
                    type="number"
                    value={interviewRating || ''}
                    onChange={(e) => setInterviewRating(Number(e.target.value))}
                />
            </div>
            <button onClick={handleAddInterview}>Add Interview</button>

            {/* Display the interview details in a table */}
            <InterviewTable interviews={interviews} />
        </div>
    );
};

export default App;
