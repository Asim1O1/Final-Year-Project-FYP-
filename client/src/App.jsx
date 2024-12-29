import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Define your routes here */}
          <Route path="/register" element={<RegisterPage/>} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
