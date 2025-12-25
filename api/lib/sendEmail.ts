import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  // For demo: use ethereal.email test account
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: 'LiTbiT-2.0 <no-reply@litbitree.com>',
    to,
    subject,
    text,
    html
  });

  return info;
}
