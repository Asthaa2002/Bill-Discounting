

const Razorpay = require('razorpay'); 
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});


const Invoice = require('../modals/invoice');
const Wallet = require('../modals/wallet');
const Ledger = require('../modals/ledger');
const Bid = require('../modals/bid');
const User = require("../modals/user")
// const stripe = require('stripe')(STRIPE_SECRET_KEY);

exports.getHome = (req,res,next) => {
  res.render("seller/home",{
    path: "/",
    pageTitle: "Home",
    // isAuthenticated: req.session.isLoggedIn,
    // csrfToken: req.csrfToken()
  });
}


exports.gethomepage = (req, res) => {
  const previousInvoices = [];
  Invoice.find().then(invoices=>{
    invoices.forEach(inv=>{
      if(inv?.invStatus == '0')
        inv.invStatus = 'Pending'
    })
    res.render('seller/homepage', { 
    
      previousInvoices: invoices,
      path:"/seller/homepage",
      pageTitle:"Seller-Mainpage",
    isAuthenticated: req.session.isLoggedIn
  });
  }).catch(err=>{
    console.log(err)
  })
};
exports.getlist = (req, res) => {
  const previousInvoices = [];
  Invoice.find().then(invoices=>{
    invoices.forEach(inv=>{
      if(inv?.invStatus == '0')
        inv.invStatus = 'Pending'
      if(inv?.invStatus == '1')
        inv.invStatus == 'Approved'
    })
    res.render('buyer/list', { 
      previousInvoices: invoices,
      path:"/buyer/list",
      pageTitle:"Buyer-Mainpage",
    isAuthenticated: req.session.isLoggedIn
  });
  }).catch(err=>{
    console.log(err)
  })
};

// exports.getAccounts = (req,res,next) => {

//   Wallet.findOne({user_email: 'shivam.sharma9515@gmail.com'}).then(wallet=>{
//     console.log('line 56',wallet)

//     Ledger.find({wallet_id: wallet._id}).then(ledger=>{
//       console.log('line 60',ledger)


//     var ejsObj = {
//       path: "/accounts",
//       pageTitle: "Accounts&Transaction",
//       isAuthenticated: req.session.isLoggedIn,
//       wallet: wallet,
//       ledger: ledger
//     }
    
//     return res.render('seller/accounts',ejsObj);
//   }).catch(err=>{
//     console.log(err)
//   })
// }).catch(err=>{
//   console.log(err)
// })
// }

exports.getAccounts = (req, res, next) => {
  const userEmail = req.user.email; // Assuming user email is stored in req.user.email after login

  Wallet.findOne({ user_email: userEmail }).then(wallet => {  
    // console.log('Wallet:', wallet);
 
    Ledger.find({ wallet_id: wallet._id }).then(ledger => {
      // console.log('Ledger:', ledger);

      const ejsObj = {
        path: "/accounts",
        pageTitle: "Accounts & Transaction",
        isAuthenticated: req.session.isLoggedIn,
        wallet: wallet,
        ledger: ledger
      };

      return res.render('seller/accounts', ejsObj);
    }).catch(err => {
      console.log(err);
      // Handle error fetching ledger
      return res.status(500).send('Internal Server Error');
    });
  }).catch(err => {
    console.log(err);
    // Handle error fetching wallet
    return res.status(500).send('Internal Server Error');
  });
};


exports.getinvoices = (req,res,next)=>{
    res.render('seller/invoices',{
        path:"/invoices",
        pageTitle: "Invoices-Form",
        isAuthenticated: req.session.isLoggedIn
    });
}
exports.viewInvoice = (req, res) => {
  const invoiceId = req.params.invoiceId;

  Invoice.findById(invoiceId)
    .then(invoice => {
      if (!invoice) {
        res.render('error');
      } else {
        res.render('seller/view_invoice', { invoice ,
  pageTitle: invoice.title,
        path:'/invoice',
        isAuthenticated: req.session.isLoggedIn
      });
      }
    })
    .catch(error => {
      console.log(error.message);
      res.render('error');
    });
};

