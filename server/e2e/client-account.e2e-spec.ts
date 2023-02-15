import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import ClientAccount from '../src/domain/client-account.entity';
import { ClientAccountService } from '../src/service/client-account.service';

describe('ClientAccount Controller', () => {
  let app: INestApplication;

  const authGuardMock = { canActivate: (): any => true };
  const rolesGuardMock = { canActivate: (): any => true };
  const entityMock: any = {
    id: 'entityId'
  };

  const serviceMock = {
    findById: (): any => entityMock,
    findAndCount: (): any => [entityMock, 0],
    save: (): any => entityMock,
    update: (): any => entityMock,
    delete: (): any => entityMock
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(AuthGuard)
      .useValue(authGuardMock)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuardMock)
      .overrideProvider(ClientAccountService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all client-accounts ', async () => {
    const getEntities: ClientAccount[] = (
      await request(app.getHttpServer())
        .get('/api/client-accounts')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET client-accounts by id', async () => {
    const getEntity: ClientAccount = (
      await request(app.getHttpServer())
        .get('/api/client-accounts/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create client-accounts', async () => {
    const createdEntity: ClientAccount = (
      await request(app.getHttpServer())
        .post('/api/client-accounts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update client-accounts', async () => {
    const updatedEntity: ClientAccount = (
      await request(app.getHttpServer())
        .put('/api/client-accounts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE client-accounts', async () => {
    const deletedEntity: ClientAccount = (
      await request(app.getHttpServer())
        .delete('/api/client-accounts/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
