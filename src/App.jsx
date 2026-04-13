import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Symmetric from "./pages/Symmetric/Symmetric";
import Asymmetric from "./pages/Asymmetric/Asymmetric";
import Hashing from "./pages/Hashing/Hashing";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/symmetric" element={<Symmetric />} />
                    <Route path="/asymmetric" element={<Asymmetric />} />
                    <Route path="/hashing" element={<Hashing />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
