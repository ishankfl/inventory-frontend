import Login from "./components/auth/Login"
import {Route, Routes} from 'react-router-dom';

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
}

export default CustomRouter;