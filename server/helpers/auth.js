const admin = require("firebase-admin");

const serviceAccount = require("../config/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// helper authentication graphql
exports.authCheck = async (req) => {
  try {
    const currentUser = await admin.auth().verifyIdToken(req.headers.authtoken);
    console.log('CURRENT USER', currentUser);
    return currentUser;
  } catch (error) {
    console.log('AUTH CHECK ERROR', error);
    throw new Error('Invalid or expired token');
  }
};

// helper authentication rest
exports.authCheckMiddleware = (req, res, next) => {
  if (req.headers.authtoken) {
    admin
    .auth()
    .verifyIdToken(req.headers.authtoken)
    .then((result) => {
      next();
    })
    .catch((error) => console.log(error));
  } else {
    res.json({ error: "Unauthorized" });
  }
};

// let authorized = true;

// exports.authCheck = (req, res, next = (f) => f) => {
//     if (authorized) {
//         next();
//     } else {
//         throw new Error('Unauthorized');
//     }
// };