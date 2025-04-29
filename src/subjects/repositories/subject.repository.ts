import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SubjectEntity } from '../entities/subject.entity';
import { SubjectDto } from '../dto/subject.dto';

@Injectable()
export class SubjectRepository extends Repository<SubjectEntity> {
  constructor(private dataSource: DataSource) {
    super(SubjectEntity, dataSource.createEntityManager());
  }

  async createSubject(subjectDto: SubjectDto): Promise<SubjectEntity> {
    const subject = this.create(subjectDto);
    return await this.save(subject);
  }

  async getAllSubjects(): Promise<SubjectEntity[]> {
    return (await this.find()) || [];
  }

  async getSubjectById(id: number): Promise<SubjectEntity | null> {
    return await this.findOne({
      where: { id },
    });
  }

  async updateSubject(
    id: number,
    subjectDto: SubjectDto,
  ): Promise<SubjectEntity | null> {
    const result = await this.update(id, subjectDto);
    if (result.affected && result.affected > 0) {
      return this.findOne({ where: { id } });
    }
    return null;
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
