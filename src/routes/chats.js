const KoaRouter = require('koa-router');

const router = new KoaRouter();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

async function loadChat(ctx, next){
    ctx.state.chat = await ctx.orm.chat.findByPk(ctx.params.id);
    return next();
}

router.get('chats.list', '/', async (ctx) => {
    const chatsList = await ctx.orm.chat.findAll();
    await ctx.render('chats/index', {
        chatsList,
        newChatPath: ctx.router.url('chats.new'),
        editChatPath: (chat) => ctx.router.url('chats.edit', { id:chat.id }),
        deleteChatPath: (chat) => ctx.router.url('chats.delete', { id:chat.id }),
    });
});

router.get('chats.new', '/new', async (ctx) => {
    const chat = ctx.orm.chat.build();
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const userList = await ctx.orm.user.findAll({ where: !{ id: user.id } } );
    await ctx.render('chats/new', {
        userProfilePath: ctx.router.url('users.show', { id:ctx.session.userId  }),
        user,
        chat,
        userList,
        submitChatPath: ctx.router.url('chats.create'),
    });
});

router.get('chats.edit', '/:id/edit', loadChat, async (ctx) => {
    const { chat } = ctx.state;
    await ctx.render('chats/edit', {
      chat,
      submitChatPath: ctx.router.url('chats.update', { id: chat.id }),
    });
  });

router.post('chats.create', '/', async (ctx) => {
    const id = ctx.session.userId;
    const { second } = ctx.request.body;
    const chat = ctx.orm.chat.build({
        userId: id,
        secondUserId: second,
    });
    try {
        await chat.save(
            {
                fields: [
                    'userId',
                    'secondUserId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.mychatsList'));
    } catch (validationError) {
        await ctx.render('chats/new', {
            chat,
            errors: validationError.errors,
            submitChatPath: ctx.router.url('chats.create'),
        });
    }
});

router.patch('chats.update', '/:id', loadChat, async (ctx) => {
    const { chat } = ctx.state;
    try {
        const {
        } = ctx.request.body;
        await chat.update({
            content,
        });
        ctx.redirect(ctx.router.url('users.mychatsList'));
    } catch (validationError) {
        await ctx.render('chats/edit', {
            chat,
            errors: validationError.errors,
            submitChatPath: ctx.router.url('chats.update'),
            
        });
    }
});

router.del('chats.delete', '/:id', loadChat, async (ctx) => {
    const { chat } = ctx.state
    await chat.destroy();
    ctx.redirect(ctx.router.url('chats.list'))
});

router.get('chats.show', '/:id/show', async(ctx) =>{
    const chat = await ctx.orm.chat.findByPk(ctx.params.id);
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const messagesSendedList = await ctx.orm.message.findAll( {where: {senderUserId:user.id, chatId:chat.id} });
    const messagesReceivedList = await ctx.orm.message.findAll({ where: {receiverUserId:user.id, chatId:chat.id}});
    const messagesList = messagesSendedList.concat(messagesReceivedList).sort(function(a, b){return a.createdAt-b.createdAt});
    async function processArray(array) {
        for (const message of array) {
            message.sender = await ctx.orm.user.findByPk(message.senderUserId);
            message.receiver = await ctx.orm.user.findByPk(message.receiverUserId);
        }
    }
    await processArray(messagesList)
    await ctx.render('chats/show', {
        user,
        chat,
        messagesList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        newMessagePath: ctx.router.url('messages.newFromChat', {id:chat.id}),
        senderProfilePath: (message) => ctx.router.url('users.show', {id:message.senderUserId}),
        receiverProfilePath: (message) => ctx.router.url('users.show', {id:message.receiverUserId}),
        editMessagePath: (message) => ctx.router.url('messages.edit', { id:message.id }),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id:message.id }),
    })
})

router.get('chats.createFromTrade', '/:id', async(ctx) => {
    const trade = await ctx.orm.trade.findByPk(ctx.params.id);
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    console.log("createFromTrade")
    async function getUsers(user) {
        if (user.id != trade.secondUserId){
            secondUser = await trade.secondUserId;
        } else {
            secondUser = await trade.firstUserId;
        }
    }
    await getUsers(user)
    const chat = ctx.orm.chat.build({
        userId: user.id,
        secondUserId: secondUser,
    });
    try {
        await chat.save(
            {
                fields: [
                    'userId',
                    'secondUserId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.myChatsList'));
    } catch (validationError) {
        await ctx.render('chats/new', {
            chat,
            errors: validationError.errors,
            submitChatPath: ctx.router.url('chats.create'),
        });
    }
});


router.get('chats.goToChatFromTrade', '/goToChat/:id', async(ctx) => {
    const trade = await ctx.orm.trade.findByPk(ctx.params.id);
    const firstUser = await trade.firstUserId;
    const secondUser = await trade.secondUserId;
    const chat = await ctx.orm.chat.findAll({where: {
        [Op.and]:[
            {[Op.or]: [{userId:firstUser, secondUserId: secondUser}, {userId:secondUser, secondUserId:firstUser}]}]
    }})
    ctx.redirect(ctx.router.url('chats.show',{id:chat[0].id}));
});

module.exports = router;