import { BrowserRouter } from 'react-router-dom';
import MainRouter from './components/routes/mainRouter';
import Navbar from './components/navbar/navbar';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">    {/* Router with optional base path */}


        <Navbar />

        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
