const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadMessage(ctx, next){
    ctx.state.message = await ctx.orm.message.findByPk(ctx.params.id);
    return next();
}

router.get('messages.list', '/', async (ctx) => {
    const messagesList = await ctx.orm.message.findAll();
    async function processArray(array) {
        for (const message of array) {
            message.sender = await ctx.orm.user.findByPk(message.senderUserId);
            message.receiver = await ctx.orm.user.findByPk(message.receiverUserId);
        }
    }
    await processArray(messagesList);
    await ctx.render('messages/index', {
        messagesList,
        newMessagePath: ctx.router.url('messages.new'),
        senderPath: (message) => ctx.router.url('users.show', {id:message.sender.id}),
        receiverPath: (message) => ctx.router.url('users.show', {id:message.receiver.id}),
        editMessagePath: (message) => ctx.router.url('messages.edit', { id:message.id }),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id:message.id }),
    });
});

router.get('messages.new', '/new', async (ctx) => {
    const message = ctx.orm.message.build();
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const userList = await ctx.orm.user.findAll({ where: !{ id: user.id } } );
    await ctx.render('messages/new', {
        userProfilePath: ctx.router.url('users.show', { id:ctx.session.userId  }),
        user,
        message,
        userList,
        submitMessagePath: ctx.router.url('messages.create'),
    });
});

router.get('messages.edit', '/:id/edit', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    await ctx.render('messages/edit', {
      message,
      submitMessagePath: ctx.router.url('messages.update', { id: message.id }),
    });
  });

router.post('messages.create', '/', async (ctx) => {
    const id = ctx.session.userId;
    const { content } = ctx.request.body;
    const { receiver } = ctx.request.body;
    const message = ctx.orm.message.build({
        senderUserId: id,
        content: content,
        receiverUserId: receiver,
    });
    try {
        await message.save(
            {
                fields: [
                    'senderUserId',
                    'content',
                    'receiverUserId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('users.myMessagesList'));
    } catch (validationError) {
        await ctx.render('messages/new', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.create'),
        });
    }
});

router.patch('messages.update', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state;
    try {
        const {
            content,
        } = ctx.request.body;
        await message.update({
            content,
        });
        ctx.redirect(ctx.router.url('users.myMessagesList'));
    } catch (validationError) {
        await ctx.render('messages/edit', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.update'),
            
        });
    }
});

router.del('messages.delete', '/:id', loadMessage, async (ctx) => {
    const { message } = ctx.state
    await message.destroy();
    ctx.redirect(ctx.router.url('users.myChatsList'))
});

router.get('messages.newFromChat', '/newChatMessage/:id', async (ctx) => {
    const message = ctx.orm.message.build();
    const chat = await ctx.orm.chat.findByPk(ctx.params.id)
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    await ctx.render('messages/newChatMessage', {
        userProfilePath: ctx.router.url('users.show', { id:ctx.session.userId  }),
        user,
        message,
        chat,
        submitMessagePath: ctx.router.url('messages.createFromChat', {id:chat.id}),
    });
});

router.post('messages.createFromChat', '/:id', async (ctx) => {
    const id = ctx.session.userId;
    const { content } = ctx.request.body;
    chat = await ctx.orm.chat.findByPk(ctx.params.id)
    if (chat.userId == id){
        receiver = chat.secondUserId;
    } else {
        receiver = chat.userId;
    }
    const message = ctx.orm.message.build({
        senderUserId: id,
        content: content,
        receiverUserId: receiver,
        chatId: chat.id,
    });
    try {
        await message.save(
            {
                fields: [
                    'senderUserId',
                    'content',
                    'receiverUserId',
                    'chatId',
                ],
            },
        );
        ctx.redirect(ctx.router.url('chats.show', {id:chat.id}));
    } catch (validationError) {
        await ctx.render('messages/new', {
            message,
            errors: validationError.errors,
            submitMessagePath: ctx.router.url('messages.create'),
            userProfilePath: ctx.router.url('users.show', { id:ctx.session.userId  }),
            message,
            chat,
            submitMessagePath: ctx.router.url('messages.createFromChat', {id:chat.id}),
        });
    }
});
module.exports = router;