import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './signup'
import { BrowserRouter , Routes, Route } from 'react-router-dom' 
import Login from './login'  
import StudentDashboard from "./pages/StudentDashboard";  
import TeacherDashboard from "./pages/TeacherDashboard";
import ProtectedRoute from './ProtectedRoute';

function App() {
  
  return (
    <div>
     <BrowserRouter>
    
       <Routes> 
           
          
           <Route path='/login' element={<Login />} />
           <Route path='/register' element={<Signup />} />
           <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
           <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
       </Routes>

    

     </BrowserRouter>

    </div>
  )
}

export default App
