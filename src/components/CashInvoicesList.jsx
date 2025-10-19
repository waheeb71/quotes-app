import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { useNavigate, Link } from "react-router-dom";

const CashInvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /**
   * جلب جميع الفواتير من Firebase
   */
  const fetchInvoices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cashinvoices"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // فرز الفواتير حسب التاريخ، الأحدث أولاً
      data.sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));
      setInvoices(data);
    } catch (err) {
      console.error("Error fetching cash invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /**
   * حذف فاتورة من Firebase
   */
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // منع النقر من الانتقال لصفحة التعديل
    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذه الفاتورة النقدية؟");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "cashinvoices", id));
        
        setInvoices((prevInvoices) => prevInvoices.filter((i) => i.id !== id));
        alert("✅ تم حذف الفاتورة بنجاح!");
      } catch (err) {
        console.error("Error deleting cash invoice:", err);
        alert("⚠️ حدث خطأ أثناء الحذف.");
      }
    }
  };

  /**
   * فلترة الفواتير حسب البحث
   */
  const filteredInvoices = invoices.filter((i) => {
    if (!search) return true;
    if (!i.customer_name) return false;
    const name = i.customer_name.toLowerCase();
    const query = search.toLowerCase();

    return name.includes(query);
  });

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-6">
        
        <h1 className="text-2xl font-bold text-indigo-600">
          الفواتير النقدية المحفوظة
        </h1>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">العودة للصفحة الرئيسية</span>
        </Link>
      </div>

      {/* البحث */}
      <input
        type="text"
        placeholder="ابحث باسم العميل..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400"
      />

      {filteredInvoices.length === 0 ? (
        <p className="text-gray-600 text-center mt-8">لا توجد فواتير نقدية مطابقة للبحث.</p>
      ) : (
        <ul className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <li
              key={invoice.id}
              // التوجيه إلى صفحة تعديل الفاتورة النقدية
              onClick={() => navigate(`/edit-cash-invoice/${invoice.id}`)}
              className="flex justify-between items-center border-l-4 border-green-500 bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-200"
            >
              {/* بيانات الفاتورة */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-green-700">{invoice.customer_name}</h2>
                <p className="text-sm text-gray-500">
                  📅 تاريخ الفاتورة: {invoice.invoice_date}
                </p>
                <p className="text-sm text-gray-500">
                  رقم الفاتورة: {invoice.invoice_number}
                </p>
                <p className="font-medium text-gray-700">
                  💰 المجموع: {invoice.total}
                </p>
              </div>
              {/* زر الحذف */}
            <button
              onClick={(e) => handleDelete(e, invoice.id)}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CashInvoicesList;