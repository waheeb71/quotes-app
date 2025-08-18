import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom"; // <--- لإحضار id من الرابط
import QuoteTemplate from "./QuoteTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QuoteActions from "./QuoteActions"; 

const QuoteForm = () => {
    const { quoteId } = useParams(); // إذا تم تمرير id للعرض
  const [data, setData] = useState({
    company_name: "مؤسسة القوة العاشرة للمقاولات العامة",
    commercial_register: "4030202520",
    tax_number: "301252163700003",
    company_logo: "./logoa.png",
    customer_name: "",
    customer_tax_number: "",
    customer_phone: "",
    quote_number: "",
    quote_date: "",
    items: [{ description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    notes: "",
    iban: "SA2710000010700000165109"
    
  });

useEffect(() => {
    if (!quoteId) return;

    const fetchQuote = async () => {
      try {
        const docRef = doc(db, "quotes", quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          alert("❌ هذا العرض غير موجود");
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
      }
    };
    fetchQuote();
  }, [quoteId]);

 
  const saveToFirebase = async () => {
    try {
      if (quoteId) {
        // تحديث
        const docRef = doc(db, "quotes", quoteId);
        await updateDoc(docRef, data);
        alert("✅ تم تحديث عرض السعر!");
      } else {
        // حفظ جديد
        await addDoc(collection(db, "quotes"), data);
        alert("✅ تم حفظ عرض السعر!");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ خطأ في الحفظ");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };


  const addItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    newItems[index].total_price = newItems[index].quantity * newItems[index].unit_price;
    const subtotal = newItems.reduce((sum, item) => sum + item.total_price, 0);
    const vat_amount = (subtotal * data.vat_rate) / 100;
    const total = subtotal + vat_amount;
    setData((prev) => ({ ...prev, items: newItems, subtotal, vat_amount, total }));
  };

 


const downloadPDF = async () => {
  await saveToFirebase();
  const element = document.getElementById("quote");

  // عمل نسخة مؤقتة
  const clone = element.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.top = "-10000px";
  clone.style.direction = "rtl"; 
  document.body.appendChild(clone);

  // خريطة ألوان Tailwind → ألوان صلبة
  const colorMap = {
    "bg-blue-200": "#bfdbfe",
    "bg-gray-200": "#e5e7eb",
    "bg-gray-100": "#f3f4f6",
    "bg-white": "#ffffff",
    "bg-indigo-500": "#6366f1",
    "bg-indigo-600": "#4f46e5",
    "bg-indigo-700": "#4338ca",
    "text-indigo-600": "#4f46e5",
    "text-white": "#ffffff",
    "text-black": "#000000",
    "text-slate-700": "#374151",
    "text-slate-50": "#f8fafc",
    "text-blue-600": "#2563eb",
    // أضف أي ألوان أخرى تستخدمها في العرض
  };

  // استبدال ألوان Tailwind بألوان صلبة
  clone.querySelectorAll("*").forEach(el => {
    el.classList.forEach(cls => {
      if (colorMap[cls]) {
        if (cls.startsWith("bg-")) el.style.backgroundColor = colorMap[cls];
        else if (cls.startsWith("text-")) el.style.color = colorMap[cls];
      }
    });

   
    const style = window.getComputedStyle(el);
    if (style.color.includes("oklch")) el.style.color = "#000000";
    if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#ffffff";
  });

  // الانتظار لتحميل كل الصور
  const waitForImages = (element) => {
    const images = element.querySelectorAll("img");
    return Promise.all(
      Array.from(images).map(
        img =>
          new Promise(resolve => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );
  };

  await waitForImages(clone);

  // إنشاء canvas وتحويله إلى PDF
  const canvas = await html2canvas(clone, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`quote-${Date.now()}.pdf`);

  document.body.removeChild(clone);
};


  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-indigo-600">📝 إنشاء عرض سعر</h1>

      {/* بيانات العميل */}
   <div className="space-y-3">
  <input
    placeholder="اسم العميل"
    name="customer_name"
    value={data.customer_name}  // <--- ربط القيمة مع state
    onChange={handleChange}
    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    placeholder="الرقم الضريبي للعميل"
    name="customer_tax_number"
    value={data.customer_tax_number}  // <--- ربط القيمة مع state
    onChange={handleChange}
    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    placeholder="رقم التواصل"
    name="customer_phone"
    value={data.customer_phone}  // <--- ربط القيمة مع state
    onChange={handleChange}
    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    placeholder="رقم العرض"
    name="quote_number"
    value={data.quote_number}  // <--- ربط القيمة مع state
    onChange={handleChange}
    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
  />
  <input
    type="date"
    name="quote_date"
    value={data.quote_date}  // <--- ربط القيمة مع state
    onChange={handleChange}
    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
  />
</div>


      {/* البنود */}
      <h2 className="font-semibold text-lg text-slate-700 mt-6 mb-2">📦 البيانات</h2>
      {data.items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-3">
          <input
            placeholder="البيان"
            value={item.description}
            onChange={(e) => handleItemChange(i, "description", e.target.value)}
            className="border border-slate-300 rounded-lg p-2 flex-1 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="الكمية"
            value={item.quantity}
            onChange={(e) => handleItemChange(i, "quantity", +e.target.value)}
            className="border border-slate-300 rounded-lg p-2 w-24 focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            placeholder="سعر الوحدة"
            value={item.unit_price}
            onChange={(e) => handleItemChange(i, "unit_price", +e.target.value)}
            className="border border-slate-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      ))}
      <button
        onClick={addItem}
        className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition"
      >
        ➕ إضافة بند
      </button>

      {/* ملاحظات */}
     <textarea
  placeholder="ملاحظات"
  name="notes"
  value={data.notes}  // <--- ربط القيمة مع state
  onChange={handleChange}
  className="border border-slate-300 rounded-lg p-3 mt-4 w-full focus:ring-2 focus:ring-indigo-400"
/>


      {/* الأزرار */}
     {/* الأزرار مع spinner */}
<QuoteActions
  saveToFirebase={saveToFirebase}
  downloadPDF={downloadPDF}
/>


      {/* المعاينة */}
      <div className="mt-10">
        <QuoteTemplate data={data} />
      </div>
    </div>
  );
};

export default QuoteForm;
