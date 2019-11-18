const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const products = require('./routes/products');
const publications = require('./routes/publications');
const messages = require('./routes/messages');
const comments = require('./routes/comments')
const users = require('./routes/users');
const trades = require('./routes/trades');
const session = require('./routes/session');
const categories = require('./routes/categories');
const reviews = require('./routes/reviews');
const chats = require('./routes/chats');
const favoritepublications = require('./routes/favoritepublications');
const errors = require('./routes/errors');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
    newSessionPath: ctx.router.url('session.new'),
    newUserPath: ctx.router.url('users.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    myPublicationsListPath: ctx.router.url('users.myPublicationsList'),
    myProductsListPath: ctx.router.url('users.myProductsList'),
    myProfilePagePath: ctx.router.url('users.myProfilePage'),
    myTradesListPath: ctx.router.url('trades.notifications'),
    myChatsListPath: ctx.router.url('users.myChatsList'),
    newPublicationPath: ctx.router.url('publications.newPublication'),
    categoriesListPath: ctx.router.url('categories.list'),
    favoritePublicationPath: ctx.router.url('users.favoritePublicationsList'),
    //coursesPath: ctx.router.url('courses.list'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/products', products.routes());
router.use('/publications', publications.routes());
router.use('/messages', messages.routes());
router.use('/comments', comments.routes());
router.use('/users', users.routes());
router.use('/trades', trades.routes());
router.use('/session', session.routes());
router.use('/categories', categories.routes());
router.use('/reviews', reviews.routes());
router.use('/chats', chats.routes());
router.use('/favoritepublications', favoritepublications.routes());
router.use('/errors', errors.routes());

router.get('/googlemap', async (ctx) => {
  await ctx.render('googlemap/api_map')
});

module.exports = router;
