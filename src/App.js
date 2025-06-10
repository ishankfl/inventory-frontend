import {BrowserRouter} from 'react-router-dom';
import './styles/login.scss'
import CustomRouter from './routes';

function App() {
  return (
    <BrowserRouter>
      <CustomRouter/>
    </BrowserRouter>
  );
}

export default App;