import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('t_student_teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 't_students',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    teacher_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 't_teachers',
        key: 'uuid',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    is_suspended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Optional: create unique constraint to avoid duplicate student-teacher pairs
  await queryInterface.addConstraint('t_student_teacher', {
    fields: ['student_uuid', 'teacher_uuid'],
    type: 'unique',
    name: 'unique_student_teacher_pair',
  });
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.dropTable('t_student_teacher');
};
