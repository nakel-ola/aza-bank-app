import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // true for 465, false for other ports
  auth: {
    user: process.env.STMP_EMAIL, // generated ethereal user
    pass: process.env.STMP_PASSWORD, // generated ethereal password
  },
});

type EmailerType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};
const emailer = async ({ from, to, subject, text, html }: EmailerType) => {
  await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};

export default emailer;
