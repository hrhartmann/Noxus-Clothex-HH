const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPublication(ctx, next){
    ctx.state.publication = await ctx.orm.publication.findByPk(ctx.params.id);
    return next();
}

router.get('publications.list', '/', async (ctx) => {
    const allPublicationsList = await ctx.orm.publication.findAll();
    const publicationsList = [];
    for (const p of allPublicationsList) {
        let product = await ctx.orm.product.findByPk(p.productId);
        if (product.status == "available") {
            publicationsList.push(p);
        }
    }
    const { publicationCategories } = ctx.state;
    const categoriesList = await ctx.orm.category.findAll();
    const productsList = await ctx.orm.product.findAll();
    async function addObjects(array) {
        for (const publication of array) {
            publication.user = await ctx.orm.user.findByPk(publication.userId);
            publication.product = await ctx.orm.product.findByPk(publication.productId);
        }
    }
    await addObjects(publicationsList);
    await ctx.render('publications/index', {
        categoriesList,
        publicationsList,
        publicationCategories,
        productsList,
        newPublicationPath: ctx.router.url('publications.new'),
        usersListPath: ctx.router.url('users.list'),
        ownerProfilePath: (publication) => ctx.router.url('users.show', { id:publication.userId }),
        newfavoritepublicationPath: (publication) => ctx.router.url('favoritepublications.new', { id:publication.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
    });
});

router.get('publications.newPublication', '/newPublication', async (ctx) => {
    const publication = ctx.orm.publication.build();
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const productsList = await ctx.orm.product.findAll( { where: { userId:user.id, status: 'available' }});
    await ctx.render('publications/new', {
        user,
        productsList,
        newProductPath: ctx.router.url('products.new'),
        publication,
        submitPublicationPath: ctx.router.url('publications.create'),
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
    });
});

router.get('publications.edit', '/:id/edit', loadPublication, async (ctx) => {
    const { publication } = ctx.state;
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const productsList = await ctx.orm.product.findAll({ where: {userId : user.id}});
    const product = await ctx.orm.product.findAll( { where: { id: publication.productId } } );
    await ctx.render('publications/edit', {
      productsList,
      publication,
      product,
      submitPublicationPath: ctx.router.url('publications.update', { id: publication.id }),
    });
  });

router.post('publications.create', '/', async (ctx) => {
    const { title } = ctx.request.body;
    const { image } = ctx.request.body;
    const { description } = ctx.request.body;
    const { product } = ctx.request.body;
    const id = ctx.session.userId;
    const publication = ctx.orm.publication.build({
                                                    title: title,
                                                    image: image,
                                                    description: description,
                                                    userId: id,
                                                    productId: product,
                                                });
    try {
        await publication.save(
            {
                fields: [
                    'title',
                    'image',
                    'description',
                    'productId',
                    'userId',
                ],
            },
        );
        
        ctx.redirect(ctx.router.url('publications.list', { id:id } ));
    } catch (validationError) {
        await ctx.render('publications/new', {
            publication,
            errors: validationError.errors,
            submitPublicationPath: ctx.router.url('publications.create'),
        });
    }
});

router.patch('publications.update', '/:id', loadPublication, async (ctx) => {
    const { publication } = ctx.state;
    try {
        const {
            title,
            image,
            description,
        } = ctx.request.body;
        await publication.update({
            title,
            image,
            description,
        });
        ctx.redirect(ctx.router.url('publications.list'));
    } catch (validationError) {
        await ctx.render('publications/edit', {
            publication,
            errors: validationError.errors,
            submitPublicationPath: ctx.router.url('publications.update'),
            
        });
    }
});

router.del('publications.delete', '/:id', loadPublication, async (ctx) => {
    const { publication } = ctx.state
    await publication.destroy();
    ctx.redirect(ctx.router.url('publications.list'))
});

router.get('publications.show', '/:id/show', async (ctx) => {
    const publication = await ctx.orm.publication.findByPk(ctx.params.id);
    const commentsList = await ctx.orm.comment.findAll({ where: { publicationId: publication.id } });
    async function addObjects(pub) {
        pub.user = await ctx.orm.user.findByPk(publication.userId);
        pub.product = await ctx.orm.product.findByPk(publication.productId);
    }
    async function addUsersToComments(array) {
        for (const comment of array) {
            comment.user = await ctx.orm.user.findByPk(publication.userId);
        }
    }
    await addObjects(publication);
    await addUsersToComments(commentsList);
    await ctx.render('publications/show', {
        publication,
        commentsList,
        newCommentPath: ctx.router.url('comments.new', { publicationId: publication.id }),
        newTradePath: ctx.router.url('trades.new', {
            publicationId: publication.id,
            userId: publication.userId,
            firstObjectId: publication.productId
        }),
        showOwnerPath: (publication) => ctx.router.url('users.show', {id: publication.userId}),
        editCommentPath: (comment) => ctx.router.url('comments.edit', { id:comment.id }),
        deleteCommentPath: (comment) => ctx.router.url('comments.delete', { id:comment.id }),
        
    });
});

router.get('publications.filters', '/filters/:minSize/:maxSize/:minPrice/:maxPrice/:minDistance/:maxDistance/:category', async(ctx) => {
    const allPublicationsList = await ctx.orm.publication.findAll();
    const publicationsList = [];
    for (const p of allPublicationsList) {
        let product = await ctx.orm.product.findByPk(p.productId);
        if (product.status == "available") {
            publicationsList.push(p);
        }
    }
    let newPublicationsList = []
    async function addObjects(array, array2) {
        for (const publication of array) {
            user = await ctx.orm.user.findByPk(publication.userId);
            product = await ctx.orm.product.findByPk(publication.productId);
            publication.userLat = await user.lat;
            publication.userLong = await user.long;
            publication.userName = await user.username;
            publication.productName = await product.name;
            publication.category = await product.categoryId;
            publication.price = await product.exchangePrice;
            publication.size = await product.size;
            if (publication.image == null){
                publication.image = "none"
            }
            let newPub = {
                id: publication.id,
                title: publication.title,
                image: publication.image,
                description: publication.description,
                userId: publication.userId,
                productId: publication.productId,
                createdAt: publication.createdAt,
                updatedAt: publication.updatedAt,
                productName: publication.productName,
                userName: publication.userName,
                category: publication.category,
                price: publication.price,
                size: publication.size,
                lat: publication.userLat,
                long: publication.userLong,
            }
            array2.push(newPub)
        }
        return array
    }
    await addObjects(publicationsList, newPublicationsList);
    ctx.body = await newPublicationsList
})

module.exports = router;
