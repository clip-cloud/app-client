import { BrowserRouter } from 'react-router-dom';
import MainRouter from './components/routes/mainRouter';
import Navbar from './components/navbar/navbar';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/">    {/* Router with optional base path */}
        <div className='header'>
          <a className='sticky_header'
            href='https://github.com/clip-cloud'>
            Welcome to Clip Cloud! Navigate to the repository. -{'>'}
          </a>
        </div>

        <Navbar />

        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
