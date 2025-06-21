import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import '../styles/socketInterface.css'; 

const SocketInterface = () => {
  const [socketData, setSocketData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to Flask-SocketIO server
    socketRef.current = io('http://127.0.0.1:5002', {
      transports: ['websocket'], 
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('data', (data) => {
      // Extract only the necessary fields (first_name, last_name, description)
      const formattedData = data.map(item => ({
        candiate_id: item.id,
        first_name: item.first_name,
        last_name: item.last_name,
        description: item.description
      }));
      setSocketData(formattedData);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="socket-container">
      <h2>Live Candidate Feed</h2>
      <div className="socket-output">
        {socketData.length === 0 ? (
          <p>No Data Received</p>
        ) : (
          socketData.map((item, index) => (
            <div key={index} className="socket-item">
              <p><strong>Candidate ID:</strong> {item.candiate_id}</p>
              <p><strong>First Name:</strong> {item.first_name}</p>
              <p><strong>Last Name:</strong> {item.last_name}</p>
              <p><strong>Description:</strong> {item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocketInterface;
