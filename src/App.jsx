import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import QuoteForm from "./components/QuoteForm";
import QuotesList from "./components/QuotesList";
import LoginPage from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
// *** المكونات الجديدة (قد تحتاج إلى تعديل المسارات حسب هيكل مشروعك) ***
import CashInvoiceForm from "./components/CashInvoiceForm";
import CashInvoicesList from "./components/CashInvoicesList"; // 💡 تأكد من استيراد هذا المكون

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* المسار الرئيسي */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* مسارات عروض الأسعار */}
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

        {/* مسارات الفواتير النقدية الجديدة */}
        <Route
          path="/new-cash-invoice"
          element={
            <PrivateRoute>
              <CashInvoiceForm />
            </PrivateRoute>
          }
        />

        {/* مسار استعراض الفواتير النقدية */}
        <Route
          path="/cash-invoices" // 💡 المسار الجديد لعرض القائمة
          element={
            <PrivateRoute>
              <CashInvoicesList />
            </PrivateRoute>
          }
        />

        {/* مسار تعديل الفواتير النقدية */}
        <Route
          path="/edit-cash-invoice/:invoiceId" // 💡 المسار الجديد للتعديل
          element={
            <PrivateRoute>
              <CashInvoiceForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
