import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionBank } from 'src/entities/questionBank.entity';
import { HttpStatus } from 'src/global/globalEnum';
import { Repository } from 'typeorm';
import {
  AnswerBankDtoRequest,
  CreateTestTemplateRequest,
  PaginationResponse,
  PartDto,
  QuestionBankDtoRequest,
  QuestionWithAnswerDtoRequest,
  TestDtoRequest
} from './dto/testManagementDto';
import { formatDate } from 'src/utils/dateFormat';
import { AnswerBank } from 'src/entities/answerBank.entity';
import { QuestionType } from 'src/entities/questionType.entity';
import { Test } from 'src/entities/test.entity';
import { Skill } from 'src/entities/skill.entity';
import { TestQuestion } from 'src/entities/testQuestion.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { TypeOfTest } from 'src/entities/typeOfTest.entity';
import { Part } from 'src/entities/part.entity';

@Injectable()
export class TestManagementService {
  constructor(
    @InjectRepository(QuestionBank)
    private questionBankRepository: Repository<QuestionBank>,
    @InjectRepository(AnswerBank)
    private answerBankRepository: Repository<AnswerBank>,
    @InjectRepository(QuestionType)
    private questionTypeRepository: Repository<QuestionType>,
    @InjectRepository(Test) private testRepository: Repository<Test>,
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
    @InjectRepository(TestQuestion)
    private testQuestionRepository: Repository<TestQuestion>,
    @InjectRepository(TestSchedule)
    private testScheduleRepository: Repository<TestSchedule>,
    @InjectRepository(TypeOfTest)
    private typeOfTestRepository: Repository<TypeOfTest>,
    @InjectRepository(Part)
    private partRepository: Repository<Part>
  ) {}

  // Questions management

  async findAllQuestion(pageSize: number, pageNumber: number): Promise<any> {
    const page = pageNumber;
    const size = pageSize;
    const offset = (page - 1) * size;
    const questionBanks = await this.questionBankRepository.find({
      take: size,
      skip: offset
    });
    const result = questionBanks
      .map(item => {
        if (item.deleteAt == null) return { id: item.id, question: item.content };
      })
      .filter(item => item != null);

    const totalCount = await this.questionBankRepository.count();
    const totalPages = Math.ceil(totalCount / size);

    const response: PaginationResponse = {
      pageData: result,
      meta: {
        currentPage: Number(page),
        totalCount: totalCount,
        totalPages: totalPages,
        pageSize: Number(pageSize)
      }
    };
    return response;
  }

  public async findOneQuestion(id: number): Promise<any> {
    const foundInfo = await this.questionBankRepository
      .createQueryBuilder('questionBank')
      .leftJoinAndSelect('questionBank.questionType', 'type')
      .where('questionBank.id=:id', { id })
      .getOne();

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found questionBank with id ' + id,
        HttpStatus.ERROR
      );