exports.getbid = (req,res,next)=>{
  Invoice.find({ status: 1 })
  .then(approvedInvoices => {
    // console.log('line 206',approvedInvoices)
    res.render('investor/bidform', {
      approvedInvoices,
      path:"/bid",
      pageTitle: 'bid-form', 
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }); 
}

exports.submitBid = async (req, res) => {
  const {invoiceId} = req.params; 
  // const investorId = req.params.investorId

  try {
    const find = await Invoice.findById(invoiceId);
    const investor = await User.findOne({ role: 'investor' }, '_id');
    const investorId = investor._id;
    console.log('Investor ID:', investorId, invoiceId);
   
    const { amount } = req.body;
    const createNew = await Bid.create({
      amount: amount,
      invoiceId: investorId,
      investorId: investorId
    })

    const result = await createNew.save()
    console.log('bid saved ', result )
    // res.status(200).json({message: 'bid saved!!', result: result })
    res.redirect('/displayInvoices')
    // Process the bid with the found invoice and bid amount

    // Send a response or perform further actions
  } catch (err) {
    // Handle errors appropriately
    console.error(err);
    // Send an error response or redirect to an error page
  }
};


  
  // Invoice.findByIdAndUpdate(invoiceId, { status: 3 }, { new: true })
  //     .then(updatedInvoice => {
  //         if (!updatedInvoice) {
  //             return res.status(404).json({ success: false, message: 'Invoice not found' });
  //         }
  //         res.status(200).json({ success: true, message: 'Bid submitted successfully', updatedInvoice });
  //     })
  //     .catch(error => {
  //         console.error('Error submitting bid:', error);
  //         res.status(500).json({ success: false, message: 'Failed to submit bid' });
  //     });







// Controller for creating a new invoice
exports.postinvoice = (req, res,next) => {
  console.log('astha',req.file);
  const {
    invoiceNumber,
    invoiceAmount ,
    issueDate,
    dueDate,
    buyNowPrice,
    productName,
    productDetails, 
    invoiceStatus
  } = req.body;
  const seller_email = req.user.email;
  const image = req.file;
// console.log(req.body);
// console.log(image);
const imageUrl = image.path;

// let today = new Date().toString()

// var path1 = __dirname + `/../images/${today}.jpg`;
// path = __dirname + '/../../utilityBill.jpg';
// fs.createWriteStream(path1).write(image.buffer);

// const imageUrl = `/images/${today}.jpg`;

// console.log('line 80=>',imageUrl)
  const newInvoice = new Invoice({
    invoiceNumber:invoiceNumber,
    invoiceAmount:invoiceAmount,
    issueDate:issueDate,
    dueDate:dueDate,
    buyNowPrice:buyNowPrice,
    productName:productName,
    seller_email:seller_email,
    productDetails:productDetails,
    imageUrl:imageUrl,
    image: image,
    invoiceStatus:'0'
  });

  newInvoice
    .save()
    .then(result => {
      // console.log(result);
      // console.log('Created Invoice');
      res.redirect('/seller/homepage');
    })
   // .then((savedInvoice) => {
    //   res.status(201).json(savedInvoice);
    //   res.redirect('/homepage');
    //    // Respond with the saved invoice
    // })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};


// exports.updateInvoiceStatus = (req, res, next) => {
//   const invoiceId = req.params.id;
//   const newStatus = req.body.status; 
//   Invoice.findByIdAndUpdate(invoiceId, { status: newStatus }, (err, updateInvoiceStatus) => {
//     if (err) {
//       console.log(err)
//     } else {
//       res.json({ message: 'Status updated successfully' });
//     }
//   });
// };

exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId;
    const removedInvoice = await Invoice.findByIdAndRemove(invoiceId);
    if (!removedInvoice) {
      return res.status(404).send('No Invoice found !!');
    }
    // console.log('Invoice deleted !!');
    res.redirect("/seller/homepage");
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error !!');
  }
};


// Controller for approving invoices
exports.approveInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, { status: 1 }, { new: true });

    if (!updatedInvoice) {
      return res.status(404).send('Invoice not found');
    }
    res.redirect('/buyer/list');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// Controller for displaying approved invoices on the next page

