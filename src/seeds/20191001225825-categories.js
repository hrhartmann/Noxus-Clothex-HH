module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   const categoriesData = [
      {
          name: 'Unkwon',
          description: 'Everything that does not belong to any category',
          createdAt: new Date(),
          updatedAt: new Date(),
      },
      {
          name: 'Underwear',
          description: 'The more personal type of clothes',
          createdAt: new Date(),
          updatedAt: new Date(),
      },
      {
        name: 'Suits',
        description: 'This could be better?',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Jackets and Coats',
        description: 'Winter is comming, grab your coat',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Trousers and shorts',
        description: 'They are fundamental, do not forget them',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Skirt and dresses',
        description: 'Ideals for any situation "Scotish Seal for approval"',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
