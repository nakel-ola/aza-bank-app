import dotenv from "dotenv";
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 3333,
  jwt_secret: process.env.JWT_SECRET,
  expires_in: process.env.EXPIRES_IN,
  mongodb_uri: process.env.MONGODB_URI,
  stmp_email: process.env.STMP_EMAIL,
  stmp_password: process.env.STMP_PASSWORD,
  email_from: '"Aza Bank Team" noreply@azabank.com',
};
export default config;
