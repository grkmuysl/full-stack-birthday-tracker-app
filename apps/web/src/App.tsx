import { Button } from "@base-ui/react/button";
import "./App.css";
import { Route, Routes } from "react-router-dom";

const Login = () => <div className="p-4">Login screen </div>;
const Dashboard = () => <div className="p-4">Dashboard screen </div>;

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Test Butonu</Button>
    </div>
  );
}

export default App;
