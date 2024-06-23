'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      fullName: 'Admin',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'admin@gmail.com',
      phoneNumber: '0192338994',
      address: "Viet Name",
      dateOfBirth: new Date(),
      sex: "1",
      role_user: "1",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Amanda Harvey ',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'amanda@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "2",
      role_user: "1",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Anne Richard',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'anne@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "3",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'David Harrison',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'david@site.com',
      phoneNumber: '0988372663',
      address: 'Argentina',
      dateOfBirth: new Date(),
      sex: "3",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Finch Hoot',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'finch@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "1",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Bob Dean',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'bob@site.com',
      phoneNumber: '0988372663',
      address: 'Argentina',
      dateOfBirth: new Date(),
      sex: "1",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Ella Lauda',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'ella@site.com',
      phoneNumber: '0988372663',
      address: 'Austria',
      dateOfBirth: new Date(),
      sex: "2",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Lori Hunter',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'hunter@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "3",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Mark Colbert',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'mark@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "2",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Costa Quinn',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'costa@site.com',
      phoneNumber: '0988372663',
      address: 'Canada',
      dateOfBirth: new Date(),
      sex: "1",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      fullName: 'Rachel Doe',
      password: '$2b$10$htE9KQ9tpKNJyzps6bdhNutSEFZemiKWBuT2JrYUp0IjKWqGusJTO', /*12345678 */
      email: 'rachel@site.com',
      phoneNumber: '0988372663',
      address: 'United Kingdom',
      dateOfBirth: new Date(),
      sex: "1",
      role_user: "2",
      deleteFlg: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
