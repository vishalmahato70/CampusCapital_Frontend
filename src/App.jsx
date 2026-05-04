import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import { AuthProvider } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import CreditCardsPage from "./pages/CreditCards";
import CreditCardDetail from "./pages/CreditCardDetail";
import CreditCardCompare from "./pages/CreditCardCompare";
import MutualFundsPage from "./pages/MutualFunds";
import MutualFundDetail from "./pages/MutualFundDetail";
import MutualFundCompare from "./pages/MutualFundCompare";
import ToolsPage from "./pages/Tools";
import SIPCalculator from "./pages/SIPCalculator";
import LearnPage from "./pages/Learn";
import MoneyTrackerPage from "./pages/MoneyTrackerPage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/credit-cards" element={<CreditCardsPage />} />
            <Route path="/credit-cards/:cardId" element={<CreditCardDetail />} />
            <Route path="/credit-cards/compare" element={<CreditCardCompare />} />
            <Route path="/mutual-funds" element={<MutualFundsPage />} />
            <Route path="/mutual-funds/:fundId" element={<MutualFundDetail />} />
            <Route path="/mutual-funds/compare" element={<MutualFundCompare />} /> 
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/sip-calculator" element={<SIPCalculator />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/money-tracker" 
              element={
                <ProtectedRoute>
                  <MoneyTrackerPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
