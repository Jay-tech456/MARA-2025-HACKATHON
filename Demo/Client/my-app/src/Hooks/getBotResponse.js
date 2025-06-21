export const getBotResponse = async (message) => {
  const response = await fetch('http://127.0.0.1:5000/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "session_id": "test-session-001",
       "message": message }), 
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  console.log('Response from server:', data);
  return data.response || 'No response from server.';
};
