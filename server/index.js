const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const {
    Cashfree
} = require('cashfree-pg');





require('dotenv').config();

const app = express();
app.use(cors());
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
    res.json('Hello World!');
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

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})

module.export = app;
