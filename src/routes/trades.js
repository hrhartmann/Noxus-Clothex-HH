const KoaRouter = require('koa-router');

const Sequelize = require("sequelize");
const router = new KoaRouter();

const Op = Sequelize.Op;

async function loadTrade(ctx, next){
    ctx.state.trade = await ctx.orm.trade.findByPk(ctx.params.id);
    return next();
}

router.get('trades.list', '/', async (ctx) => {
    const tradesList = await ctx.orm.trade.findAll();
    async function processArray(array) {
        for (const trade of array) {
            trade.tradeReceiver = await ctx.orm.user.findByPk(trade.firstUserId);
            trade.tradeMaker = await ctx.orm.user.findByPk(trade.secondUserId);
            trade.objectRequested = await ctx.orm.product.findByPk(trade.firstObjectId);
            trade.objectOffered = await ctx.orm.product.findByPk(trade.secondObjectId);
        }
    }
    await processArray(tradesList);
    await ctx.render('trades/index', {
        tradesList,
        tradeReceiverProfilePath: (trade) => ctx.router.url('users.show', { id:trade.firstUserId }),
        tradeMakerProfilePath: (trade) => ctx.router.url('users.show', { id:trade.secondUserId }),
        editTradePath: (trade) => ctx.router.url('trades.edit', { id:trade.id }),
        deleteTradePath: (trade) => ctx.router.url('trades.delete', { id:trade.id }),
    });
});

router.get('trades.new', '/newTrade/:publicationId/:firstObjectId/:userId', async (ctx) => {
    const trade = ctx.orm.trade.build();
    const publicationId = ctx.params.publicationId;
    const userId = ctx.params.userId;
    const firstObjectId = ctx.params.firstObjectId;
    const productsList = await ctx.orm.product.findAll( { where: {
        userId:ctx.session.userId, status: 'available' }});
    await ctx.render('trades/new', {
        trade,
        productsList,
        newProductPath: ctx.router.url('products.new'),
        newProductPath: ctx.router.url('products.new'),
        submitTradePath: ctx.router.url('trades.create', {
            publicationId: publicationId,
            userId: userId,
            firstObjectId: firstObjectId }),
    });
});

router.get('trades.edit', '/:id/edit', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    const productsList = await ctx.orm.product.findAll( { where: {
        userId:ctx.session.userId, status: 'available' }});
    await ctx.render('trades/edit', {
      trade,
      productsList,
      submitTradePath: ctx.router.url('trades.update', { id: trade.id }),
    });
  });

router.post('trades.create', '/:publicationId/:firstObjectId/:userId', async (ctx) => {
    const { shippingCost } = ctx.request.body;
    const { product } = ctx.request.body;
    const trade = ctx.orm.trade.build({
        shippingCost: shippingCost,
        firstUserId: ctx.params.userId,
        secondUserId: ctx.session.userId,
        publicationId: ctx.params.publicationId,
        firstObjectId: ctx.params.firstObjectId,
        secondObjectId: product,
        state: "requested",
    });
    try {
        await trade.save(
            {
                fields: [
                    'state',
                    'shippingCost',
                    'firstUserId',
                    'secondUserId',
                    'publicationId',
                    'firstObjectId',
                    'secondObjectId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('trades.notifications'));
    } catch (validationError) {
        await ctx.render('trades/new', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.create'),
        });
    }
});

router.patch('trades.update', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    try {
        const {
            state,
            shippingCost,
        } = ctx.request.body;
        await trade.update({
            state,
            shippingCost,
        });
        ctx.redirect(ctx.router.url('trades.list'));
    } catch (validationError) {
        await ctx.render('trades/edit', {
            trade,
            errors: validationError.errors,
            submitTradePath: ctx.router.url('trades.update'),
            
        });
    }
});

router.del('trades.delete', '/:id', loadTrade, async (ctx) => {
    const { trade } = ctx.state
    await trade.destroy();
    ctx.redirect(ctx.router.url('trades.notifications'))
});

async function checkTradeProducts(ctx, tradesList) {
    const newTradesList = [];
    for (const trade of tradesList) {
        let firstProduct = await ctx.orm.product.findByPk(trade.firstObjectId);
        let secondProduct = await ctx.orm.product.findByPk(trade.secondObjectId);
        if (firstProduct.status == "available" && secondProduct.status == "available") {
            newTradesList.push(trade);
        }
    }
    return newTradesList;
}

async function processTradeArray(array, ctx) {
    for (const trade of array) {
        const user = await ctx.orm.user.findByPk(ctx.session.userId);
        const tradeReceiver = await ctx.orm.user.findByPk(trade.firstUserId);
        const tradeMaker = await ctx.orm.user.findByPk(trade.secondUserId);
        const objectRequested = await ctx.orm.product.findByPk(trade.firstObjectId);
        const objectOffered = await ctx.orm.product.findByPk(trade.secondObjectId);
        trade.tradeReceiver = tradeReceiver;
        trade.tradeMaker = tradeMaker;
        trade.objectRequested = objectRequested;
        trade.objectOffered = objectOffered;
        trade.feedBackList = await ctx.orm.review.findAll({where: {tradeId:trade.id}})
        trade.chatExist = await ctx.orm.chat.findAll({where: {[Op.and]:
            {[Op.or]: [{userId:user.id, secondUserId:trade.tradeReceiver.id}, 
                {userId:trade.tradeReceiver.id, secondUserId:user.id}, 
                {userId:user.id, secondUserId:trade.tradeMaker.id}, 
                {userId:trade.tradeMaker.id, secondUserId:user.id}]},
        }})
    }
}

async function newTradesFormat(array, ctx) {
    const newTradeArray = [];
    for (const trade of array) {
        tradeReceiver = await ctx.orm.user.findByPk(trade.firstUserId);
        tradeMaker = await ctx.orm.user.findByPk(trade.secondUserId);
        objectRequested = await ctx.orm.product.findByPk(trade.firstObjectId);
        objectOffered = await ctx.orm.product.findByPk(trade.secondObjectId);
        if (trade.chatExist != 0){
            chatExist = '/goToChat';
        }
        else{
            chatExist = '';
        }
        let newTrade = {
            id: trade.id,
            createdAt: trade.createdAt,
            tradeReceiverId: tradeReceiver.id,
            tradeMakerId: tradeMaker.id,
            tradeReceiverName: tradeReceiver.name,
            tradeMakerName: tradeMaker.name,
            objectRequestedName: objectRequested.name,
            objectOfferedName: objectOffered.name,
            chatExist: chatExist
        };
        newTradeArray.push(newTrade);
    }
    return newTradeArray;
}

router.get('trades.notifications', '/notifications', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const allRequestedTradesList = await ctx.orm.trade.findAll( { where: { secondUserId:user.id,  state:'requested' } } );
    const allPendingTradesList = await ctx.orm.trade.findAll( { where: { firstUserId:user.id, state:'requested' } } );
    const requestedTradesList = await checkTradeProducts(ctx, allRequestedTradesList);
    const pendingTradesList = await checkTradeProducts(ctx, allPendingTradesList);
    const review = ctx.orm.review.build();
    const pastTradesList = await ctx.orm.trade.findAll( { where: {
        [Op.and]:[
            {[Op.or]: [{state:'accepted'}, {state:'rejected'}]},
            {[Op.or]: [{secondUserId:user.id}, {firstUserId:user.id}]}
        ]
        }}
    );
    await processTradeArray(requestedTradesList, ctx);
    await processTradeArray(pendingTradesList, ctx);
    await processTradeArray(pastTradesList, ctx);
    await ctx.render('trades/notifications', {
        requestedTradesList,
        pendingTradesList,
        user,
        pastTradesList,
        review,
        goToChatFromTradePath: (trade) => ctx.router.url('chats.goToChatFromTrade', {id:trade.id}) ,
        createChatFromTradePath: (trade) => ctx.router.url('chats.createFromTrade', {id: trade.id}),
        submitReviewPath: (trade) => ctx.router.url('reviews.createFromTrade', { id:trade.id }),
        tradeReceiverProfilePath: (trade) => ctx.router.url('users.show', { id:trade.firstUserId }),
        tradeMakerProfilePath: (trade) => ctx.router.url('users.show', { id:trade.secondUserId }),
        acceptTradePath: (trade) => ctx.router.url('trades.acceptOrRejectTrade', { decision:'accepted', id:trade.id }),
        rejectTradePath: (trade) => ctx.router.url('trades.acceptOrRejectTrade', { decision:'rejected', id:trade.id }),
    });
});

