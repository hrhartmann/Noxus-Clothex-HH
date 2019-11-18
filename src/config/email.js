require('dotenv').config();

module.exports = {
  provider: {
    // your provider name directly or from ENV var
    service: 'SendGrid',
    // auth data always from ENV vars
    auth: {
      user: process.env.SENDGRID_USER || 'secarro@hotmail.com',
      pass: process.env.SENDGRID_PASS || '8561639Sc',
    },
  },
  // defaults to be passed to nodemailer's emails
  defaults: {
    from: 'secarro@hotmail.com',
  },
};
