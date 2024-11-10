import bcrypt from "bcryptjs";

// generate hash for DB input
function generateHash(password) {
  console.log("genHash");
  const salt = bcrypt.genSaltSync(+process.env.SALT);
  console.log(salt);
  const hash = bcrypt.hashSync(password, salt);

  console.log(hash);
  return hash;
}

// validate hash check for login
function validateHash(inputPwHashed, dbHash) {
  const result = bcrypt.compareSync(inputPwHashed, dbHash);

  console.log(result);
  return result;
}

export { generateHash, validateHash };