router.get('trades.requestedTrades', '/requestedTrades', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const allRequestedTradesList = await ctx.orm.trade.findAll( { where: { secondUserId:user.id,  state:'requested' } } );
    //const allPendingTradesList = await ctx.orm.trade.findAll( { where: { firstUserId:user.id, state:'requested' } } );
    const requestedTradesList = await checkTradeProducts(ctx, allRequestedTradesList);
    /*
    const pendingTradesList = await checkTradeProducts(ctx, allPendingTradesList);
    const review = ctx.orm.review.build();
    const pastTradesList = await ctx.orm.trade.findAll( { where: {
        [Op.and]:[
            {[Op.or]: [{state:'accepted'}, {state:'rejected'}]},
            {[Op.or]: [{secondUserId:user.id}, {firstUserId:user.id}]}
        ]
        }}
    );
    */
    await processTradeArray(requestedTradesList, ctx);
    const newTradeArray = await newTradesFormat(requestedTradesList, ctx);
    /*
    await processTradeArray(pendingTradesList, ctx);
    await processTradeArray(pastTradesList, ctx);
    */
    console.log(newTradeArray);
    ctx.body = newTradeArray;
});

router.get('trades.pendingTrades', '/pendingTrades', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const allPendingTradesList = await ctx.orm.trade.findAll( { where: { firstUserId:user.id, state:'requested' } } );
    const pendingTradesList = await checkTradeProducts(ctx, allPendingTradesList);
    await processTradeArray(pendingTradesList, ctx);
    const newTradeArray = await newTradesFormat(pendingTradesList, ctx);
    console.log(newTradeArray);
    ctx.body = newTradeArray;
})

router.get('trades.allTrades', '/allTrades', async (ctx) => {
    const allTradesList = await ctx.orm.trade.findAll( { where: { state:'requested' } } );
    const tradesList = await checkTradeProducts(ctx, allTradesList);
    await processTradeArray(tradesList, ctx);
    const newTradeArray = await newTradesFormat(tradesList, ctx);
    console.log(newTradeArray);
    ctx.body = newTradeArray;
})

async function changeProductsStatus(productsIds, ctx)
{   
    const status = 'exchanged';
    for (const productId of productsIds)
    {
        product = await ctx.orm.product.findByPk(productId);
        await product.update({
            status,
        });
    }
}

router.get('trades.acceptOrRejectTrade', '/:id/:decision', loadTrade, async (ctx) => {
    const { trade } = ctx.state;
    const state = ctx.params.decision;
    if (state == 'accepted') {
        await changeProductsStatus([trade.firstObjectId, trade.secondObjectId], ctx);
    }
    await trade.update({
        state,
    });
    ctx.redirect(ctx.router.url('trades.notifications'));
});

module.exports = router; 
