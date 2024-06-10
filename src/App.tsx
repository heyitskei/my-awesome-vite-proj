import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

type SessionInfoType = {
    id: number;
    title: string;
    topic: string;
}

function App() {
    const [rawPayload, setRawPayload] = useState<any>({});
    const [sessionDates, setSessionDates] = useState<string[]>([]);
    const [sessionInfo, setSessionInfo] = useState<SessionInfoType[][]>([]);
    const [userNotes, setUserNotes] = useState<any>({});
    const [queryDate, setQueryDate] = useState('2024-05-20');

    useEffect(() => {
        axios.get(`https://growth.vehikl.com/growth_sessions/week?date=${queryDate}`)
            .then(response => {
                setRawPayload(response.data);
                setSessionDates(Object.keys(response.data));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [queryDate]);

    useEffect(() => {
        console.log('rawpayload keys', Object.keys(rawPayload));
        console.log('session dates', Object.keys(sessionDates));
        debugger;
        if (Object.keys(rawPayload).length !== 0 && Object.keys(sessionDates).length !== 0) {
            const nonEmptyDates = sessionDates.filter(date => rawPayload[date].length !== 0);
            const info = nonEmptyDates.map(date => rawPayload[date]);
            console.log("Setting Session Info Payload", rawPayload);
            console.log("Setting Session Info Dates", sessionDates);
            setSessionInfo(info);
        }
        // console.log("Raw Payload or Session Dates Changed");
    }, [rawPayload, sessionDates]);

    console.log("Session Info", sessionInfo);
    console.log("Current Payload", rawPayload);
    console.log("Current Dates", sessionDates);

    function displaySessionInfo(sessions: SessionInfoType[][]) {
        return sessions.map(sessionArray => {
            const sessionId = sessionArray[0].id;
            const sessionNotes = userNotes[sessionId] || '';
            return (
                <div key={sessionId} className="Session">
                    <h2>Title: {sessionArray[0].title}</h2>
                    <p>Description: {sessionArray[0].topic}</p>
                    <textarea
                        onChange={(event) => handleUserNotes(event, sessionId)}
                        value={sessionNotes}
                        placeholder="Add notes..."
                    />
                </div>
            );
        });
    }

    const handleUserNotes = (event: React.ChangeEvent<HTMLTextAreaElement>, sessionId: number) => {
        const newNotes = { ...userNotes, [sessionId]: event.target.value };
        setUserNotes(newNotes);
    };

    // console.log("User Notes", userNotes);

    return (
        <div className="App">
            <h1>Growth Sessions</h1>
            <div className="SessionList">
                {displaySessionInfo(sessionInfo)}
            </div>
        </div>
    );
}

export default App