    if (foundInfo.questionType.code == 'SQ' || foundInfo.questionType.code == 'WQ') {
      return {
        question: foundInfo.content
      };
    } else {
      const response = await this.answerBankRepository
        .createQueryBuilder('answerBank')
        .leftJoinAndSelect('answerBank.question', 'questionBank')
        .where('questionBank.id = :id', { id: id })
        .getMany();
      return {
        question: response[0].question.content,
        answers: response.map(item => ({
          id: item.id,
          content: item.content,
          isCorrect: item.isCorrect
        }))
      };
    }
  }

  addQuestion(createData: QuestionBankDtoRequest): Promise<any> {
    // const newQuestionBank = this.questionBankRepository.create({
    //   content: createData.content,
    //   questionType: createData.questionType,
    //   createAt: formatDate(new Date()),
    //   updateAt: formatDate(new Date()),
    //   deleteAt: null
    // });
    // return this.questionBankRepository.save(newQuestionBank);
    {
      createData;
    }
    return null;
  }

  addQuestionWithAnswers(createData: QuestionWithAnswerDtoRequest): Promise<any> {
    return Promise.all(
      createData.questions.map(async ques => {
        const questionType = await this.questionTypeRepository.findOneBy({
          id: ques.questionType
        });

        if (questionType.code == 'SQ' || questionType.code == 'WQ') {
          const temp = await this.questionBankRepository.create({
            content: ques.content,
            questionType: questionType,
            createAt: formatDate(new Date()),
            updateAt: formatDate(new Date()),
            deleteAt: null
          });

          const questionCreated = await this.questionBankRepository.save(temp);

          return {
            questionCreated
          };
        } else {
          const query = await this.questionBankRepository.create({
            content: ques.content,
            questionType: questionType,
            createAt: formatDate(new Date()),
            updateAt: formatDate(new Date()),
            deleteAt: null
          });

          const questionCreated = await this.questionBankRepository.save(query);

          const createAnswers = Promise.all(
            ques.answers.map(async ans => {
              const newAns = this.answerBankRepository.create({
                question: questionCreated,
                content: ans.content,
                isCorrect: ans.answerCorrect,
                createAt: formatDate(new Date()),
                updateAt: formatDate(new Date()),
                deleteAt: null
              });
              return await this.answerBankRepository.save(newAns);
            })
          );

          let questionIdResponse;
          let questionResponse = '';
          let answerResponses = [];

          await createAnswers.then(res => {
            questionIdResponse = res[0].question.id;
            questionResponse = res[0].question.content;
            answerResponses = res.map(item => ({
              id: item.id,
              content: item.content,
              isCorrect: item.isCorrect
            }));
          });

          return {
            questionIdResponse,
            questionResponse,
            answerResponses
          };
        }
      })
    );
  }

  async updateQuestion(id: number, updateData: QuestionBankDtoRequest): Promise<any> {
    // const foundInfo = await this.questionBankRepository.findOneBy({ id });

    // if (!foundInfo)
    //   throw new HttpException(
    //     'Cannot found questionBank with id ' + id,
    //     HttpStatus.ERROR
    //   );

    // const newData = {
    //   updateAt: formatDate(new Date()),
    //   createAt: foundInfo.createAt,
    //   content: updateData.content,
    //   questionType: updateData.questionType,
    //   deleteAt: updateData.deleteAt
    // };

    // await this.questionBankRepository.update({ id }, newData);

    // const updatedQuestionBank = await this.questionBankRepository.findOneBy({
    //   id
    // });

    return { id, updateData };
  }

  async removeQuestion(id: number): Promise<any> {
    const foundInfo = await this.questionBankRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found questionBank with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.questionBankRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.questionBankRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting questionBank with id ' + id,
        500
      );
    }

    return deletedData;
  }

  // Answer management

  async findAllAnswer(pageSize: number, pageNumber: number): Promise<any> {
    const page = pageNumber;
    const size = pageSize;
    const offset = (page - 1) * size;
    const answerBanks = await this.answerBankRepository.find({
      take: size,
      skip: offset
    });
    const result = answerBanks
      .map(item => {
        if (item.deleteAt == null)
          return { id: item.id, question: item.content, isCorrect: item.isCorrect };
      })
      .filter(item => item != null);
    const totalCount = await this.answerBankRepository.count();
    const totalPages = Math.ceil(totalCount / size);

    const response: PaginationResponse = {
      pageData: result,
      meta: {
        currentPage: Number(page),
        totalCount: totalCount,
        totalPages: totalPages,
        pageSize: Number(pageSize)
      }
    };
    return response;
  }

  public async findOneAnswer(id: number) {
    const foundInfo = await this.answerBankRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found answerBank with id ' + id, HttpStatus.ERROR);
    return this.answerBankRepository.findOneBy({ id });
  }

  async addAnswer(createData: AnswerBankDtoRequest): Promise<any> {
    const question = await this.questionBankRepository.findOneBy({
      id: createData.question
    });

    const newAnswerBank = this.answerBankRepository.create({
      content: createData.content,
      question: question,
      isCorrect: createData.isCorrect,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.answerBankRepository.save(newAnswerBank);
  }

  async updateAnswer(id: number, updateData: AnswerBankDtoRequest): Promise<any> {
    // const foundInfo = await this.answerBankRepository.findOneBy({ id });
    // const answer

    // if (!foundInfo)
    //   throw new HttpException('Cannot found answerBank with id ' + id, HttpStatus.ERROR);

    // const newData = {
    //   updateAt: formatDate(new Date()),
    //   createAt: foundInfo.createAt,
    //   content: updateData.content,
    //   question: updateData.question,
    //   isCorrect: updateData.isCorrect,
    //   deleteAt: updateData.deleteAt
    // };

    // await this.answerBankRepository.update({ id }, newData);

    // const updatedAnswerBank = await this.answerBankRepository.findOneBy({ id });
    id.toFixed();
    {
      updateData;
    }
    return null;
  }

  async removeAnswer(id: number): Promise<any> {
    const foundInfo = await this.answerBankRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found answerBank with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.answerBankRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.answerBankRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting answerBank with id ' + id,
        500
      );
    }

    return deletedData;
  }

  // For test common

  async getAnswerForQuestion(questionId: number[]): Promise<any> {
    const query = await Promise.all(
      questionId.map(async item => {
        const question = await this.answerBankRepository
          .createQueryBuilder('answerBank')
          .leftJoinAndSelect('answerBank.question', 'question')
          .where('question.id = :id', { id: item })
          .getMany();

        return {
          questionID: item,
          answers: [
            ...question.map(item => ({
              id: item.id,
              content: item.content,
              isCorrect: item.isCorrect
            }))
          ]
        };
      })
    );
    return query;
  }

  async getAnswerForTestQuestion(questionId: number[]): Promise<any> {
    const query = await Promise.all(
      questionId.map(async item => {
        const question = await this.answerBankRepository
          .createQueryBuilder('answerBank')
          .leftJoinAndSelect('answerBank.question', 'question')
          .where('question.id = :id', { id: item })
          .getMany();

        return {
          questionID: item,
          answers: [
            ...question.map(item => ({
              id: item.id,
              content: item.content
            }))
          ]
        };
      })
    );
    return query;
  }

  async getAllTypeOfQuestion(): Promise<any> {
    const query = await this.questionTypeRepository
      .createQueryBuilder('questionType')
      .getMany();
    return query.map(item => ({
      id: item.id,
      questionType: item.typeName,
      code: item.code
    }));
  }

  async getAllTypeOfTest(): Promise<any> {
    return await this.typeOfTestRepository.find();
  }

  async getAllSkill(): Promise<any> {
    const query = await this.skillRepository.createQueryBuilder('skill').getMany();
    return query.map(item => ({
      id: item.id,
      skillName: item.skillName,
      code: item.code
    }));
  }

  async viewATest(testID: number): Promise<any> {
    const query = await this.testQuestionRepository
      .createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.test', 'test')
      .leftJoinAndSelect('test.type', 'type')
      .leftJoinAndSelect('testQuestion.question', 'question')
      .leftJoinAndSelect('question.questionType', 'questionType')
      .leftJoinAndSelect('testQuestion.part', 'part')
      .leftJoinAndSelect('part.skill', 'skill')
      .where('test.id =:id', { id: testID })
      .andWhere('testQuestion.deleteAt IS NULL')
      .getMany();

    const result: Record<string, Record<string, any>> = {};

    query.forEach(item => {
      const skillName = item.part.skill.code;
      const partID = item.part.id;
      const questionId = item.question.id;
      // const questionContent = item.question.content;
      // const questionType = item.question.questionType.code;
      const partData = item.part.data;
      const partDescription = item.part.description;

      if (!result[skillName]) {
        result[skillName] = {};
      }

      if (!result[skillName]['part']) {
        result[skillName]['part'] = {
          partData,
          partDescription
        };
      }

      if (!result[skillName]['part'][partID]) {
        result[skillName]['part'][partID] = { question: [] };
      }

      result[skillName]['part'][partID]['question'].push(
        questionId
        // {
        //   questionId,
        //   questionContent,
        //   questionType
        // }
      );
    });

    return query.length != 0
      ? {
          testId: query[0].test.id,
          testName: query[0].test.testName,
          testType: query[0].test.type.typeName,
          testTypeCode: query[0].test.type.code,
          totalQuestion: query.length,
          details: result
        }
      : null;
  }

  // Tests management

  async findAllTest(pageSize: number, pageNumber: number): Promise<any> {
    const page = pageNumber;
    const size = pageSize;
    const offset = (page - 1) * size;

    const query = await this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.type', 'typeOfTest')
      .take(size)
      .skip(offset)
      .getMany();

    const tests = query
      .filter(item => item.deleteAt == null)
      .map(item => ({
        testID: item.id,
        testName: item.testName,
        time: item.totalTime,
        type: item.type.typeName,
        typeCode: item.type.code
      }));

    const totalCount = await this.testRepository.count();
    const totalPages = Math.ceil(totalCount / size);

    const response: PaginationResponse = {
      pageData: tests,
      meta: {
        currentPage: Number(page),
        totalCount: totalCount,
        totalPages: totalPages,
        pageSize: Number(pageSize)
      }
    };
    return response;
  }

  async findAllTestOfClass(classID: number): Promise<any> {
    const query = await this.testScheduleRepository
      .createQueryBuilder('testSchedule')
      .leftJoinAndSelect('testSchedule.test', 'test')
      .leftJoinAndSelect('test.type', 'typeOfTest')
      .where('testSchedule.classId = :id', { id: classID })
      .getMany();

    const response = query
      .filter(item => item.deleteAt == null)
      .map(item => ({
        testID: item.test.id,
        testName: item.test.testName,
        time: item.test.totalTime,
        type: item.test.type.typeName,
        typeCode: item.test.type.code,
        startDate: item.startDate,
        endDate: item.endDate
      }));

    return response;
  }

  public async findOneTest(id: number) {
    const foundInfo = await this.testRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);
    return await this.testRepository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.type', 'typeOfTest')
      .where({ id: id })
      .getOne();
  }

  addTest(createData: TestDtoRequest) {
    const newTest = this.testRepository.create({
      testName: createData.testName,
      type: createData.type,
      createBy: createData.createBy,
      updateBy: createData.createBy,
      totalTime: createData.totalTime,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.testRepository.save(newTest);
  }

  async updateTest(id: number, updateData: TestDtoRequest) {
    const foundInfo = await this.testRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      testName: updateData.testName,
      type: updateData.type,
      createBy: updateData.createBy,
      updateBy: updateData.createBy,
      totalTime: updateData.totalTime
    };

    await this.testRepository.update({ id }, newData);

    const updatedTest = await this.testRepository.findOneBy({ id });

    return updatedTest;
  }

  async removeTest(id: number) {
    const foundInfo = await this.testRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.testRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.testRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting test with id ' + id, 500);
    }

    return deletedData;
  }

  //
  async addPart(createData: PartDto) {
    const skill = await this.skillRepository.findOneBy({ id: createData.skill });

    const newTest = await this.partRepository.create({
      partName: createData.partName,
      data: createData.data,
      index: createData.index,
      description: createData.description,
      file: createData.file,
      skill: skill,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return await this.partRepository.save(newTest);
  }

  async addTestTemplate(createData: CreateTestTemplateRequest) {
    let response = null;
    createData.testSkillQuestion.forEach(tq => {
      tq.skillQuestion.forEach(sq => {
        const res = Promise.all(
          sq.question.map(async q => {
            const question = await this.questionBankRepository
              .createQueryBuilder('questionBank')
              .leftJoinAndSelect('questionBank.questionType', 'questionType')
              .where({ id: q })
              .getOne();

            const test = await this.testRepository.findOneBy({ id: createData.testID });
            const part = await this.partRepository.findOneBy({ id: sq.partID });

            const newTestQuestion = await this.testQuestionRepository.create({
              test: test,
              question: question,
              part: part,
              type: question.questionType,
              createAt: formatDate(new Date()),
              updateAt: formatDate(new Date()),
              deleteAt: null
            });
            return this.testQuestionRepository.save(newTestQuestion);
          })
        );
        response = res.then(res => (response = res));
      });
    });

    return await response;
  }

  async editTestTemplate(createData: CreateTestTemplateRequest) {
    await this.testQuestionRepository
      .createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.test', 'test')
      .update(TestQuestion)
      .set({ deleteAt: formatDate(new Date()) })
      .where('test.id = :id', { id: createData.testID })
      .andWhere('testQuestion.deleteAt IS NULL')
      .execute();

    return await this.addTestTemplate(createData);
  }
}
