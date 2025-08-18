import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const QuotesList = () => {
  const [quotes, setQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quotes"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // ترتيب حسب التاريخ من الأحدث إلى الأقدم
        data.sort((a, b) => new Date(b.quote_date) - new Date(a.quote_date));
        setQuotes(data);
      } catch (err) {
        console.error("Error fetching quotes:", err);
      }
    };
    fetchQuotes();
  }, []);

  // تصفية العروض حسب البحث
 const filteredQuotes = quotes.filter(q => {
  if (!search) return true; // إذا البحث فارغ، اعرض كل العروض
  if (!q.customer_name) return false; // تجاهل العروض بدون اسم
  const name = q.customer_name.toString().trim().toLowerCase();
  const query = search.toLowerCase().trim();

  // تحقق إذا الاسم يبدأ بالكلمة أو الحرف الأول
  const nameParts = name.split(" "); // تقسيم الاسم إلى كلمات
  return nameParts.some(part => part.startsWith(query));
});


  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">📂 العروض المحفوظة</h1>

      {/* البحث */}
      <input
        type="text"
        placeholder="ابحث باسم العميل..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-400"
      />

      {filteredQuotes.length === 0 ? (
        <p>لا توجد عروض مطابقة للبحث.</p>
      ) : (
        <ul className="space-y-4">
          {filteredQuotes.map(quote => (
          <li
  key={quote.id}
  className="border-l-4 border-indigo-500 bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-all duration-200"
  onClick={() => navigate(`/edit-quote/${quote.id}`)} // <--- هنا نرسل id
>
              <h2 className="font-semibold text-lg text-indigo-700">{quote.customer_name}</h2>
              <p className="text-sm text-gray-500">📅 تاريخ العرض: {quote.quote_date}</p>
              <p className="text-sm text-gray-500">رقم العرض: {quote.quote_number}</p>
              <p className="font-medium text-gray-700">💰 المجموع: {quote.total}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuotesList;
