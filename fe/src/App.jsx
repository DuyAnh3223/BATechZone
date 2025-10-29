import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import UserRoutes from './routes/UserRoutes';

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <UserRoutes />
      </BrowserRouter>
    </>
  )
}

export default App
