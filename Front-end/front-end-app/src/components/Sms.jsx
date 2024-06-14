import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';

function Sms() {
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        const fetchDisasterData = () => {
            fetch('http://localhost:3000/sms')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setDisasters(data);
                    }
                })
                .catch(error => {
                    console.error('Error fetching disaster data:', error);
                });
        };

        // Initial fetch
        fetchDisasterData();

        // Set interval to fetch data every 5 seconds
        const intervalId = setInterval(fetchDisasterData, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="disaster-section">
            {disasters.map((disaster, index) => (
                <Card key={index} className="mb-3 disaster-card">
                    <Card.Body>
                        <Card.Title>{disaster.disasterType}</Card.Title>
                        <Card.Text>{disaster.message}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default Sms;
