import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('t_student_teacher', 'is_suspended');
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.addColumn('t_student_teachers', 'is_suspended', {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  });
}
