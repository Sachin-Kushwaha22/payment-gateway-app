import { useState, useRef } from 'react'
import './App.css';
import './Home.css'
import Navbar from './Navbar.jsx';
import { Link } from 'react-router-dom';
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'
import jsPDF from 'jspdf';


function Invoice(orderId, data) {

  const invoiceContainer = document.getElementById('invoice-container');
  invoiceContainer.innerHTML = '';


  const doc = new jsPDF('p', 'mm', [210, 297]); // A4 size

  // Add invoice header
  doc.setFontSize(20);
  doc.text('Invoice', 10, 10);

  // Add invoice details
  doc.setFontSize(14);
  doc.text(`Invoice Number: ${orderId}`, 10, 20);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 25);
  doc.text(`Billing Name: ${data.name}`, 10, 30);
  doc.text(`Billing Email: ${data.email}`, 10, 35);
  doc.text(`Billing Phone: ${data.phone}`, 10, 40);

  // Add invoice items
  doc.setFontSize(12);
  doc.text('Description', 10, 50);
  doc.text('Amount', 150, 50);
  doc.line(10, 55, 200, 55); // horizontal line

  doc.text('Donation', 10, 60);
  doc.text(`₹ ${data.amount}`, 150, 60);

  // Add total
  doc.setFontSize(14);
  doc.text(`Total: ₹ ${data.amount}`, 10, 80);

  // Save the PDF
  // doc.save(`invoice_${orderId}.pdf`);
  // Get the PDF data
  const pdfBlob = doc.output('blob');

  // Create a new iframe element
  const iframe = document.createElement('iframe');
  iframe.src = URL.createObjectURL(pdfBlob);
  iframe.className = 'invoice-iframe';

  // Add the iframe to the webpage

  invoiceContainer.appendChild(iframe);

  iframe.addEventListener('load', () => {
    const pdfViewer = iframe.contentWindow.PDFViewerApplication;
    pdfViewer.pdfViewer.zoom = 1; // Set the zoom level to 100%
  });

}


