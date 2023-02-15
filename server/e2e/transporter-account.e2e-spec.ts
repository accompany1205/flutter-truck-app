import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import TransporterAccount from '../src/domain/transporter-account.entity';
import { TransporterAccountService } from '../src/service/transporter-account.service';

describe('TransporterAccount Controller', () => {
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
      .overrideProvider(TransporterAccountService)
      .useValue(serviceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET all transporter-accounts ', async () => {
    const getEntities: TransporterAccount[] = (
      await request(app.getHttpServer())
        .get('/api/transporter-accounts')
        .expect(200)
    ).body;

    expect(getEntities).toEqual(entityMock);
  });

  it('/GET transporter-accounts by id', async () => {
    const getEntity: TransporterAccount = (
      await request(app.getHttpServer())
        .get('/api/transporter-accounts/' + entityMock.id)
        .expect(200)
    ).body;

    expect(getEntity).toEqual(entityMock);
  });

  it('/POST create transporter-accounts', async () => {
    const createdEntity: TransporterAccount = (
      await request(app.getHttpServer())
        .post('/api/transporter-accounts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(createdEntity).toEqual(entityMock);
  });

  it('/PUT update transporter-accounts', async () => {
    const updatedEntity: TransporterAccount = (
      await request(app.getHttpServer())
        .put('/api/transporter-accounts')
        .send(entityMock)
        .expect(201)
    ).body;

    expect(updatedEntity).toEqual(entityMock);
  });

  it('/DELETE transporter-accounts', async () => {
    const deletedEntity: TransporterAccount = (
      await request(app.getHttpServer())
        .delete('/api/transporter-accounts/' + entityMock.id)
        .expect(204)
    ).body;

    expect(deletedEntity).toEqual({});
  });

  afterEach(async () => {
    await app.close();
  });
});
