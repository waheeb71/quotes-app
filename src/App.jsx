import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuoteForm from "./components/QuoteForm";
import QuotesList from "./components/QuotesList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* مسارات أخرى */}
        <Route path="/new-quote" element={<QuoteForm />} />
        <Route path="/quotes" element={<QuotesList />} />
         <Route path="/edit-quote/:quoteId" element={<QuoteForm />} /> {/* مسار التعديل */}
      </Routes>
    </Router>
  );
}

export default App;
