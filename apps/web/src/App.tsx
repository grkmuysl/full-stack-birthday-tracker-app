import "./App.css";
import { Route, Routes } from "react-router-dom";

const Login = () => <div className="p-4">Login screen </div>;
const Dashboard = () => <div className="p-4">Dashboard screen </div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/login" element={<Dashboard />}></Route>
    </Routes>
  );
}

export default App;
