import {BrowserRouter} from 'react-router-dom';
import CustomRouter from './routes';
import Navbar from './components/common/NavBar';
import './styles/main.scss'
function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className='main-container'>
          <CustomRouter/>

      </div>

    </BrowserRouter>
  );
}

export default App;