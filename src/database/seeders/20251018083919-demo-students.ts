import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert('t_students', [
    {
      uuid: '11111111-1111-1111-1111-111111111111',
      email: 'studentjon@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: '22222222-2222-2222-2222-222222222222',
      email: 'studenthon@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: '33333333-3333-3333-3333-333333333333',
      email: 'student3@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: '44444444-4444-4444-4444-444444444444',
      email: 'student4@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      uuid: '55555555-5555-5555-5555-555555555555',
      email: 'student5@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('t_students', {}, {});
}