function App() {

  let cashfree;

  let insitialzeSDK = async function () {

    cashfree = await load({
      mode: "sandbox",
    })
  }

  insitialzeSDK()

  const [orderId, setOrderId] = useState("")

  const [data, setData] = useState({
    amount: '',
    name: '',
    phone: '',
    email: '',
  })

  const getSessionId = async () => {
    try {
      let res = await axios.post("https://payment-gateway-app.onrender.com/payment", data)

      if (res.data && res.data.payment_session_id) {

        console.log(res.data)

        setOrderId(res.data.order_id)
        return res.data.payment_session_id
      }


    } catch (error) {
      console.log(error)
    }
  }

  const verifyPayment = async () => {
    try {

      let res = await axios.post("https://payment-gateway-app.onrender.com/verify", {
        orderId: orderId
      })


      console.log('here', res.data);

    } catch (error) {
      console.log(error)
    }
  }



  const handleClick = async (e) => {

    e.preventDefault()

    if (document.getElementById('amount').value === '') amountchange(e);
    if (document.getElementById('name').value === '') namechange(e);
    if (document.getElementById('phone').value === '') phonechange(e);


    let sessionId = await getSessionId()
    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    }

    try {
      cashfree.checkout(checkoutOptions).then((res) => {

        console.log("payment initialized")

        try {
          if (res && res.paymentDetails.paymentMessage) {
            alert('Payment successful !!')

            document.getElementById('amount').value = '';
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('email').value = '';

            setData({ amount: '', name: '', phone: '', email: '' });
            setAmountWarning('');
            setAmountInvalid('');
            setNameWarning('');
            setPhoneWarning('');

            verifyPayment(orderId)
            alert('Pdf Generated !!')
            Invoice(orderId, data)

          }
        } catch (error) {
          if (res && res.error.message) {

            alert('Payment Failed !!')

            document.getElementById('amount').value = '';
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('email').value = '';

            setData({ amount: '', name: '', phone: '', email: '' });
            setAmountWarning('');
            setAmountInvalid('');
            setNameWarning('');
            setPhoneWarning('');


          }
        }





      })
    }
    catch (error) {

      console.log(error);

    }

  }


  const [amountWarning, setAmountWarning] = useState('')
  const [amountInvalid, setAmountInvalid] = useState('')
  const [nameWarning, setNameWarning] = useState('')
  const [phoneWarning, setPhoneWarning] = useState('')
  const [phoneInvalid, setPhoneInvalid] = useState('')
  const [amountsvg, setAmountSvg] = useState('')
  const [amountInvalidSvg, setAmountInvalidSvg] = useState('')
  const [phoneInvalidSvg, setPhoneInvalidSvg] = useState('')
  const [namesvg, setNameSvg] = useState('')
  const [phonesvg, setPhoneSvg] = useState('')


  const amountchange = (e) => {
    setData({ ...data, amount: e.target.value })
    if (e.target.value === "") {
      setAmountSvg(<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16" role="img" data-icon="CircleXSmall" aria-hidden="true" class="default-ltr-cache-0 e1vkmu651"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z" fill="currentColor"></path></svg>)
      setAmountWarning('Please enter any amount.')
      setAmountInvalid('')
      setAmountInvalidSvg('')
    }
    else if (parseInt(e.target.value) < 1) {
      setAmountInvalidSvg(<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16" role="img" data-icon="CircleXSmall" aria-hidden="true" class="default-ltr-cache-0 e1vkmu651"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z" fill="currentColor"></path></svg>)
      setAmountInvalid('Invalid Amount')
      setAmountWarning('')
      setAmountSvg('')
    }
    else if (parseInt(e.target.value) > 0) {
      setAmountInvalidSvg('')
      setAmountInvalid('')
      setAmountWarning('');
      setAmountSvg('')
    }
  }

  const namechange = (e) => {
    setData({ ...data, name: e.target.value })
    if (e.target.value === "") {
      setNameSvg(<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16" role="img" data-icon="CircleXSmall" aria-hidden="true" class="default-ltr-cache-0 e1vkmu651"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z" fill="currentColor"></path></svg>)
      setNameWarning('This field cannot be empty.')
    }
    else {
      setNameWarning(''); setNameSvg('')
    }
  }
  const phonechange = (e) => {
    setData({ ...data, phone: e.target.value })
    if (e.target.value === "") {
      setPhoneSvg(<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16" role="img" data-icon="CircleXSmall" aria-hidden="true" class="default-ltr-cache-0 e1vkmu651"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM4.46967 5.53033L6.93934 8L4.46967 10.4697L5.53033 11.5303L8 9.06066L10.4697 11.5303L11.5303 10.4697L9.06066 8L11.5303 5.53033L10.4697 4.46967L8 6.93934L5.53033 4.46967L4.46967 5.53033Z" fill="currentColor"></path></svg>)
      setPhoneWarning('This field cannot be empty.')
    }
    else {
      setPhoneWarning('')
      setPhoneSvg('')
    }
  }



  return (
    <>
      <div style={{ width: '100%', maxWidth: '100%', backgroundColor: 'white' }}>
        <div className='container'>
          <Navbar />



          <form className='main-div'>

            <h1>Enter details for Donation</h1>

            <div className='donation-amount'>
              <div style={{ display: 'flex' }}>
                <p className='currency-symbol'>₹</p>
                <input onChange={amountchange} id='amount' className='amount-input' type="number" name='amount' />
              </div>

              <div className='warning-text'>{amountsvg} {amountWarning}</div>
              <div className='warning-text'>{amountInvalidSvg} {amountInvalid}</div>
            </div>

            <div className='basic-details'>
              <div className='basic-details name'>
                <input onChange={namechange} id='name' className='basic-details-input' type="text" name='name' placeholder='Name' />
                <div className='warning-text'>{namesvg} {nameWarning}</div>
              </div>

              <div className='phone-number'>
                <div style={{ display: 'flex' }}>
                  <p className='phone-number-country-code'>+91</p>
                  <input onChange={phonechange} id='phone' className='phone-number-input' type="number" name='phone' placeholder='Mobile Number' />
                </div>

                <div className='warning-text'>{phonesvg}{phoneWarning}</div>
              </div>
              <input onChange={(e) => setData({ ...data, email: e.target.value })} id='email' className='basic-details-input email' type="email" name='email' placeholder='Email (optional)' />

            </div>
            <div className="card">
              <button className='pay-button' onClick={handleClick}>
                Pay now
              </button>

            </div>
          </form>

        </div>
      </div>
      <div id='invoice-container'></div>
    </>
  )
}

export default App
// export {amount}