exports.displayApprovedInvoices = (req, res, next) => {
  // console.log("i m here")
  Invoice.find({ status: 1 })
    .then(approvedInvoices => {
      // console.log('line 206',approvedInvoices)
      res.render('investor/display', {
        approvedInvoices,
        path:"/displayInvoices",
        pageTitle: 'Display-list', 
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
};


// exports.renderInvoicePayment = (req, res) => {
//   Invoice.findById(req.params.invoiceId)
//     .then(invoice => {
//       res.render('invoice_payment', {
//         invoiceId: invoice._id,
//         invoiceNumber: invoice.invoiceNumber,
//         amount: invoice.amount,
//         stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
//       });
//     })
//     .catch(error => {
//       console.log(error.message);
//       res.render('error');
//     });
// };

// exports.handleInvoicePayment = (req, res) => {
//   stripe.customers.create({
//     email: req.body.stripeEmail,
//     source: req.body.stripeToken,
//     // Additional customer details
//   })
//   .then(customer => {
//     return stripe.charges.create({
//       amount: req.body.amount * 100,
//       currency: 'INR',
//       description: req.body.description,
//       customer: customer.id,
//       // Additional charge details
//     });
//   })
//   .then(charge => {
//     // Handle successful payment - update invoice status or other actions
//     res.redirect('/success');
//   })
//   .catch(error => {
//     console.log(error.message);
//     res.redirect('/failure');
//   });
// };






exports.postBuyNow = async(req, res, next) => {
  try {
    const { buyNowPrice } = req.body;
    const seller_email = req.body.seller_email;
    const investor_email = req.user.email; // Assuming user email is available in req.user
    const invoiceId = req.params.invoiceId;
     // Assuming invoiceId is available in params
    //  console.log('line 315',req.body);
    //  console.log( 'line 316',req.params);
    //  console.log( 'line 317',req.user);

    const sellerWallet = await Wallet.findOne({ user_email: seller_email });
    const investorWallet = await Wallet.findOne({ user_email: investor_email });

    if (!sellerWallet || !investorWallet) {
      return res.status(404).send('Seller or Investor wallet not found');
    }
    if(parseFloat(investorWallet.wallet_balance) < buyNowPrice){
      return res.status(401).send('Insufficient Funds');
    }

    investorWallet.wallet_balance = parseFloat(investorWallet.wallet_balance)
    sellerWallet.wallet_balance = parseFloat(sellerWallet.wallet_balance)

    var opening_balance_investor = investorWallet.wallet_balance
    var opening_balance_seller = sellerWallet.wallet_balance

    sellerWallet.wallet_balance += parseFloat(buyNowPrice);
    investorWallet.wallet_balance -= parseFloat(buyNowPrice);

    var closing_balance_investor = investorWallet.wallet_balance
    var closing_balance_seller = sellerWallet.wallet_balance

    var ledgerEntryInvestor = {
      wallet_id: investorWallet._id,
      opening_balance : opening_balance_investor,
      closing_balance : closing_balance_investor,
      trx_amt : parseFloat(buyNowPrice),
      trx_type : 'DEBIT'
    }

    var ledgerEntrySeller = {
      wallet_id: sellerWallet._id,
      opening_balance : opening_balance_seller,
      closing_balance : closing_balance_seller,
      trx_amt : parseFloat(buyNowPrice),
      trx_type : 'CREDIT'
    }

    var ledgerEntryInvestor = new Ledger(ledgerEntryInvestor);
    var ledgerEntrySeller = new Ledger(ledgerEntrySeller);


    await Promise.all([sellerWallet.save(), investorWallet.save()]);
    // console.log("i m here 2")
    await Promise.all([ledgerEntrySeller.save(), ledgerEntryInvestor.save()]);



    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }

    invoice.status = 2;
   
    await invoice.save();

    // Redirect to accounts page after successful transaction
    res.redirect('/accounts');
  } catch (error) {
    console.error('Error processing buy now:', error);
    res.status(500).send('Transaction failed');
  }
};


exports.createOrder = async (req, res) => {
  try {
    const amount = req.body.amount;
    const walletID = req.body.walletID;
    const options = {
      amount: 100 ,
      currency: 'INR',
      receipt: 'razorUser@gmail.com',
    };

    console.log('line 415', amount)

      const order = await razorpayInstance.orders.create(options);

    console.log('line 416', order);
    // const invoiceId = req.body.invoiceId;
    // const updatedInvoice = await Invoice.findByIdAndUpdate(
    //   invoiceId,
    //   { status: 2 }, // Assuming '2' represents a successful payment status
    //   { new: true } // To get the updated document
    // );
    const { id } = req.params;
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, { status: 2}, { new: true });



    res.status(200).send({
      success: true,
      msg: 'Order Created',
      order_id: order.id,
      amount: amount,
      key_id: RAZORPAY_ID_KEY,
      contact: '9694491634',
      name: 'Astha',
      email: 'kuldeepchahar426@gmail.com',
      updatedInvoice
    });
  } catch (error) {
    console.log('Error:', error);
    res.status(400).send({ success: false, msg: 'Something went wrong!' });
  }
};







// module.exports = router;
