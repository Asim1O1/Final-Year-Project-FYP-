import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import HospitalsPage from "./pages/HospitalsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/hospitals" element={<HospitalsPage/>}></Route>
        </Routes>
         
       
      </BrowserRouter>
    </>
  );
}

export default App;
