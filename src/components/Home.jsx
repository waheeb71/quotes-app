import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-10 text-indigo-600">🏠 لوحة التحكم</h1>
      
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate("/new-quote")}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition"
        >
          📝 إنشاء عرض سعر جديد
        </button>

        <button
          onClick={() => navigate("/quotes")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition"
        >
          📂 استعادة عرض سعر من قاعدة البيانات
        </button>
      </div>
    </div>
  );
};

export default Home;
