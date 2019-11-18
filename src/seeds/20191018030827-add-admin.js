module.exports = {
  up: (queryInterface, Sequelize) => {
  const usersData = [
      {
        name: "Admin",
        username: "Admin",
        password: "defaultclothex",
        email: "default@clothex.cl",
        adress: "none",
        phoneNumber: "99029220",
        category: "Admin",
        reputation: 5,
        lat: 0,
        long: 0,  
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: "Vicente",
        lastName:"Aguilera",
        username: "Vjaguilera",
        password: "asdqwe123",
        email: "vjaguilera@uc.cl",
        adress: "none",
        phoneNumber: "99029220",
        category: "Admin",
        reputation: 5,
        lat: 0,
        long: 0,  
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: "Andrés",
        lastName: "Pincheira",
        username: "PanchoVilla",
        password: "1234",
        email: "arpincheira@uc.cl",
        adress: "none",
        phoneNumber: 99029220,
        category: "Admin",
        reputation: 5,
        lat: 0,
        long: 0,  
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: "Sebastián",
        lastName:"Carreno",
        username: "Secarreno",
        password: "defaultclothex",
        email: "secarreno@clothex.cl",
        adress: "none",
        phoneNumber: 99029220,
        category: "Admin",
        reputation: 5,
        lat: 0,
        long: 0,  
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: "Hans",
        lastName:"Hartmann",
        username: "HH",
        password: "defaultclothex",
        email: "hrhartmann@clothex.cl",
        adress: "none",
        phoneNumber: 99029220,
        category: "Admin",
        reputation: 5,
        lat: 0,
        long: 0,  
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
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
