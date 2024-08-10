const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const {
    Cashfree
} = require('cashfree-pg');
const { constrainedMemory } = require('process');




require('dotenv').config();

const app = express();
app.use(cors(
    {
        origin:{},
        methods:{"POST","GET"},
        credentials:true
    }
));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);

    const orderId = hash.digest('hex');

    return orderId.substr(0, 12);
}


app.get('/', (req, res) => {
    res.send('Hello World!');
})




app.post('/payment', async (req, res) => {


    try {
        
        let data = {
            "order_amount": parseInt(req.body.amount),
            "order_currency": "INR",
            "order_id": generateOrderId(),
            "customer_details": {
                "customer_id": 'customerid',
                "customer_phone": req.body.phone,
                "customer_name": req.body.name,
                "customer_email": req.body.email
            },
        }

        Cashfree.PGCreateOrder("2023-08-01", data).then(response => {
            console.log(response.data);
            res.json(response.data);

        }).catch(error => {
            console.error(error.response.data.message);
        })


    } catch (error) {
        console.log(error);
    }


})

app.post('/verify', async (req, res) => {

    try {

        let {
            orderId
        } = req.body;

        Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {

            res.json(response.data);
        }).catch(error => {
            console.error(error.response.data.message);
        })


    } catch (error) {
        console.log(error);
    }
})

// test 

// var easyinvoice = require('easyinvoice');

// var InvoiceData = {

//     // Let's add a recipient
//     "client": {
//         "company": "Client Corp",
//         "address": "Clientstreet 456",
//         "zip": "4567 CD",
//         "city": "Clientcity",
//         "country": "Clientcountry"
//     },

//     // Now let's add our own sender details
//     "sender": {
//         "company": "Sample Corp",
//         "address": "Sample Street 123",
//         "zip": "1234 AB",
//         "city": "Sampletown",
//         "country": "Samplecountry"
//     },

//     // Of course we would like to use our own logo and/or background on this invoice. There are a few ways to do this.
//     "images": {
//         //      Logo:
//         // 1.   Use a url
//         logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
//     },

//     // Let's add some standard invoice data, like invoice number, date and due-date
//     "information": {
//         // Invoice number
//         "number": "2021.0001",
//         // Invoice data
//         "date": "12-12-2021",
//         // Invoice due date
//         "due-date": "31-12-2021"
//     },

//     // Now let's add some products! Calculations will be done automatically for you.
//     "products": [
//         {
//             "quantity": "2",
//             "description": "Test1",
//             "tax-rate": 6,
//             "price": 33.87
//         },
//         {
//             "quantity": "4",
//             "description": "Test2",
//             "tax-rate": 21,
//             "price": 10.45
//         }
//     ],

//     // We will use bottomNotice to add a message of choice to the bottom of our invoice
//     "bottomNotice": "Kindly pay your invoice within 15 days.",

//     // Here you can customize your invoice dimensions, currency, tax notation, and number formatting based on your locale
//     "settings": {
//         "currency": "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
//         /* 
//          "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')         
//          "tax-notation": "gst", // Defaults to 'vat'
//          // Using margin we can regulate how much white space we would like to have from the edges of our invoice
//          "margin-top": 25, // Defaults to '25'
//          "margin-right": 25, // Defaults to '25'
//          "margin-left": 25, // Defaults to '25'
//          "margin-bottom": 25, // Defaults to '25'
//          "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
//          "height": "1000px", // allowed units: mm, cm, in, px
//          "width": "500px", // allowed units: mm, cm, in, px
//          "orientation": "landscape", // portrait or landscape, defaults to portrait         
//          */
//     },

//     /*
//         Last but not least, the translate parameter.
//         Used for translating the invoice to your preferred language.
//         Defaults to English. Below example is translated to Dutch.
//         We will not use translate in this sample to keep our samples readable.
//      */
//     "translate": {
//         /*
//          "invoice": "FACTUUR",  // Default to 'INVOICE'
//          "number": "Nummer", // Defaults to 'Number'
//          "date": "Datum", // Default to 'Date'
//          "due-date": "Verloopdatum", // Defaults to 'Due Date'
//          "subtotal": "Subtotaal", // Defaults to 'Subtotal'
//          "products": "Producten", // Defaults to 'Products'
//          "quantity": "Aantal", // Default to 'Quantity'
//          "price": "Prijs", // Defaults to 'Price'
//          "product-total": "Totaal", // Defaults to 'Total'
//          "total": "Totaal" // Defaults to 'Total'        
//          */
//     },

//     /*
//         Customize enables you to provide your own templates.
//         Please review the documentation for instructions and examples.
//         Leave this option blank to use the default template
//      */
//     "customize": {
//         // "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
//     },
// };


// // easyinvoice.createInvoice(data, function (result) {
// //     const pdfBuffer = result.pdf;
// //   const pdfBase64 = pdfBuffer.toString('base64');
// //   res.json({ pdfUrl: `data:application/pdf;base64,${pdfBase64}` });
// // });

// app.get('/generate-pdf', function (req, res) {
//     easyinvoice.createInvoice(InvoiceData, function (result) {
//         const pdfBuffer = result.pdf;
//         const pdfBase64 = pdfBuffer.toString('base64');
//         // res.json({ pdfUrl: `data:application/pdf;base64,${pdfBase64}` });
//         res.set("Content-Type", "application/pdf");
//   res.set("Content-Disposition", "attachment; filename=invoice.pdf");
//   res.send(pdfBuffer);
//     });
// });

// // test end

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})
