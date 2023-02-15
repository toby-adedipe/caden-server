const nodemailer = require("nodemailer");

const user = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass
  }
})

module.exports.sendConfirmationEmail = (name:string, email:string, confirmationCode:string) => {
  transport.sendMail({
    from: user,
    to: email,
    subject: "Welcome to Caiden - Your Writing Assistant Extension!",
    html: `<h1>Email Confirmation</h1>        
        <div>
        <h4>Hello ${name},</h4>
        <p>We're thrilled to welcome you to Caiden, the writing assistant extension that's here to make your writing experience smoother and more enjoyable. Whether you're working on a blog post, writing an email, or crafting a story, Caiden is here to help.</p>
        <p>To get started, all you need to do is confirm your email address by clicking the link below:</p>
        <p><a href="http://localhost:3000/verify/${confirmationCode}">http://localhost:3000/verify/${confirmationCode}</a></p>
        <p>Once you've confirmed your email, you can download the Caiden extension and start using it right away. With Caiden, you'll be able to access a range of writing tools and features designed to improve your writing, including:</p>
        <ul>
          <li>Real-time suggestions and corrections to help you write with confidence</li>
          <li>An AI-powered thesaurus to help you find the perfect words to express your ideas</li>
          <li>A library of writing templates to help you get started on your next project</li>
        </ul>
        <p>At Caiden, our goal is to help you write better, faster, and with more confidence. We're here to support you every step of the way, and we can't wait to see what you'll create with Caiden.</p>
        <p>If you have any questions or need help getting started, please don't hesitate to reach out to us. We're here to help!</p>
        <p>Best regards,</p>
        <p>The Caiden Team</p>
        </div>
        </div>`,
  }).catch((err:any) => console.log(err));
};