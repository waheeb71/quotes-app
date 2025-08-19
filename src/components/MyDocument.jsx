// src/components/MyDocument.jsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    direction: 'rtl',
   
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 8,
    lineHeight: 1.5,
    width: 180,
  },
  quoteTitle: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  logo: {
    width: 50,
    height: 'auto',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  tableHeader: {
    backgroundColor: '#bfdbfe',
    textAlign: 'center',
    padding: 5,
    fontSize: 8,
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalTable: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  totalRow: {
    flexDirection: 'row',
  },
  totalCell: {
    padding: 5,
    fontSize: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
  },
  notes: {
    fontSize: 10,
    marginTop: 10,
  },
  signature: {
    fontSize: 10,
    marginTop: 20,
    textAlign: 'left',
  },
});

const MyDocument = ({ data, showTax }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={{ fontWeight: 'bold' }}>{data.company_name}</Text>
          <Text>السجل التجاري: {data.commercial_register}</Text>
          <Text>الرقم الضريبي: {data.tax_number}</Text>
        </View>
        <View style={{ flexGrow: 1, textAlign: 'center' }}>
          <Text style={styles.quoteTitle}>عرض سعر</Text>
        </View>
        <Image style={styles.logo} src={data.company_logo || "/logoa.png"} />
      </View>

      {/* Customer and Quote Info */}
      <View style={styles.infoSection}>
        <View style={{ width: '48%', borderWidth: 1, borderColor: '#000' }}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: '30%' }]}>اسم العميل</Text>
            <Text style={[styles.tableCell, { flexGrow: 1 }]}>{data.customer_name}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: '30%' }]}>الرقم الضريبي</Text>
            <Text style={[styles.tableCell, { flexGrow: 1 }]}>{data.customer_tax_number}</Text>
          </View>
        </View>
        <View style={{ width: '48%', borderWidth: 1, borderColor: '#000' }}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: '30%' }]}>رقم العرض</Text>
            <Text style={[styles.tableCell, { flexGrow: 1 }]}>{data.quote_number}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { width: '30%' }]}>تاريخ العرض</Text>
            <Text style={[styles.tableCell, { flexGrow: 1 }]}>{data.quote_date}</Text>
          </View>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, { backgroundColor: '#bfdbfe' }]}>
          <Text style={[styles.tableHeader, { width: '5%' }]}>م</Text>
          <Text style={[styles.tableHeader, { width: '40%' }]}>البيان</Text>
          <Text style={[styles.tableHeader, { width: '15%' }]}>الكمية</Text>
          <Text style={[styles.tableHeader, { width: '20%' }]}>سعر الوحدة</Text>
          <Text style={[styles.tableHeader, { width: '20%' }]}>الإجمالي</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '5%' }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { width: '40%' }]}>{item.description}</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{item.unit_price}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{item.total_price}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.totalTable}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, { width: '50%', backgroundColor: '#bfdbfe' }]}>الإجمالي قبل الضريبة</Text>
            <Text style={[styles.totalCell, { width: '50%' }]}>{data.subtotal.toFixed(2)}</Text>
          </View>
          {showTax && (
            <>
              <View style={styles.totalRow}>
                <Text style={[styles.totalCell, { width: '50%', backgroundColor: '#bfdbfe' }]}>قيمة الضريبة ({data.vat_rate}%)</Text>
                <Text style={[styles.totalCell, { width: '50%' }]}>{data.vat_amount.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalCell, { width: '50%', backgroundColor: '#bfdbfe' }]}>الإجمالي بعد الضريبة</Text>
                <Text style={[styles.totalCell, { width: '50%' }]}>{data.total.toFixed(2)}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Notes and Bank Info */}
      <View style={styles.notes}>
        {data.notes && <Text>ملاحظات: {data.notes}</Text>}
        <Text style={{ marginTop: 10 }}>للتحويل على حساب المؤسسة (IBAN):</Text>
        <Text style={{ fontWeight: 'bold' }}>
          البنك الأهلي: <Text>{data.iban}</Text>
        </Text>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text>ولكم منا جزيل الشكر والتقدير ............</Text>
        <Text style={{ marginTop: 5, fontWeight: 'bold' }}>{data.company_name}</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;