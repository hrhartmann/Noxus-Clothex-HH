const KoaRouter = require('koa-router');

const Sequelize = require("sequelize");
const router = new KoaRouter();

const Op = Sequelize.Op;


async function loadUser(ctx, next){
    ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
    return next();
}

router.get('users.list', '/', async (ctx) => {
    const usersList = await ctx.orm.user.findAll();
    await ctx.render('users/index', {
        usersList,
        newUserPath: ctx.router.url('users.new'),
        publicationsListPath: ctx.router.url('publications.list'),
        productsListPath: ctx.router.url('products.list'),
        apiMapUserPath: (user) => ctx.router.url('users.apiMap', {id: user.id}),
        showUserPath: (user) => ctx.router.url('users.show', { id:user.id }),
        editUserPath: (user) => ctx.router.url('users.edit', { id:user.id }),
        deleteUserPath: (user) => ctx.router.url('users.delete', { id:user.id }),
    });
});

router.get('users.new', '/new', async (ctx) => {
    const user = ctx.orm.user.build();
    await ctx.render('users/new', {
        user,
        submitUserPath: ctx.router.url('users.create'),
    });
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
    const { user } = ctx.state;
    await ctx.render('users/edit', {
      user,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),

    });
  });

router.get('users.getapiMap', '/:id/apiMap', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/api_map', {
    user,
    setCoordsUserPath: ctx.router.url('users.apiMap', {id: user.id})
  });
});

router.patch('users.apiMap', '/:id/apiMap', loadUser, async (ctx) => {
      const { user } = ctx.state;
      try {
          const {
              lat,
              long
          } = ctx.request.body;
          await user.update({
              lat,
              long
          });
          ctx.redirect(ctx.router.url('users.show', {id: user.id}));
      } catch (validationError) {
          await ctx.render('/apiMap', {
              user,
              errors: validationError.errors,
              setCoordsUserPath: ctx.router.url('users.apiMap', {id: user.id})

          });
      }
  });

router.post('users.create', '/', async (ctx) => {
    const user = ctx.orm.user.build(ctx.request.body);
    try {
        await user.save(
            {
                fields: [
                    'name',
                    'lastName',
                    'username',
                    'password',
                    'email',
                    'adress',
                    'phoneNumber',
                    'lat',
                    'long',
                ],
            },
        );
        ctx.redirect(ctx.router.url('session.new'));
    } catch (validationError) {
        await ctx.render('users/new', {
            user,
            errors: validationError.errors,
            submitUserPath: ctx.router.url('users.create'),
        });
    }
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
    const { user } = ctx.state;
    try {
        const {
            name,
            username,
            lastName,
            password,
            email,
            adress,
            phoneNumber,
            lat,
            long,
        } = ctx.request.body;
        await user.update({
            name,
            lastName,
            username,
            password,
            email,
            adress,
            phoneNumber,
            lat,
            long,
        });
        ctx.redirect(ctx.router.url('publications.list'));
    } catch (validationError) {
        await ctx.render('users/edit', {
            user,
            errors: validationError.errors,
            submitUserPath: ctx.router.url('users.update'),
        });
    }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
    const { user } = ctx.state
    await user.destroy();
    ctx.redirect(ctx.router.url('users.list'))
});

router.get('users.show', '/:id/show', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    const userPublicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    async function addObjects(array) {
        for (const publication of array) {
            publication.user = await ctx.orm.user.findByPk(publication.userId);
            publication.product = await ctx.orm.product.findByPk(publication.productId);
            publication.product.category = await ctx.orm.category.findByPk(publication.product.categoryId);
        }
    }
    await addObjects(userPublicationsList);
    await ctx.render('users/show', {
        user,
        userPublicationsList,
        productsListPath: ctx.router.url('products.list'),
        publicationsListPath: ctx.router.url('users.publicationsList', { id:user.id } ),
        favoritepublicationsPath: ctx.router.url('users.favoritepublications', {id:user.id} ),
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
        apiMapUserPath: (user) => ctx.router.url('users.getapiMap', {id: user.id}),
        editUserPath: (user) => ctx.router.url('users.edit', { id:user.id }),
        deleteUserPath: (user) => ctx.router.url('users.delete', { id:user.id }),
    });
});

router.get('users.publicationsList', '/:id/publicationsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.params.id);
    const publicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    await ctx.render('users/publicationsList', {
        user,
        publicationsList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
    });
});

router.get('users.myPublicationsList', '/myPublicationsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const publicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    async function addObjects(array) {
        for (const publication of array) {
            publication.user = await ctx.orm.user.findByPk(publication.userId);
            publication.product = await ctx.orm.product.findByPk(publication.productId);
            publication.product.category = await ctx.orm.category.findByPk(publication.product.categoryId);
        }
    }
    await addObjects(publicationsList);
    await ctx.render('users/publicationsList', {
        user,
        publicationsList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
    });
});


