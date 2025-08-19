import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuoteForm from "./components/QuoteForm";
import QuotesList from "./components/QuotesList";
import LoginPage from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/new-quote" 
          element={
            <PrivateRoute>
              <QuoteForm />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/quotes" 
          element={
            <PrivateRoute>
              <QuotesList />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/edit-quote/:quoteId" 
          element={
            <PrivateRoute>
              <QuoteForm />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
