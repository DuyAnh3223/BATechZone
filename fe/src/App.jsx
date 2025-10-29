import {Toaster, toast} from 'sonner';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from "./pages/HomePage";





function App() {
  
  return (
    <>
    <Toaster/> 
    <button onClick={() => toast("Hello World!")}> Toaster</button>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />

      </Routes>
    
    </BrowserRouter>


    </>
  )
}

export default App
