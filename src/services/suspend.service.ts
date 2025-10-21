import studentRepository from '../repositories/student.repository';

const suspendStudent = async (email: string): Promise<void> => {
  const student = await studentRepository.findStudentByEmail(email);
  if (!student) {
    throw new Error(`Student with email ${email} not found`);
  }

  await student.update({ isSuspended: true });
};

export default {
  suspendStudent,
};
