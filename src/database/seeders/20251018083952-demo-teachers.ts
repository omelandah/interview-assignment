import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert('t_teachers', [
    {
      uuid: 'aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      email: 'teacher1@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: 'bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      email: 'teacher2@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: 'ccccccc-cccc-cccc-cccc-cccccccccccc',
      email: 'teacher3@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('t_teachers', {}, {});
}
