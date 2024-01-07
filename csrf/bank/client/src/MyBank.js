import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import LoginPage from "./pages/login/LoginPage";
import BalancePage from "./pages/balance/BalancePage";
import TransferPage from "./pages/transfer/TransferPage";

const MyBank = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={<LoginPage/>}
                />
                <Route
                    path="/login"
                    element={<LoginPage/>}
                />
                <Route
                    path="/balance"
                    element={<BalancePage/>}
                />
                <Route
                    path="/transfer"
                    element={<TransferPage/>}
                />
            </Routes>
        </Router>
    );
};

export default MyBank;
