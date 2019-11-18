const KoaRouter = require('koa-router');

const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}
const router = new KoaRouter();

const sendLoginAlertEmail = require('../mailers/login-alert');

router.get('session.new', '/new', (ctx) => ctx.render('session/new', {
  createSessionPath: ctx.router.url('session.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('session.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.user.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    ctx.session.userId = user.id;
    //await sendLoginAlertEmail(ctx, { user });
    return ctx.redirect(ctx.router.url('publications.list'));
  }
  return ctx.render('session/new', {
    email,
    createSessionPath: ctx.router.url('session.create'),
    error: 'Incorrect mail or password',
  });
});

router.delete('session.destroy', '/', (ctx) => {
  ctx.session = null;
  ctx.redirect(ctx.router.url('publications.list'));
});

module.exports = router;
