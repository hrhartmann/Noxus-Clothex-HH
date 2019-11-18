const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadComment(ctx, next){
    ctx.state.comment = await ctx.orm.comment.findByPk(ctx.params.id);
    return next();
}

router.get('comments.list', '/', async (ctx) => {
    const commentsList = await ctx.orm.comment.findAll();
    await ctx.render('comments/index', {
        commentsList,
        newCommentPath:(comment) => ctx.router.url('comments.new', { publicationId: comment.publicationId }),
        editCommentPath: (comment) => ctx.router.url('comments.edit', { id:comment.id }),
        deleteCommentPath: (comment) => ctx.router.url('comments.delete', { id:comment.id }),
    });
});

router.get('comments.new', '/:publicationId/new', async (ctx) => {
    const comment = ctx.orm.comment.build();
    const publicationId = ctx.params.publicationId;
    await ctx.render('comments/new', {
        comment,
        submitCommentPath: ctx.router.url('comments.create', { publicationId: publicationId }),
    });
});

router.get('comments.edit', '/:id/edit', loadComment, async (ctx) => {
    const { comment } = ctx.state;
    await ctx.render('comments/edit', {
      comment,
      submitCommentPath: ctx.router.url('comments.update', { id: comment.id }),
    });
  });

router.post('comments.create', '/:publicationId', async (ctx) => {
    const { content } = ctx.request.body;
    const userId = ctx.session.userId;
    const publicationId = ctx.params.publicationId;
    const comment = ctx.orm.comment.build({
        content: content,
        userId: userId,
        publicationId: publicationId,
    });
    try {
        await comment.save(
            {
                fields: [
                    'content',
                    'userId',
                    'publicationId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('publications.show', { id:publicationId }));
    } catch (validationError) {
        await ctx.render('comments/new', {
            comment,
            errors: validationError.errors,
            submitCommentPath: ctx.router.url('comments.create'),
        });
    }
});

router.patch('comments.update', '/:id', loadComment, async (ctx) => {
    const { comment } = ctx.state;
    const publicationId = comment.publicationId;
    try {
        const {
            content,
        } = ctx.request.body;
        await comment.update({
            content,
        });
        ctx.redirect(ctx.router.url('publications.show', { id: publicationId }));
    } catch (validationError) {
        await ctx.render('comments/edit', {
            comment,
            errors: validationError.errors,
            submitCommentPath: ctx.router.url('comments.update'),
            
        });
    }
});

router.del('comments.delete', '/:id', loadComment, async (ctx) => {
    const { comment } = ctx.state
    const publicationId = comment.publicationId;
    await comment.destroy();
    ctx.redirect(ctx.router.url('publications.show', { id: publicationId }))
});

module.exports = router;