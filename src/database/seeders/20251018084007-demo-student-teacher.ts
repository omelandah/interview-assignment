import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert('t_student_teacher', [
    {
      id: 'b3b0c09e-6a6c-45a5-8cf5-b57b9a930f8f',
      student_uuid: '11111111-1111-1111-1111-111111111111',
      teacher_uuid: 'aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'e9a87f52-94b8-4a68-9e6e-2b6b3a25e72d',
      student_uuid: '33333333-3333-3333-3333-333333333333',
      teacher_uuid: 'bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('t_student_teacher', {}, {});
}
