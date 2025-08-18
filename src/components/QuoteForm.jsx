import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import QuoteTemplate from "./QuoteTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QuoteActions from "./QuoteActions";

const QuoteForm = () => {
  const [showTax, setShowTax] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const { quoteId } = useParams();

  const [data, setData] = useState({
    company_name: "مؤسسة القوة العاشرة للمقاولات العامة",
    commercial_register: "4030202520",
    tax_number: "301252163700003",
    company_logo: "/logoa.png",
    customer_name: "",
    customer_tax_number: "",
    customer_phone: "",
    quote_number: "",
    quote_date: today, // افتراضي: تاريخ اليوم
    items: [{ description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    subtotal: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    notes: "",
    iban: "SA2710000010700000165109",
  });

  // جلب مستند موجود (مع الحفاظ على تاريخ اليوم إن لم يوجد بالمستند)
  useEffect(() => {
    if (!quoteId) return;
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, "quotes", quoteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setData((prev) => ({
            ...prev,
            ...docData,
            // إن لم يوجد تاريخ بالمستند (قديماً)، خليه على قيمة اليوم الموجودة مسبقاً
            quote_date: docData.quote_date || prev.quote_date,
          }));
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
      const quoteData = { ...data, company_logo: "/logoa.png" };
      if (quoteId) {
        await updateDoc(doc(db, "quotes", quoteId), quoteData);
        alert("✅ تم تحديث عرض السعر!");
      } else {
        await addDoc(collection(db, "quotes"), quoteData); // ← استخدم نفس الكائن
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
      items: [
        ...prev.items,
        { description: "", quantity: 1, unit_price: 0, total_price: 0 },
      ],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;

    // تأمين قيم رقمية عند الفراغ
    const q = Number(newItems[index].quantity) || 0;
    const p = Number(newItems[index].unit_price) || 0;
    newItems[index].total_price = q * p;

    const subtotal = newItems.reduce(
      (sum, item) => sum + (Number(item.total_price) || 0),
      0
    );
    const vat_amount = (subtotal * data.vat_rate) / 100;
    const total = subtotal + vat_amount;

    setData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      vat_amount,
      total,
    }));
  };

  const waitForImages = (element) => {
    const images = element.querySelectorAll("img");
    return Promise.all(
      Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else img.onload = img.onerror = resolve;
          })
      )
    );
  };

  const downloadPDF = async () => {
    await saveToFirebase();
    const element = document.getElementById("quote");

    const clone = element.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = "-10000px";
    clone.style.direction = "rtl";
    document.body.appendChild(clone);

    const colorMap = {
      "bg-blue-200": "#bfdbfe",
      "bg-gray-200": "#e5e7eb",
      "bg-gray-100": "#f3f4f6",
      "bg-white": "#ffffffff",
      "bg-indigo-500": "#6366f1",
      "bg-indigo-600": "#4f46e5",
      "bg-indigo-700": "#4338ca",
      "text-indigo-600": "#4f46e5",
      "text-white": "#ffffff",
      "text-black": "#000000",
      "text-slate-700": "#374151",
      "text-slate-50": "#f8fafc",
      "text-blue-600": "#2563eb",
    };

    clone.querySelectorAll("*").forEach((el) => {
      el.classList.forEach((cls) => {
        if (colorMap[cls]) {
          if (cls.startsWith("bg-")) el.style.backgroundColor = colorMap[cls];
          else if (cls.startsWith("text-")) el.style.color = colorMap[cls];
        }
      });

      const style = window.getComputedStyle(el);
      if (style.color.includes("oklch")) el.style.color = "#000000";
      if (style.backgroundColor.includes("oklch"))
        el.style.backgroundColor = "#ffffff";
    });

    await waitForImages(clone);

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
          value={data.customer_name}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
        />
        <input
          placeholder="الرقم الضريبي للعميل"
          name="customer_tax_number"
          value={data.customer_tax_number}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
        />
        <input
          placeholder="رقم التواصل"
          name="customer_phone"
          value={data.customer_phone}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
        />
        <input
          placeholder="رقم العرض"
          name="quote_number"
          value={data.quote_number}
          onChange={handleChange}
          className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
        />

        {/* تاريخ العرض */}
        <input
          type="date"
          name="quote_date"
          value={data.quote_date}
          onChange={handleChange} // لا حاجة لدالة ثانية
          className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* البنود */}
      <h2 className="font-semibold text-lg text-slate-700 mt-6 mb-2">📦 البيانات</h2>
      {data.items.map((item, i) => (
        <div key={i} className="flex gap-3 mb-3">
          <label className="flex flex-col">
            <span className="text-sm text-slate-600 mb-1">البيان</span>
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleItemChange(i, "description", e.target.value)}
              className="border border-slate-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600 mb-1">الكمية</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(i, "quantity", +e.target.value)} // ✅ تصحيح
              className="border border-slate-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600 mb-1">سعر الوحدة</span>
            <input
              type="number"
              value={item.unit_price}
              onChange={(e) => handleItemChange(i, "unit_price", +e.target.value)}
              className="border border-slate-300 rounded-lg p-2 w-28 focus:ring-2 focus:ring-indigo-400"
            />
          </label>
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
        value={data.notes}
        onChange={handleChange}
        className="border border-slate-300 rounded-lg p-3 mt-4 w-full focus:ring-2 focus:ring-indigo-400"
      />

      {/* الأزرار */}
      <QuoteActions
        saveToFirebase={saveToFirebase}
        downloadPDF={downloadPDF}
        showTax={showTax}
        toggleShowTax={() => setShowTax((prev) => !prev)}
      />

      {/* المعاينة */}
      <div className="mt-10">
        <QuoteTemplate data={data} showTax={showTax} />
      </div>
    </div>
  );
};

export default QuoteForm;
