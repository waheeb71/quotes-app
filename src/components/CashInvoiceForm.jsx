import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, addDoc, runTransaction } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import CashInvoiceTemplate from "./CashInvoiceTemplate";
import CashInvoiceActions from "./QuoteActions"; // يُفترض أن هذا يحتوي على الأزرار المناسبة
const getNextInvoiceNumber = async (db) => {
    // مرجع لمستند العداد المنفصل (يجب إنشاؤه في Firestore: metadata/invoiceCounter)
    const counterRef = doc(db, "metadata", "invoiceCounter");
    
    try {
        // استخدام المعاملة لضمان القراءة والتحديث كعملية واحدة غير متقطعة
        const newInvoiceNumber = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let newCount;
            
            if (!counterDoc.exists()) {
                // إذا لم يكن المستند موجوداً، نبدأ من 1 وننشئه
                newCount = 1;
                transaction.set(counterRef, { count: newCount });
            } else {
                // قراءة القيمة الحالية وزيادتها بواحد
                const currentCount = counterDoc.data().count || 0;
                newCount = currentCount + 1;
                transaction.update(counterRef, { count: newCount });
            }

            // يتم ترقيم الفاتورة بصيغة INV-00000X 
             return newCount;
        });
        
        return newInvoiceNumber;
    } catch (e) {
        console.error("فشلت عملية المعاملة لتوليد رقم الفاتورة:", e);
        throw new Error("فشل في توليد رقم فاتورة فريد.");
    }
};
const CashInvoiceForm = () => {
  const [showTax, setShowTax] = useState(true);
  // 1. إضافة حالة جديدة لتفعيل الخصم
  const [showDiscount, setShowDiscount] = useState(false); 
  const today = new Date().toISOString().split("T")[0];
  const { invoiceId } = useParams();
const [isSaving, setIsSaving] = useState(false);

  const [data, setData] = useState({
    company_name: "مؤسسة القوة العاشرة للمقاولات العامة",
    commercial_register: "4030202520",
    tax_number: "301252163700003",
    company_logo: "",
    customer_name: "",
    customer_tax_number: "",
    customer_phone: "",
    invoice_number: "",
    invoice_date: today,
    items: [{ description: "", quantity: 1, unit_price: 0, total_price: 0 }],
    subtotal: 0,
    // 2. إضافة خصائص الخصم الجديدة
    discount_rate: 0,
    discount_amount: 0,
    subtotal_after_discount: 0,
    vat_rate: 15,
    vat_amount: 0,
    total: 0,
    notes: "",
  });

  // دالة لحساب الإجماليات
  const calculateTotals = (items, vatRate, discountRate) => {
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.total_price) || 0),
      0
    );

    const discount_amount = (subtotal * discountRate) / 100;
    const subtotal_after_discount = subtotal - discount_amount;
    const vat_amount = (subtotal_after_discount * vatRate) / 100;
    const total = subtotal_after_discount + vat_amount;

    return {
      subtotal,
      discount_amount,
      subtotal_after_discount,
      vat_amount,
      total,
    };
  };

 useEffect(() => {
  const initializeInvoice = async () => {
    if (invoiceId) {
      // تحميل فاتورة موجودة
      try {
        const docRef = doc(db, "cashinvoices", invoiceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setData((prev) => ({
            ...prev,
            ...docData,
            invoice_date: docData.invoice_date || prev.invoice_date,
          }));
          if (docData.discount_rate > 0) setShowDiscount(true);
        } else {
          alert("هذه الفاتورة غير موجودة");
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
      }
    } else {
      // إنشاء فاتورة جديدة: توليد رقم فاتورة جديد
      try {
        const newInvoiceNumber = await getNextInvoiceNumber(db);
        setData((prev) => ({
          ...prev,
          invoice_number: newInvoiceNumber,
        }));
      } catch (err) {
        console.error("Error generating invoice number:", err);
      }
    }
  };

  initializeInvoice();
}, [invoiceId]);


  const saveToFirebase = async () => {
    try {
      // إذا كان الخصم غير مُفعّل، قم بتصفير قيم الخصم قبل الحفظ
      const finalData = { ...data, company_logo: "/logoa.png" };
      if (!showDiscount) {
        finalData.discount_rate = 0;
        finalData.discount_amount = 0;
        finalData.subtotal_after_discount = finalData.subtotal;
      }
      
      if (invoiceId) {
        await updateDoc(doc(db, "cashinvoices", invoiceId), finalData);
        alert(" تم تحديث الفاتورة النقدية!");
      } else {
        await addDoc(collection(db, "cashinvoices"), finalData); 
        alert("✅ تم حفظ الفاتورة النقدية!");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ خطأ في الحفظ");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // 3. تحديث الدالة لمعالجة تغييرات الخصم/الضريبة
  const handleFinanceChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = { ...prev, [name]: parseFloat(value) || 0 };
      
      const { subtotal, discount_amount, subtotal_after_discount, vat_amount, total } = 
        calculateTotals(newData.items, newData.vat_rate, newData.discount_rate);

      return {
        ...newData,
        subtotal,
        discount_amount,
        subtotal_after_discount,
        vat_amount,
        total,
      };
    });
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

  // 4. تحديث دالة removeItem لتشمل حسابات الخصم
  const removeItem = (index) => {
    if (data.items.length === 1) {
      alert("يجب أن يكون هناك بند واحد على الأقل");
      return;
    }
    
    const newItems = data.items.filter((_, i) => i !== index);
    
    const { subtotal, discount_amount, subtotal_after_discount, vat_amount, total } = 
      calculateTotals(newItems, data.vat_rate, data.discount_rate);

    setData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      discount_amount,
      subtotal_after_discount,
      vat_amount,
      total,
    }));
  };

  // 4. تحديث دالة handleItemChange لتشمل حسابات الخصم
  const handleItemChange = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;

    const q = Number(newItems[index].quantity) || 0;
    const p = Number(newItems[index].unit_price) || 0;
    newItems[index].total_price = q * p;

    const { subtotal, discount_amount, subtotal_after_discount, vat_amount, total } = 
      calculateTotals(newItems, data.vat_rate, data.discount_rate);

    setData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      discount_amount,
      subtotal_after_discount,
      vat_amount,
      total,
    }));
  };

  const downloadPDF = async (htmlContent) => {
    try {
      // Step 1: Save data before downloading PDF
      await saveToFirebase();

      // Step 2: Send HTML content to the server for PDF generation
      const response = await fetch("https://server-bd2c.onrender.com/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error("خطأ في السيرفر");

      // Step 3: Receive and download the PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `cash-invoice-${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(" Error generating PDF:", err);
      alert(" خطأ أثناء إنشاء PDF");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8">
      {/* الهيدر */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="p-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-600">
              إنشاء فاتورة نقدية
            </h1>

            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-medium hidden sm:inline">العودة</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        
        {/* بيانات العميل - لم يتغير */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">👤</span>
            بيانات العميل
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                اسم العميل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={data.customer_name}
                onChange={handleChange}
                placeholder="أدخل اسم العميل"
                className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الرقم الضريبي للعميل
              </label>
              <input
                type="text"
                name="customer_tax_number"
                value={data.customer_tax_number}
                onChange={handleChange}
                placeholder="301234567890003"
                className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                رقم التواصل <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={data.customer_phone}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
                className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
              />
            </div>
             
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/*   <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رقم الفاتورة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  value={data.invoice_number}
                  onChange={handleChange}
                  placeholder="INV-001"
                  className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                />
              </div>*/}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  تاريخ الفاتورة
                </label>
                <input
                  type="date"
                  name="invoice_date"
                  value={data.invoice_date}
                  onChange={handleChange} 
                  className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* البنود - لم يتغير */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            بنود الفاتورة
          </h2>
          
          <div className="space-y-4">
            {data.items.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative">
                
                {/* زر الحذف */}
                {data.items.length > 1 && (
                  <button
                    onClick={() => removeItem(i)}
                    className="absolute top-2 left-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-1 transition-colors"
                    title="حذف البند"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                
                <div className="mb-2 text-sm font-medium text-indigo-600">
                  بند رقم {i + 1}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      البيان <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(i, "description", e.target.value)}
                      className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base"
                      rows={3}
                      placeholder="اكتب وصف البند هنا..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        الكمية
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(i, "quantity", +e.target.value)} 
                        className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                        min="0"
                        step="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        سعر الوحدة
                      </label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(i, "unit_price", +e.target.value)}
                        className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <span className="text-sm text-slate-600">الإجمالي: </span>
                    <span className="text-lg font-bold text-indigo-600">
                      {item.total_price.toFixed(2)} ريال
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-800 transition font-medium text-base"
          >
            ➕ إضافة بند جديد
          </button>
        </div>

        {/* الإعدادات المالية - تم التحديث هنا */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            الإعدادات المالية
          </h2>
          
          <div className="space-y-4">
            {/* 5. خيارات التفعيل: إضافة تفعيل الخصم */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDiscount}
                  onChange={() => setShowDiscount(!showDiscount)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-base font-medium text-slate-700">تفعيل الخصم</span>
              </label>
{/*
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTax}
                  onChange={() => setShowTax(!showTax)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-base font-medium text-slate-700">تفعيل الضريبة</span>
              </label>*/}
            </div>

            {/* 5. إعدادات الخصم: نسخ من QuoteForm */}
            {showDiscount && (
              <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                <h3 className="font-medium text-slate-700 mb-3">إعدادات الخصم</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      نسبة الخصم (%)
                    </label>
                    <input
                      type="number"
                      name="discount_rate"
                      value={data.discount_rate}
                      onChange={handleFinanceChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-base"
                    />
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">قيمة الخصم:</span>
                      <span className="font-bold text-red-600">{data.discount_amount.toFixed(2)} ريال</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">الإجمالي بعد الخصم:</span>
                      <span className="font-bold text-slate-800">{data.subtotal_after_discount.toFixed(2)} ريال</span>
                    </div>
                  </div>
              </div>
            </div>
            )}

            {/* إعدادات الضريبة 
            {showTax && (
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="font-medium text-slate-700 mb-3">إعدادات الضريبة</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    نسبة الضريبة (%)
                  </label>
                  <input
                    type="number"
                    name="vat_rate"
                    value={data.vat_rate}
                    onChange={handleFinanceChange} // تم تغيير الدالة إلى handleFinanceChange
                    min="0"
                    max="100"
                    step="0.1"
                    className="border border-slate-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-green-400 focus:border-transparent text-base"
                  />
                </div>
              </div>
            )}*/}
          </div>
        </div>

        {/* 6. ملخص المبالغ - تم التحديث هنا */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            ملخص المبالغ
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-600">
              <span className="text-slate-300">الإجمالي قبل الضريبة والخصم:</span>
              <span className="font-bold text-lg">{data.subtotal.toFixed(2)} ريال</span>
            </div>
            
            {showDiscount && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-slate-600">
                  <span className="text-red-300">الخصم ({data.discount_rate}%):</span>
                  <span className="font-bold text-red-400">-{data.discount_amount.toFixed(2)} ريال</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-600">
                  <span className="text-slate-300">الإجمالي الخاضع للضريبة:</span>
                  <span className="font-bold text-lg">{data.subtotal_after_discount.toFixed(2)} ريال</span>
                </div>
              </>
            )}
            
            {showTax && (
              <div className="flex justify-between items-center py-2 border-b border-slate-600">
                <span className="text-green-300">الضريبة ({data.vat_rate}%):</span>
                <span className="font-bold text-green-400">{data.vat_amount.toFixed(2)} ريال</span>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 bg-white bg-opacity-10 rounded-lg px-4 mt-2">
              <span className="font-bold text-yellow-300 text-lg">الإجمالي النهائي:</span>
              <span className="font-bold text-2xl text-yellow-400">{data.total.toFixed(2)} ريال</span>
            </div>
          </div>
        </div>


        {/* ملاحظات - لم يتغير */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            ملاحظات إضافية
          </h2>
          <textarea
            placeholder="أضف أي ملاحظات أو شروط إضافية..."
            name="notes"
            value={data.notes}
            onChange={handleChange}
            className="border border-slate-300 rounded-lg p-4 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-base"
            rows={4}
          />
        </div>

        {/* الأزرار - تم تحديث تمرير الخصائص */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg rounded-t-xl p-4">
          <CashInvoiceActions
            saveToFirebase={saveToFirebase}
            downloadPDF={async () => {
              const dataWithImages = {
                ...data,
                company_logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS8...",
              };
              // تصفير قيم الخصم في PDF إذا كان الخصم غير مُفعّل
              if (!showDiscount) {
                dataWithImages.discount_rate = 0;
                dataWithImages.discount_amount = 0;
              }
              const htmlContent = CashInvoiceTemplate({ 
                data: dataWithImages, 
                showTax,
                showDiscount 
              }).props.dangerouslySetInnerHTML.__html;
              await downloadPDF(htmlContent);
            }}
            showTax={showTax}
            toggleShowTax={() => setShowTax((prev) => !prev)}
            showDiscount={showDiscount}
            toggleShowDiscount={() => setShowDiscount((prev) => !prev)}
          />
        </div>

        {/* المعاينة - تم تحديث تمرير الخصائص */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">👁️</span>
            معاينة الفاتورة
          </h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <CashInvoiceTemplate data={data} showTax={showTax} showDiscount={showDiscount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashInvoiceForm;
