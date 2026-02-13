import React from "react";

const CashInvoiceTemplate = ({ data, showTax, showDiscount }) => {

  const htmlContent = `
<html dir="rtl">
  <head>
    <meta charset="UTF-8">
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');

      body {      font-family: 'Cairo', sans-serif;
  font-size: 12px; line-height: 1.4; margin: 0; padding: 0; color: #000; background-color: #fff; }
     .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 2px;
  border: 2px solid #000;
  background-color: #fff;
}

.header-right {
  text-align: right;
  font-size: 12px;

}

.header-left img {

  width: 80px;
  height: auto;
}

.header-center {
  flex: 0 0 100%;      
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  margin-top: 0px;
  border-bottom: 2px solid #000000ff;
   padding-bottom: 0;     
  padding: 0;            
  background:  #dbe5f1ff;;     
  color: #000;             
  border-radius: 6px; 

}


      th, td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
    vertical-align: top;
    font-size: 10px; 
  }

  th {
    width: 1%; 
    white-space: nowrap;
  }

  td {
    width: auto; 
    white-space: nowrap;
  }

      th { background-color: #bfdbfe; }
      .text-blue { color: #2563eb; }
      .totals td { font-weight: bold; }
      .notes { margin-top: 15px; }
      .signature { 
        margin-top: 10px; 
        text-align: left; 
        position: relative;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }
      .signature-text {
        flex: 1;
      }
      .stamp {
        width: 200px;
        height: 200px;
        margin-left: 80px;
        opacity: 0.8;
      }
     h2 { 
     margin-top: 1rem; 
      margin-bottom: 0rem; 
      background:#bfdbfe;
      color: #040404ff;          
      padding: 0.1rem 1.5rem; 
      border-radius: 8px;  
      display: inline-block; 
    }
    .box { padding: 0rem 0.25rem; border: 1px solid #a36969ff; border-radius: 12px; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="invoice">
     
     <div class="header">
  <div class="header-right">
    <div><strong>${data.company_name}</strong></div>
    <p><strong>السجل التجاري:</strong> ${data.commercial_register}</p>
  </div>

  <div class="header-left">
 <img src="https://quotes553.netlify.app/logoa.png" alt="شعار" />
  </div>
  <h1 class="header-center">فاتورة نقدية</h1>

</div>


      </div>
    <div style="display: flex; gap: 20px;">

  <!-- الجدول الأول -->
<table border="1" style="border-collapse: collapse; width: 45%; float: left; margin-right: 0%;  margin-top: 10px">
    <tr>
      <th>اسم العميل</th>
      <td style="font-weight: bold;">${data.customer_name}</td>
    </tr>
    <tr>
      <th>الرقم الضريبي</th>
      <td style="font-weight: bold;">${data.customer_tax_number}</td>
    </tr>
    <tr>
      <th>رقم التواصل</th>
      <td style="font-weight: bold;">${data.customer_phone}</td>
    </tr>
  </table>

  <!-- الجدول الثاني -->
<table border="1" style="border-collapse: collapse; width: 45%;  margin-right: 17%; margin-top: 10px">
    <tr>
      <th>رقم الفاتورة</th>
      <td style="font-weight: bold;">${data.invoice_number}</td>
    </tr>
    <tr>
      <th>تاريخ الفاتورة</th>
      <td style="font-weight: bold;">${data.invoice_date}</td>
    </tr>
   
  </table>


</div>
 <section>
    <h2>مقدمة</h2>
  <div class="box">
 
    <p>
      حيث إن <strong>مؤسسة القوة العاشرة للمقاولات العامة</strong>
      تقوم بأعمال تشمل الزجاج، و الاستانلس ستيل، والألمنيوم، ولديها خبرة عالية في هذا المجال.
    </p>
  </div>
</section>


      <table style="border-collapse: collapse; width: 100%; margin-top: 10px;">
        <thead>
          <tr>
            <th>م</th>
            <th>البيان</th>
            <th>الكمية</th>
            <th>سعر الوحدة</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${item.unit_price}</td>
              <td style="font-weight: bold;">${item.total_price}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      <table  style="border-collapse: collapse; width: 100%; margin-top: 10px;font-weight: bold">
        <tr>
          <td style="font-weight: bold;background-color: rgba(191, 219, 254, 0.5); width: 30%;">الإجمالي قبل الضريبة</td>
          <td style="text-align: left;padding-left: 24px;">${data.subtotal.toFixed(2)}</td>
        </tr>
            ${showDiscount ? `
          <tr>
            <td style="font-weight: bold;background-color: rgba(191, 219, 254, 0.5);width: 30%;">الخصم (${data.discount_rate}%)</td>
            <td style="text-align: left;padding-left: 24px;">${data.discount_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;background-color: rgba(191, 219, 254, 0.5);width: 30%;">الإجمالي بعد الخصم</td>
            <td style="text-align: left;padding-left: 24px;">${data.subtotal_after_discount.toFixed(2)}</td>
          </tr>` : ''}
        ${showTax ? `
          <tr>
            <td style="font-weight: bold;background-color: rgba(191, 219, 254, 0.5);width: 30%;">قيمة الضريبة (${data.vat_rate}%)</td>
            <td style="text-align: left;padding-left: 24px;">${data.vat_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: rgba(191, 219, 254, 0.5);width: 30%;">الإجمالي بعد الضريبة</td>
            <td style="text-align: left;padding-left: 24px;">${data.total.toFixed(2)}</td>
          </tr>` : ''}
      </table>
      
      
      <div class="notes">
        ${data.notes ? `<p><strong>ملاحظات:</strong> ${data.notes}</p>` : ''}
      </div>

      <div class="signature" style="margin-top: 10%;">
        <div class="signature-text">
          <p>ولكم منا جزيل الشكر والتقدير ............</p>
          <p><strong>${data.company_name}</strong></p>
        </div>
        <img src="https://quotes553.netlify.app/ختم.png" alt="ختم الشركة" class="stamp" />
      </div>
    </div>
  </body>
</html>
`;

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default CashInvoiceTemplate;
