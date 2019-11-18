const KoaRouter = require('koa-router');

const router = new KoaRouter()

async function loadReview(ctx, next){
    ctx.state.review = await ctx.orm.review.findByPk(ctx.params.id);
    return next();
}

router.get('reviews.list', '/', async (ctx) => {
    const reviewsList = await ctx.orm.review.findAll();
    const review = ctx.orm.review.build();
    await ctx.render('reviews/index', {
        review,
        reviewsList,
        newReviewPath: ctx.router.url('reviews.new'),
        submitReviewPath: ctx.router.url('reviews.create'),
        editReviewPath: (review) => ctx.router.url('reviews.edit', { id:review.id }),
        deleteReviewPath: (review) => ctx.router.url('reviews.delete', { id:review.id }),
    });
});

router.get('reviews.new', '/new', async (ctx) => {
    const review = ctx.orm.review.build();
    await ctx.render('reviews/new', {
        review,
        submitReviewPath: ctx.router.url('reviews.create'),
    });
});

router.get('reviews.edit', '/:id/edit', loadReview, async (ctx) => {
    const { review } = ctx.state;
    await ctx.render('reviews/edit', {
      review,
      submitReviewPath: ctx.router.url('reviews.update', { id: review.id }),
    });
  });

router.post('reviews.create', '/', async (ctx) => {
    const id = ctx.session.userId;
    const { puntuality } = ctx.request.body;
    const { satisfaction } = ctx.request.body;
    const { quality } = ctx.request.body;
    const review = ctx.orm.review.build({
        puntuality: puntuality,
        satisfaction: satisfaction,
        quality: quality,
    });
    try {
        await review.save(
            {
                fields: [
                    'puntuality',
                    'satisfaction',
                    'quality',
                ],
            },
        );
        ctx.redirect(ctx.router.url('reviews.list'));
    } catch (validationError) {
        await ctx.render('reviews/new', {
            review,
            errors: validationError.errors,
            submitReviewPath: ctx.router.url('reviews.create'),
        });
    }
});
router.post('reviews.createFromTrade', '/:id', async(ctx) => {
    const id = ctx.session.userId;
    const { puntuality } = ctx.request.body;
    const { satisfaction } = ctx.request.body;
    const { quality } = ctx.request.body;
    const trade = ctx.params.id;
    const tradeModel = await ctx.orm.trade.findByPk(trade)
    if (tradeModel.firstUserId == id){
        user = await ctx.orm.user.findByPk(tradeModel.secondUserId)
    } else {
        user = await ctx.orm.user.findByPk(tradeModel.firstUserId)
    }
    const review = ctx.orm.review.build({
        puntuality: puntuality,
        satisfaction: satisfaction,
        quality: quality,
        tradeId: trade,
        
    });
    
    if (user.reputation){
        user.reputation = (Number(user.reputation) + (Number(puntuality) + Number(satisfaction) + Number(quality))/3) / 2
    } else {
        user.reputation = ((Number(puntuality) + Number(satisfaction) + Number(quality))/3)
    }
    const reputation = user.reputation;
    try {
        await review.save(
            {
                fields: [
                    'puntuality',
                    'satisfaction',
                    'quality',
                    'tradeId',
                ],
            },
        );
        await user.update({
            reputation
        });
        
        ctx.redirect(ctx.router.url('trades.notifications'));
    } catch (validationError) {
        await ctx.render('reviews/new', {
            review,
            errors: validationError.errors,
            submitReviewPath: ctx.router.url('trades.notifications'),
        });
    }
});
router.patch('reviews.update', '/:id', loadReview, async (ctx) => {
    const { review } = ctx.state;
    try {
        const {
            puntuality,
            satisfaction,
            quality,
        } = ctx.request.body;
        await review.update({
            puntuality,
            satisfaction,
            quality,
        });
        ctx.redirect(ctx.router.url('reviews.list'));
    } catch (validationError) {
        await ctx.render('reviews/edit', {
            review,
            errors: validationError.errors,
            submitReviewPath: ctx.router.url('reviews.update'),
            
        });
    }
});

router.del('reviews.delete', '/:id', loadReview, async (ctx) => {
    const { review } = ctx.state
    await review.destroy();
    ctx.redirect(ctx.router.url('reviews.list'))
});

module.exports = router;
