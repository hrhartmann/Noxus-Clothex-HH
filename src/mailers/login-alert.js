module.exports = function sendLoginAlertEmail(ctx, { user }) {
  return ctx.sendMail('login-alert', { to: user.email, subject: 'Alert!' }, { user });
};
