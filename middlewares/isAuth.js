const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const headersObj = req.headers;
  const token = headersObj.authorization.split(" ")[1];

  // verify the token
  const VerifyToken = jwt.verify(token, "anykey", (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });

  if (VerifyToken) {
    //   save the user into req.obj
    req.user = VerifyToken.id;
    next();
  } else {
    const err = new Error("Token expired please login again");
    next(err);
  }
};

module.exports = isAuthenticated;
