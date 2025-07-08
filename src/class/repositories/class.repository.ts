import { Repository, DataSource, DeleteResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ClassEntity } from '../entities/class.entity';
import { ClassDto } from '../dto/class.dto';
import { AccountEntity } from '../../accounts/entities/account.entity';
import { SubjectEntity } from '../../subjects/entities/subject.entity';
import { ClassFileEntity } from '../entities/class-file.entity';

@Injectable()
export class ClassRepository extends Repository<ClassEntity> {
  constructor(private dataSource: DataSource) {
    super(ClassEntity, dataSource.createEntityManager());
  }

  async createClass(classDto: ClassDto): Promise<ClassEntity> {
    const classEntity = new ClassEntity();
    classEntity.className = classDto.className || '';

    // Get subject by name
    if (classDto.subject) {
      const subjectRepository = this.dataSource.getRepository(SubjectEntity);
      const subject = await subjectRepository.findOne({
        where: { subjectName: classDto.subject },
      });
      if (subject) {
        classEntity.subject = subject;
      }
    }

    classEntity.startDate = classDto.startDate || '';
    classEntity.schedule = classDto.schedule || '';
    classEntity.room = classDto.room || '';

    // Save class first to get ID
    const savedClass = await this.save(classEntity);

    // Handle teacher
    if (classDto.teacher) {
      const accountRepository = this.dataSource.getRepository(AccountEntity);
      const teacher = await accountRepository.findOne({
        where: { codeID: classDto.teacher.codeID },
      });
      if (teacher) {
        savedClass.teacher = teacher;
      }
    }

    // Handle students
    if (classDto.students && classDto.students.length > 0) {
      const accountRepository = this.dataSource.getRepository(AccountEntity);
      const students = await Promise.all(
        classDto.students.map(async (student) => {
          return await accountRepository.findOne({
            where: { codeID: student.codeID },
          });
        }),
      );
      savedClass.students = students.filter((student) => student !== null);
    }

    // Handle files
    if (classDto.files && classDto.files.length > 0) {
      const fileRepository = this.dataSource.getRepository(ClassFileEntity);
      for (const fileDto of classDto.files) {
        const file = new ClassFileEntity();
        file.name = fileDto.name || '';
        file.url = fileDto.url || '';
        file.class = savedClass;
        await fileRepository.save(file);
      }
    }

    return await this.save(savedClass);
  }

  async getAllClasses(): Promise<ClassEntity[]> {
    return await this.find({
      relations: ['teacher', 'students', 'subject', 'files'],
    });
  }

  async getClassById(classId: number): Promise<ClassEntity | null> {
    return await this.findOne({
      where: { classId },
      relations: ['teacher', 'students', 'subject', 'files'],
    });
  }

  async updateClass(
    classId: number,
    classDto: ClassDto,
  ): Promise<ClassEntity | null> {
    const classEntity = await this.findOne({
      where: { classId },
      relations: ['teacher', 'students', 'subject', 'files'],
    });

    if (!classEntity) {
      return null;
    }

    if (classDto.className) {
      classEntity.className = classDto.className;
    }

    if (classDto.subject) {
      const subjectRepository = this.dataSource.getRepository(SubjectEntity);
      const subject = await subjectRepository.findOne({
        where: { subjectName: classDto.subject },
      });
      if (subject) {
        classEntity.subject = subject;
      }
    }

    if (classDto.startDate) {
      classEntity.startDate = classDto.startDate;
    }

    if (classDto.schedule) {
      classEntity.schedule = classDto.schedule;
    }

    if (classDto.room) {
      classEntity.room = classDto.room;
    }

    if (classDto.teacher) {
      const accountRepository = this.dataSource.getRepository(AccountEntity);
      const teacher = await accountRepository.findOne({
        where: { codeID: classDto.teacher.codeID },
      });
      if (teacher) {
        classEntity.teacher = teacher;
      }
    }

    if (classDto.students) {
      const accountRepository = this.dataSource.getRepository(AccountEntity);
      const students = await Promise.all(
        classDto.students.map(async (student) => {
          return await accountRepository.findOne({
            where: { codeID: student.codeID },
          });
        }),
      );
      classEntity.students = students.filter((student) => student !== null);
    }

    // Handle files updates
    if (classDto.files && classDto.files.length > 0) {
      const fileRepository = this.dataSource.getRepository(ClassFileEntity);
      for (const fileDto of classDto.files) {
        if (!fileDto.id) {
          const newFile = new ClassFileEntity();
          newFile.name = fileDto.name || '';
          newFile.url = fileDto.url || '';
          newFile.class = classEntity;
          await fileRepository.save(newFile);
        }
      }
      classEntity.files = await fileRepository.find({
        where: { class: { classId } },
        relations: ['class'],
      });
    }

    return await this.save(classEntity);
  }

  async deleteClass(classId: number): Promise<DeleteResult> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('class_files')
      .where('classId = :classId', { classId })
      .execute();

    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('classes')
      .where('classId = :classId', { classId })
      .execute();
  }
}
