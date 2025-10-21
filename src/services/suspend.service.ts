import studentRepository from '../repositories/student.repository';

const suspendStudent = async (email: string): Promise<void> => {
  const student = await studentRepository.findStudentByEmail(email);
  if (!student) {
    throw new Error(`Student with email ${email} not found`);
  }

  if (student.isSuspended) {
    return;
  }

  await student.update({ isSuspended: true });
};

export default {
  suspendStudent,
};
