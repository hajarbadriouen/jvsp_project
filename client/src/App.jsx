import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './signup'
import { BrowserRouter , Routes, Route } from 'react-router-dom' 
import Login from './login'  
function App() {
  
  return (
    <div>
     <BrowserRouter>
    
       <Routes> 
           
           <Route path='/login' element={<Login />} />
           <Route path='/register' element={<Signup />} />
       </Routes>

    

     </BrowserRouter>

    </div>
  )
}

export default App
