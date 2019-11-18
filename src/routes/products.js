const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadProduct(ctx, next){
    ctx.state.product = await ctx.orm.product.findByPk(ctx.params.id);
    return next();
}

router.get('products.list', '/', async (ctx) => {
    const productsList = await ctx.orm.product.findAll();
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('products/index', {
        productsList,
        categoriesList,
        newProductPath: ctx.router.url('products.new'),
        editProductPath: (product) => ctx.router.url('products.edit', { id:product.id }),
        deleteProductPath: (product) => ctx.router.url('products.delete', { id:product.id }),
    });
});

router.get('products.new', '/new', async (ctx) => {
    const product = ctx.orm.product.build();
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('products/new', {
        categoriesList,
        product,
        submitProductPath: ctx.router.url('products.create'),
    });
});

router.get('products.edit', '/:id/edit', loadProduct, async (ctx) => {
    const { product } = ctx.state;
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('products/edit', {
      categoriesList,
      product,
      submitProductPath: ctx.router.url('products.update', { id: product.id }),
    });
  });

router.post('products.create', '/', async (ctx) => {
    const id = ctx.session.userId;
    const { name } = ctx.request.body;
    const { description } = ctx.request.body;
    const { size } = ctx.request.body;
    const { exchangePrice } = ctx.request.body;
    const { category } = ctx.request.body;
    const product = ctx.orm.product.build({
        name: name,
        description: description,
        size: size,
        status: 'available',
        exchangePrice: exchangePrice,
        categoryId: category,
        userId: id,
    });
    try {
        await product.save(
            {
                fields: [
                    'name',
                    'status',
                    'exchangePrice',
                    'description',
                    'size',
                    'userId',
                    'categoryId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.myProductsList'));
    } catch (validationError) {
        await ctx.render('products/new', {
            product,
            errors: validationError.errors,
            submitProductPath: ctx.router.url('products.create'),
        });
    }
});

router.patch('products.update', '/:id', loadProduct, async (ctx) => {
    const { product } = ctx.state;
    try {
        const {
            name,
            exchangePrice,
            description,
            size,
        } = ctx.request.body;
        await product.update({
            name,
            exchangePrice,
            description,
            size,
        });
        ctx.redirect(ctx.router.url('users.myProductsList'));
    } catch (validationError) {
        await ctx.render('products/edit', {
            product,
            errors: validationError.errors,
            submitProductPath: ctx.router.url('products.update'),

        });
    }
});

router.del('products.delete', '/:id', loadProduct, async (ctx) => {
    const { product } = ctx.state
    await product.destroy();
    ctx.redirect(ctx.router.url('users.myProductsList'))
});

module.exports = router;
