
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import HomePage from './component/HomePage'
import Signup from './component/Signup';
import SignIn from './component/SignIn';
import Nominal from './MLA/Nominal';
import UserPage from './USER/userPage';
function App() {
  

  return (
    <>
   <Router>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/userpage" element={<UserPage />} />
    <Route path="/mlapage" element={<Nominal/>} />
    </Routes>
   </Router>
    </>
  )
}

export default App
