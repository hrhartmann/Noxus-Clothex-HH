const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadCategory(ctx, next){
    ctx.state.category = await ctx.orm.category.findByPk(ctx.params.id);
    return next();
}

router.get('categories.list', '/', async (ctx) => {
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('categories/index', {
        categoriesList,
        newCategoryPath: ctx.router.url('categories.new'),
        editCategoryPath: (category) => ctx.router.url('categories.edit', { id:category.id }),
        deleteCategoryPath: (category) => ctx.router.url('categories.delete', { id:category.id }),
    });
});

router.get('categories.new', '/new', async (ctx) => {
    const category = ctx.orm.category.build();
    await ctx.render('categories/new', {
        category,
        submitCategoryPath: ctx.router.url('categories.create'),
    });
});

router.get('categories.edit', '/:id/edit', loadCategory, async (ctx) => {
    const { category } = ctx.state;
    await ctx.render('categories/edit', {
      category,
      submitCategoryPath: ctx.router.url('categories.update', { id: category.id }),
    });
  });

router.post('categories.create', '/', async (ctx) => {
    const category = ctx.orm.category.build(ctx.request.body);
    try {
        await category.save(
            {
                fields: [
                    'name',
                    'description',
                ],
            },
        );
        ctx.redirect(ctx.router.url('categories.list'));
    } catch (validationError) {
        await ctx.render('categories/new', {
            category,
            errors: validationError.errors,
            submitCategoryPath: ctx.router.url('categories.create'),
        });
    }
});

router.patch('categories.update', '/:id', loadCategory, async (ctx) => {
    const { category } = ctx.state;
    try {
        const {
            name,
            description,
        } = ctx.request.body;
        await category.update({
            name,
            description,
        });
        ctx.redirect(ctx.router.url('categories.list'));
    } catch (validationError) {
        await ctx.render('categories/edit', {
            category,
            errors: validationError.errors,
            submitCategoryPath: ctx.router.url('categories.update'),
            
        });
    }
});

router.del('categories.delete', '/:id', loadCategory, async (ctx) => {
    const { category } = ctx.state
    productList = await ctx.orm.product.findAll({where: {categoryId: category.id}});
    async function changeObjectsCategory(array) {
        for (const product of array) {
            product.categoryId = 1;
            categoryId = product.categoryId;
            try{
                await product.update({
                    categoryId
                });
            } catch (validationError) {
                await ctx.render('categories/edit', {
                    category,
                    errors: validationError.errors,
                    submitCategoryPath: ctx.router.url('categories.update'),
                });
            }
        } 
    }
    await changeObjectsCategory(productList);
    await category.destroy();
    ctx.redirect(ctx.router.url('categories.list'))
});


router.get('categories.listall', '/listAll', async (ctx) => {
    const categoriesList = await ctx.orm.category.findAll();
    ctx.body = await categoriesList;
});

module.exports = router;