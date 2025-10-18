import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.bulkInsert('t_student_teacher', [
    {
      student_uuid: '11111111-1111-1111-1111-111111111111',
      teacher_uuid: 'aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      is_suspended: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      student_uuid: '33333333-3333-3333-3333-333333333333',
      teacher_uuid: 'bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      is_suspended: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('t_student_teacher', {}, {});
}
