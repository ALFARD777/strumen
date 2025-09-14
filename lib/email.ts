import { env } from "node:process";
import nodemailer from "nodemailer";

if (!env.EMAIL_HOST || !env.EMAIL_PORT || !env.EMAIL_USER || !env.EMAIL_PASS) {
  throw new Error("Email configuration is missing in environment variables");
}

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: parseInt(env.EMAIL_PORT, 10),
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendRegistrationEmail(
  to: string,
  user: { email: string },
) {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: "Регистрация на сайте",
    text: `Здравствуйте, ${user.email}!\n\nВы успешно зарегистрировались на нашем сайте.`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #ddd;
          }
          .header img {
            max-width: 150px;
          }
          .content {
            padding: 20px 0;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            color: #888;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${env.LOGO_LINK}" alt="Strumen Logo">
          </div>
          <div class="content">
            <h1>Здравствуйте, ${user.email}!</h1>
            <p>Вы успешно зарегистрировались на нашем сайте.</p>
            <a href="https://strumen.com" class="button">Перейти на сайт</a>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()}, Гран-Система-С. Все права защищены.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);

    return false;
  }
}
