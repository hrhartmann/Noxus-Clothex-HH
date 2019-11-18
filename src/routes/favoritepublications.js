const KoaRouter = require('koa-router');
const pkg = require('../../package.json');

const router = new KoaRouter();

async function loadPublication(ctx, next){
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
    return next();
};

async function loadFavoritePub(ctx, next){
    ctx.state.favpub = await ctx.orm.favoritepublications.findByPk(ctx.params.id);
    return next();
}


router.get('favoritepublications.new', '/:id/newFavoritePublication', loadPublication, async (ctx) => {
    const publication = await ctx.orm.publication.findByPk(ctx.params.id);
    console.log(publication.id);
    const publicationid = ctx.params.id

    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const favoritepublication = ctx.orm.favoritepublications.build();
    await ctx.render('publications/favoritepublication', {

        publication,
        publicationid,
        favoritepublication,
        submitfavoritepublicationPath: ctx.router.url('favoritepublications.create'),

    });
  });

router.get('favoritepublications', '/', async (ctx) => {
  ctx.redirect(ctx.router.url('publication.list'))
});

router.del('favoritepublications.delete', '/:id', loadFavoritePub, async (ctx) => {
    const favoritepublication = await ctx.orm.favoritepublications.findByPk(ctx.params.id);
    await favoritepublication.destroy();
    ctx.redirect(ctx.router.url('users.favoritePublicationsList'))
});

router.post('favoritepublications.create', '/', async (ctx) => {
    console.log('finally here !');
    const { publicationid } = ctx.request.body;
    const id = ctx.session.userId;
    const favoritepublication = ctx.orm.favoritepublications.build({
                                                    userId: id,
                                                    publicationId: publicationid,
                                                });
    try {
      await favoritepublication.save(
          {
              fields: [
                  'userId',
                  'publicationId',
              ],
          },
        );
        ctx.redirect(ctx.router.url('publications.list'))
    } catch (validationError) {
        console.log('Something went wrong in fav pubs'),
        await ctx.render('publications/favoritepublication', {


            errors: validationError.errors,
            submitfavoritepublicationPath: ctx.router.url('favoritepublications.create'),
        });
    }
});


module.exports = router;
