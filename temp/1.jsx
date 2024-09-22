import React, { useState, useEffect } from 'react'

export default function CombinedPurchaseOrderForm() {
  // State for PurchaseOrderForm
  const [addressType, setAddressType] = useState('Organization')
  const [date, setDate] = useState('2024-09-20')

  // State for EnhancedPurchaseOrderItemTable
  const [items, setItems] = useState([
    { id: 1, details: '', account: '', quantity: 1.00, rate: 0.00, amount: 0.00 }
  ])
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState('%')
  const [taxType, setTaxType] = useState('TDS')
  const [taxRate, setTaxRate] = useState(0)
  const [adjustment, setAdjustment] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [total, setTotal] = useState(0)

  // State for ItemList
  const [hoveredItem, setHoveredItem] = useState(null)
  const itemListData = [
    { id: 1, name: 'A4 Sheets', purchaseRate: 100.00, stock: 0.00, unit: 'rem' },
    { id: 2, name: 'Mouse', purchaseRate: 90.00, stock: 111.00, unit: '' },
    { id: 3, name: 'pen', purchaseRate: 100.00, stock: 100.00, unit: 'pcs' }
  ]

  useEffect(() => {
    calculateTotals()
  }, [items, discount, discountType, taxRate, adjustment])

  const calculateTotals = () => {
    const newSubTotal = items.reduce((sum, item) => sum + item.amount, 0)
    setSubTotal(newSubTotal)

    let discountAmount = 0
    if (discountType === '%') {
      discountAmount = (newSubTotal * discount) / 100
    } else {
      discountAmount = parseFloat(discount) || 0
    }

    const taxAmount = ((newSubTotal - discountAmount) * taxRate) / 100
    const newTotal = newSubTotal - discountAmount + taxAmount + parseFloat(adjustment)

    setTotal(newTotal)
  }

  const addNewRow = () => {
    const newItem = {
      id: items.length + 1,
      details: '',
      account: '',
      quantity: 1.00,
      rate: 0.00,
      amount: 0.00
    }
    setItems([...items, newItem])
  }

  const deleteRow = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id, field, value) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    })
    setItems(updatedItems)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* PurchaseOrderForm */}
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        New Purchase Order
      </h1>
      
      <form className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="vendor" className="w-40 text-sm font-medium text-red-500 mb-1 md:mb-0">Vendor Name*</label>
          <div className="flex-1">
            <select id="vendor" className="w-full p-2 border rounded-md" defaultValue="">
              <option value="" disabled>Select a Vendor</option>
            </select>
          </div>
          <button type="button" className="mt-2 md:mt-0 md:ml-2 p-2 bg-blue-500 text-white rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          <label className="w-40 text-sm font-medium text-red-500 mb-1 md:mb-0">Delivery Address*</label>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="addressType" 
                  className="form-radio" 
                  checked={addressType === 'Organization'}
                  onChange={() => setAddressType('Organization')}
                />
                <span className="ml-2">Organization</span>
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  name="addressType" 
                  className="form-radio"
                  checked={addressType === 'Customer'}
                  onChange={() => setAddressType('Customer')}
                />
                <span className="ml-2">Customer</span>
              </label>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Sriram S</span>
              <button type="button" className="text-blue-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-600">India</div>
            <button type="button" className="text-blue-500 text-sm mt-1">Change destination to deliver</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="purchaseOrder" className="w-40 text-sm font-medium text-red-500 mb-1 md:mb-0">Purchase Order#*</label>
          <div className="flex-1">
            <input id="purchaseOrder" type="text" className="w-full p-2 border rounded-md" defaultValue="PO-00001" />
          </div>
          <button type="button" className="mt-2 md:mt-0 md:ml-2 p-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="reference" className="w-40 text-sm font-medium mb-1 md:mb-0">Reference#</label>
          <input id="reference" type="text" className="flex-1 p-2 border rounded-md" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="date" className="w-40 text-sm font-medium mb-1 md:mb-0">Date</label>
          <input 
            id="date" 
            type="date" 
            className="flex-1 p-2 border rounded-md" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="expectedDelivery" className="w-40 text-sm font-medium mb-1 md:mb-0">Expected Delivery Date</label>
          <input id="expectedDelivery" type="date" className="flex-1 p-2 border rounded-md" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="shipmentPreference" className="w-40 text-sm font-medium mb-1 md:mb-0">Shipment Preference</label>
          <select id="shipmentPreference" className="flex-1 p-2 border rounded-md">
            <option>Choose the shipment preference or type to add</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center">
          <label htmlFor="paymentTerms" className="w-40 text-sm font-medium mb-1 md:mb-0">Payment Terms</label>
          <select id="paymentTerms" className="flex-1 p-2 border rounded-md" defaultValue="Due On Receipt">
            <option>Due On Receipt</option>
          </select>
        </div>
      </form>

      {/* EnhancedPurchaseOrderItemTable */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Item Table</h2>
          <button className="text-blue-500 hover:text-blue-700">
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Bulk Actions
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ITEM DETAILS</th>
                <th className="p-2 text-left">ACCOUNT</th>
                <th className="p-2 text-right">QUANTITY</th>
                <th className="p-2 text-right">RATE</th>
                <th className="p-2 text-right">AMOUNT</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.details}
                      onChange={(e) => updateItem(item.id, 'details', e.target.value)}
                      placeholder="Type or click to select an item."
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={item.account}
                      onChange={(e) => updateItem(item.id, 'account', e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="">Select an account</option>
                      <option value="account1">Account 1</option>
                      <option value="account2">Account 2</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                      className="w-full p-1 border rounded text-right"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                      className="w-full p-1 border rounded text-right"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.amount.toFixed(2)}
                      className="w-full p-1 border rounded text-right"
                      readOnly
                    />
                  </td>
                  <td className="p-2 text-right">
                    <button onClick={() => deleteRow(item.id)} className="text-red-500 hover:text-red-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button onClick={addNewRow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Row
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Add Items in Bulk
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <h3 className="font-bold mb-2">Customer Notes</h3>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              placeholder="Will be displayed on purchase order"
            ></textarea>
          </div>
          <div className="w-full md:w-1/3">
            <div className="flex justify-between mb-2">
              <span>Sub Total</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Discount</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-16 p-1 border rounded text-right mr-2"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="p-1 border rounded"
                >
                  <option value="%">%</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <label className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    checked={taxType === 'TDS'}
                    onChange={() => setTaxType('TDS')}
                    className="form-radio"
                  />
                  <span className="ml-2">TDS</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={taxType === 'TCS'}
                    onChange={() => setTaxType('TCS')}
                    className="form-radio"
                  />
                  <span className="ml-2">TCS</span>
                </label>
              </div>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="p-1 border rounded"
              >
                <option value="0">Select a Tax</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="18">18%</option>
              </select>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Adjustment</span>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(e.target.value)}
                className="w-32 p-1 border rounded text-right"
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ItemList */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Item List</h2>
        <ul className="space-y-2">
          {itemListData.map((item, index) => (
            <li
              key={item.id}
              className={`rounded-lg overflow-hidden transition-all duration-300 ${
                index === 0 || hoveredItem === item.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-sm">
                    Stock on Hand
                    <br />
                    <span className={index === 0 || hoveredItem === item.id ? 'text-white' : 'text-green-500'}>
                      {item.stock.toFixed(2)} {item.unit}
                    </span>
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Purchase Rate: Rs.{item.purchaseRate.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-4 text-blue-500 hover:text-blue-700 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Item
        </button>
      </div>
    </div>
  )
}