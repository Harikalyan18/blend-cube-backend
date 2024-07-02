const Booking = require('../models/booking-model')
const Payment = require('../models/payment-model')
const _ = require('lodash')
const stripe = require('stripe')('sk_test_51PSw8v09f9SFGllz9GiW72oZJ2kp3kUgdZXytPPoonyv6NO4VtGYFmS6004aTlFoQ2Qm7j3n6fwzCnqvs6GIhPah00iT7dsKPQ');

const paymentsCltr = {}

paymentsCltr.pay = async(req, res) => {
    console.log(req.body, 'req')
    // const { bookingId, amount } = req.body;
    const body = _.pick(req.body, ['bookingId', 'amount', 'user'])
    try {
    //   const booking = await Booking.findById(bookingId).populate('space office user');
  
    //   if (!booking) {
    //     return res.status(404).json({ error: 'Booking not found' });
    //   }

    const customer = await stripe.customers.create({
        name: "Testing",
        address: {
            line1: 'India',
            postal_code: '517501',
            city: 'Tirupati',
            state: 'AP',
            country: 'US',
        },
    })

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data:{
                name:'Space'
            },
              unit_amount: body.amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            customer: customer.id
    //     client_reference_id: payment._id.toString(),
    //   success_url: `${process.env.FRONTEND_URL}/payment-success?transactionId=${payment.transactionId}`,
    //   cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?transactionId=${payment.transactionId}`,
      });
      const payment = new Payment(body)
      payment.booking = body.bookingId
      payment.transactionId = session.id
      payment.user = body.user
      payment.amount = Number(body.amount)
      payment.paymentType = 'card'
      await payment.save()
      res.json({ id: session.id, url: session.url })
  } catch (err) {
      console.log(err)
      res.status(500).json({ error: 'Internal Server Error' })
  }

    //   const payment = new Payment({
    //     booking: bookingId,
    //     amount: booking.totalAmount,
    //     user: booking.user._id,
    //     paymentStatus: 'processing',
    //     paymentType,
    //     transactionId: session.id,
    //   });
    //   await payment.save();

    //   res.status(200).send({
    //     sessionId: session.id,
    //   });
    // } catch (error) {
    //   console.error('Error creating checkout session', error);
    //   res.status(500).json({ error: error.message });
    // }
}

paymentsCltr.successUpdate = async (req, res) => {
    console.log(req.params, 'id')
    try{
        const id = req.params.id
        const body =_.pick(req.body,['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body, {new: true}) 
        res.json(updatedPayment)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'Internal Server Error'})
    }
  };

  paymentsCltr.failedUpdate = async (req, res) => {
    console.log(req.params, 'id')
    try {
        const id = req.params.id
        const body = _.pick(req.body , ['paymentStatus'])
        const updatedPayment = await Payment.findOneAndUpdate({transactionId:id}, body , {new:true})
        res.json(updatedPayment)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal Server Errors' })
    }
}

module.exports = paymentsCltr;



