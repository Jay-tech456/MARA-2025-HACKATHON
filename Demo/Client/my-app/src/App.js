import logo from './logo.svg';
import './App.css';
import SocketInterface from './Components/socketInterface.jsx';
import UserInterface from './Components/userInterface.jsx';

const App = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <UserInterface />
      <SocketInterface />
    </div>
  );
};

export default App;