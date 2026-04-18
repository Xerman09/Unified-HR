const { SignJWT, jwtVerify } = require('jose');

const user = { id: 1, email: "test@test.com", name: "Test", departmentId: 2 };

function mustEnv(name) {
  const v = process.env[name];
  if (!v) {
    if (name === "JWT_SECRET") return "default-secret-do-not-use-in-production";
    return "";
  }
  return v;
}

function secretKey() {
  return new TextEncoder().encode(mustEnv("JWT_SECRET"));
}

(async () => {
  try {
    const expSeconds = 60 * 60 * 12; // 43200

    const token = await new SignJWT({ user })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expSeconds}s`)
      .sign(secretKey());
      
    console.log("Token signed:", token);

    const { payload } = await jwtVerify(token, secretKey());
    console.log("Payload:", payload);

  } catch (e) {
    console.error("JWT Error:", e);
  }
})();
