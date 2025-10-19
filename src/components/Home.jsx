import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-10 text-indigo-600">
        🏠 لوحة التحكم
      </h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-xl">
        {/* قسم عروض الأسعار */}
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500">
          <h2 className="text-xl font-semibold text-indigo-700 border-b pb-2 mb-2">
            عروض الأسعار
          </h2>
          <button
            onClick={() => navigate("/new-quote")}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            📝 إنشاء عرض سعر جديد
          </button>
          <button
            onClick={() => navigate("/quotes")}
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            📂 استعراض عروض الأسعار
          </button>
        </div>

        {/* قسم الفواتير النقدية الجديدة */}
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-lg border-t-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-700 border-b pb-2 mb-2">
            الفواتير النقدية
          </h2>
          <button
            onClick={() => navigate("/new-cash-invoice")}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            🧾 إنشاء فاتورة نقدية جديدة
          </button>
          <button
            onClick={() => navigate("/cash-invoices")}
            className="bg-green-100 text-green-700 hover:bg-green-200 font-bold py-3 px-6 rounded-lg shadow-md transition"
          >
            🗂️ استعراض الفواتير النقدية
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
