const express = require('express');
// const multer = require('multer');
const invoicesController = require('../controller/invoices');

// var upload = multer({ storage: multer.memoryStorage() })
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/',invoicesController.getHome);

router.get('/seller/homepage',isAuth,invoicesController.gethomepage);
router.get('/buyer/list',isAuth,invoicesController.getlist); 

router.get('/invoices',isAuth,invoicesController.getinvoices);

router.post('/invoices',isAuth,invoicesController.postinvoice);
router.get('/accounts',isAuth,invoicesController.getAccounts);
// router.put('/invoices/:invoiceId', invoicesController.updateInvoiceStatus)
router.post('/delete/invoice/:invoiceId',isAuth, invoicesController.deleteInvoice)
router.get('/invoices/:invoiceId', isAuth,invoicesController.viewInvoice);

// upload.single('file')

// Route to handle approval of invoices
router.post('/approve-invoice/:id', isAuth,invoicesController.approveInvoice);
// Route to display approved invoices on the next page
router.get('/displayInvoices',isAuth, invoicesController.displayApprovedInvoices);

// router.get('/invoice/:invoiceId/payment', invoicesController.renderInvoicePayment);
router.post('/buy-now/:invoiceId', isAuth,invoicesController.postBuyNow);

router.post('/createOrder', invoicesController.createOrder);



module.exports = router;




