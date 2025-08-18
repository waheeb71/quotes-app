// src/components/QuoteTemplate.jsx
import React from "react";

const QuoteTemplate = ({ data }) => {
  return (
    <div
      id="quote"
      dir="rtl"
      className="font-[Arial] p-6 bg-white text-black text-sm leading-6"
    >
      {/* الترويسة */}
      <div className="border p-4 flex items-center justify-between">
        {/* يسار (الشعار) */}
        <div className="flex-shrink-0">
          <img src="./logoa.png" alt="شعار" className="w-28 h-auto" />
        </div>

        {/* وسط (عنوان عرض سعر) */}
        <div className="text-center flex-1">
          <h2 className="text-xl font-bold">عرض سعر</h2>
        </div>

        {/* يمين (بيانات الشركة) */}
        <div className="text-right text-sm leading-6">
          <p className="font-bold">{data.company_name}</p>
          <p>
            <span className="font-bold">السجل التجاري:</span>{" "}
            {data.commercial_register}
          </p>
          <p>
            <span className="font-bold">الرقم الضريبي:</span>{" "}
            {data.tax_number}
          </p>
        </div>
      </div>

      {/* بيانات العميل والعرض */}
      <div className="grid grid-cols-2 gap-4 my-6 text-sm">
        {/* بيانات العميل */}
        <table className="w-full border text-right">
          <tbody>
            <tr>
              <th className="border p-2 w-40">اسم العميل</th>
              <td className="border p-2">{data.customer_name}</td>
            </tr>
            <tr>
              <th className="border p-2">الرقم الضريبي</th>
              <td className="border p-2">{data.customer_tax_number}</td>
            </tr>
            <tr>
              <th className="border p-2">رقم التواصل</th>
              <td className="border p-2">{data.customer_phone}</td>
            </tr>
          </tbody>
        </table>

        {/* بيانات العرض */}
        <table className="w-full border text-right">
          <tbody>
            <tr>
              <th className="border p-2 w-40">رقم العرض</th>
              <td className="border p-2">{data.quote_number}</td>
            </tr>
            <tr>
              <th className="border p-2">تاريخ العرض</th>
              <td className="border p-2">{data.quote_date}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* جدول المنتجات */}
      <table className="w-full border text-center text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 w-10">م</th>
            <th className="border p-2">البيان</th>
            <th className="border p-2 w-24">الكمية</th>
            <th className="border p-2 w-24">سعر الوحدة</th>
            <th className="border p-2 w-32">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2 text-right">{item.description}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.unit_price}</td>
              <td className="border p-2">{item.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* الإجمالي */}
      <div className="flex justify-end mt-4">
        <table className="w-1/3 border text-sm text-center">
          <tbody>
            <tr>
              <td className="border font-bold p-2">الإجمالي قبل الضريبة</td>
              <td className="border p-2">{data.subtotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* الملاحظات + معلومات البنك */}
      <div className="mt-6">
        <p className="font-bold mb-1">ملاحظات: </p>
        <div className="border p-2 mb-4">{data.notes || "لا توجد ملاحظات."}</div>

        <p>للتحويل على حساب المؤسسة (IBAN):</p>
        <p className="font-bold">البنك الأهلي:</p>
        <p className="text-blue-600 font-bold">{data.iban}</p>
      </div>

      {/* التوقيع */}
      <div className="mt-10 text-right">
        <p>ولكم منا جزيل الشكر والتقدير ............</p>
        <p className="mt-6 font-bold">{data.company_name}</p>
      </div>
    </div>
  );
};

export default QuoteTemplate;