router.get('users.favoritePublicationsList', '/favoritePublicationsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const favoritepublicationlist = new Array();

    const favpublicationsList = await ctx.orm.favoritepublications.findAll( {where: {userId: user.id}})
    async function CreateFavoritePubList(array) {
        for (const favpub of array) {
            publication = await ctx.orm.publication.findByPk(favpub.publicationId);
            publication.favpub = await ctx.orm.favoritepublications.findByPk(favpub.id)
            favoritepublicationlist.push(publication)
        }
    }
    async function addObjects(array) {
        for (const publication of array) {
            publication.user = await ctx.orm.user.findByPk(publication.userId);
            publication.product = await ctx.orm.product.findByPk(publication.productId);
            publication.product.category = await ctx.orm.category.findByPk(publication.product.categoryId);

        }
    }
    await CreateFavoritePubList(favpublicationsList);
    await addObjects(favoritepublicationlist);
    await ctx.render('users/favoritePublicationsList', {
        user,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        productsListPath: ctx.router.url('products.list'),
        publicationsListPath: ctx.router.url('users.publicationsList', { id:user.id } ),
        favoritepublicationsPath: ctx.router.url('users.favoritepublications', {id:user.id} ),
        favpublicationsList,
        favoritepublicationlist,
        apiMapUserPath: (user) => ctx.router.url('users.getapiMap', {id: user.id}),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
        delfavpubPath: (favpubid) => ctx.router.url('favoritepublications.delete', { id:favpubid }),
    });
});


router.get('users.myProductsList', '/myProductsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const productsList = await ctx.orm.product.findAll( { where: { userId:user.id } } );
    const categoriesList = await ctx.orm.category.findAll();
    await ctx.render('users/productsList', {
        user,
        productsList,
        categoriesList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        newProductPath: ctx.router.url('products.new'),
        editProductPath: (product) => ctx.router.url('products.edit', { id:product.id }),
        showProductPath: (product) => ctx.router.url('products.show', { id:product.id }),
        deleteProductPath: (product) => ctx.router.url('products.delete', { id:product.id }),
    });
});

router.get('users.myMessagesList', '/myMessagesList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const messagesSendedList = await ctx.orm.message.findAll( {where: {senderUserId:user.id} });
    const messagesReceivedList = await ctx.orm.message.findAll({ where: {receiverUserId:user.id}});
    const messagesList = messagesSendedList.concat(messagesReceivedList).sort(function(a, b){return a.createdAt-b.createdAt});
    async function processArray(array) {
        for (const message of array) {
            message.sender = await ctx.orm.user.findByPk(message.senderUserId);
            message.receiver = await ctx.orm.user.findByPk(message.receiverUserId);
        }
    }
    await processArray(messagesList);
    await ctx.render('users/messagesList', {
        user,
        messagesSendedList,
        messagesList,
        messagesReceivedList,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        newMessagePath: ctx.router.url('messages.new'),
        senderPath: (message) => ctx.router.url('users.show', {id:message.sender.id}),
        receiverPath: (message) => ctx.router.url('users.show', {id:message.receiver.id}),
        editMessagePath: (message) => ctx.router.url('messages.edit', { id:message.id }),
        deleteMessagePath: (message) => ctx.router.url('messages.delete', { id:message.id }),
    });
});

router.get('users.myChatsList', '/myChatsList', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const chatsList = await ctx.orm.chat.findAll( { where: {
        [Op.and]:[
            {[Op.or]: [{userId:user.id}, {secondUserId:user.id}]}
        ]
        }}
    );
    async function processArray(array) {
        for (const chat of array) {
            chat.firstUser = await ctx.orm.user.findByPk(chat.userId);
            chat.secondUser = await ctx.orm.user.findByPk(chat.secondUserId);
        }
    }
    await processArray(chatsList)
    await ctx.render('users/chatsList', {
        user,
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        chatsList,
        firstUserProfilePath: (chat) => ctx.router.url('users.show', {id:chat.firstUser.id}),
        secondUserProfilePath: (chat) => ctx.router.url('users.show', {id:chat.secondUser}.id),
        showChatPath: (chat) => ctx.router.url('chats.show', { id:chat.id }),
        deleteChatPath: (chat) => ctx.router.url('chats.delete', { id:chat.id }),
    });
});

router.get('users.myProfilePage', '/show', async (ctx) => {
    const user = await ctx.orm.user.findByPk(ctx.session.userId);
    const userPublicationsList = await ctx.orm.publication.findAll( { where: { userId:user.id } } );
    async function addObjects(array) {
        for (const publication of array) {
            publication.user = await ctx.orm.user.findByPk(publication.userId);
            publication.product = await ctx.orm.product.findByPk(publication.productId);
            publication.product.category = await ctx.orm.category.findByPk(publication.product.categoryId);
        }
    }
    await addObjects(userPublicationsList);
    await ctx.render('users/show', {
        user,
        userPublicationsList,
        productsListPath: ctx.router.url('products.list'),
        publicationsListPath: ctx.router.url('users.publicationsList', { id:user.id } ),
        favoritepublicationsPath: ctx.router.url('users.favoritepublications', {id:user.id} ),
        userProfilePath: ctx.router.url('users.show', { id:user.id }),
        editPublicationPath: (publication) => ctx.router.url('publications.edit', { id:publication.id }),
        showPublicationPath: (publication) => ctx.router.url('publications.show', { id:publication.id }),
        deletePublicationPath: (publication) => ctx.router.url('publications.delete', { id:publication.id }),
        apiMapUserPath: (user) => ctx.router.url('users.getapiMap', {id: user.id}),
        editUserPath: (user) => ctx.router.url('users.edit', { id:user.id }),
        deleteUserPath: (user) => ctx.router.url('users.delete', { id:user.id }),
    });
});


module.exports = router;
