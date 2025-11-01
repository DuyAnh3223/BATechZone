import {Toaster, toast} from 'sonner';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from "./pages/HomePage";





function App() {
  useEffect(() => {
    // Test backend connection when app starts
    const checkBackendConnection = async () => {
      const isConnected = await testConnection();
      if (isConnected) {
        toast.success('Kết nối backend thành công!');
      } else {
        toast.error('Không thể kết nối tới backend!');
      }
    };

    checkBackendConnection();
  }, []);

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

export default App;
