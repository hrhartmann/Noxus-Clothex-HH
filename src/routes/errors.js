const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

router.get('errors.404', '/404', async (ctx) => {
    await ctx.render('errors/404', {
        usersListPath: ctx.router.url('users.list'),
        publicationsListPath: ctx.router.url('publications.list'),
    });
});

router.get('errors.500', '/500', async (ctx) => {
    await ctx.render('errors/500', {
        usersListPath: ctx.router.url('users.list'),
        publicationsListPath: ctx.router.url('publications.list'),
    });
});

module.exports = router;
