import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { applyAppSettings } from '../src/settings/apply-app-setting';
import { UsersRepository } from '../src/features/users/infrastructure/users.repository';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Применяем все настройки приложения (pipes, guards, filters, ...)
    applyAppSettings(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  // it('should create new comment from correct input data', async () => {
  //   const usersRepository = app.get<UsersRepository>(UsersRepository);
  //   const foundUser = await usersRepository.findUserByLogin("Leha")
  //   const accessTokenByUserId = await jwtService.createAccessJWT(foundUser!._id.toString())
  //   // const userId = foundUser!._id.toString()
  //   // const accessTokenByUserId = await jwt.sign({userId}, settings.JWT_SECRET, {expiresIn: '600000'})
  //   const foundPost = await postsQueryMongooseRepository.findPostByTitle("new title post")
  //   const res_ = await request(app)
  //     .post(`/posts/${foundPost!._id}/comments`)
  //     .set('Authorization', `Bearer ${accessTokenByUserId}`)
  //     .send({
  //       "content": "content for new comment"
  //     })
  //     .expect(HTTP_STATUSES.CREATED_201)
  //   expect({
  //     id: expect(res_.body.id).toEqual(expect.any(String)),
  //     content: expect(res_.body.content).toEqual("content for new comment"),
  //     commentatorInfo: {
  //       userId: expect(res_.body.commentatorInfo.userId).toEqual(foundUser!._id.toString()),
  //       userLogin: expect(res_.body.commentatorInfo.userLogin).toEqual("Leha")
  //     },
  //     createdAt: expect(res_.body.createdAt).toEqual(expect.any(String)),
  //     likesInfo: {
  //       likesCount: expect(res_.body.likesInfo.likesCount).toEqual(0),
  //       dislikesCount: expect(res_.body.likesInfo.dislikesCount).toEqual(0),
  //       myStatus: expect(res_.body.likesInfo.myStatus).toEqual("None")
  //     }
  //   })
});
