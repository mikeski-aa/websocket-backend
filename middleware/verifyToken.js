import jwt from "jsonwebtoken";

async function verifyTokenMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split("Bearer ")[1];
  console.log(token);

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      console.log("token error");
      return res
        .status(400)
        .json({ error: true, errorMessage: "Token validation failed" });
    }

    req.username = decoded.username;

    next();
  });
}

export { verifyTokenMiddleware };
