const bcrypt = require("bcryptjs");
const User = require("../modals/user");
const Wallet = require("../modals/wallet");

const path = require("path");

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    // isAuthenticated:false
  });
};
exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
// exports.postLogin = (req, res, next) => {

//   const email = req.body.email;
//   const password = req.body.password;
//   User.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         return res.redirect("/login");
//       }

//       bcrypt
//         .compare(password, user.password)
//         .then((doMatch) => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             req.session.user = user;
//             return req.session.save((err) => {
//               console.log(err);
//             //   res.redirect("/");
//               if (user == "buyer") {
//                 return res.redirect("/buyer/list");
//               } else if (user == "seller") {
//                 return res.redirect("/seller/homepage");
//               } else if (user == "investor") {
//                 return res.redirect("/displayInvoices");
//               }
//             });
//           }
//           res.redirect("/login");
//         })
//         .catch((err) => {
//           console.log(err);
//           res.redirect("/login");
//         });
//     })
//     .catch((err) => console.log(err));
// };
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              
              if (user.role === "buyer") {
                return res.redirect("/buyer/list");
              } else if (user.role === "seller") {
                return res.redirect("/seller/homepage");
              } else if (user.role === "investor") {
                return res.redirect("/displayInvoices");
              }
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const role = req.body.role;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            confirmPassword: confirmPassword,
            role: role,
          });
          return user.save();
        })
        .then((result) => {
          const wallet = new Wallet({
            
            user_email: email,
            wallet_balance: 0
          });
          return wallet.save().then(wallet=>{
            res.redirect("/login");
          })
        });
    })

    .catch((err) => {
      console.log(err);
    });
  // })
};

// exports.postSignup = async (req, res, next) => {
//     const { email, password, confirmPassword, role } = req.body;
//     try {
//       const userData = await User.findOne({ email: email });
//       if (userData) {
//         return res.status(200).json({ message: 'User already exists' });
//       }

//       const user = new User({
//         email: email,
//         password: password,
//         confirmPassword: confirmPassword,
//         role: role
//       });

//       const result = await user.save();
//       console.log(result)
//       res.status(201).json({ message: 'User signed up !!', result: result });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

// let email = req.user.email
// let email = req.params.email
// let email = req.body.email

// let v1 = wallet.find({user_email: email})

// v1.wallet_balance = v1.wallet_balance + amount;

// v1.save();


// let v1 = wallet.find({user_email: seller_email})
// let v2 = wallet.find({user_email: investor_email})

// v1 seller wallet
// v2 investor wallet


// v1.wallet_balance = v1.wallet_balance + x
// v2.wallet_balance = v2.wallet_balance - x


// postBuy()=>{
//   let invoice_number = req.body.invoice_number
//   let seller_email = req.body.seller_email
//   let investor_email = req.body.investor_email

//   let v1 = wallet.find({user_email: seller_email})
//   let v2 = wallet.find({user_email: investor_email})

  
//   v1.wallet_balance = v1.wallet_balance + x
//   v2.wallet_balance = v2.wallet_balance - x

//   v1.save()
//   v2.save()

// }

