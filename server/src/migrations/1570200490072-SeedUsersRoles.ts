import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import { RoleType } from 'src/security';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
  role1: Authority = { name: 'ROLE_ADMIN' };

  role2: Authority = { name: 'ROLE_USER' };

  role3: Authority = { name: 'ROLE_TRANSPORTER' };

  role4: Authority = { name: 'ROLE_DRIVER' };

  role5: Authority = { name: 'ROLE_SYSADMIN' };

  user1: User = {
    login: 'system',
    password: '$2y$10$b5eIbSoF7K/CXyBJ3/7gBOwRgTw.a/gsfb5ND90Cfv.x8KBNQzR1m',
    firstName: 'System',
    lastName: 'System',
    email: 'system@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
    phone: '0633044102',
    verifiedPhone: false,
    verifiedEmail: false,
    referal: '',
    referedBy: '',
    miniBio: '',
    dateOfBirth: new Date(),
    givenReputations: [],
    receivedReputations: [],
    stripeId: ''
  };

  user2: User = {
    login: 'anonymoususer',
    password: 'anonymoususer',
    firstName: 'Anonymous',
    lastName: 'User',
    email: 'anonymoususer@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
    phone: '0633044102',
    verifiedPhone: false,
    verifiedEmail: false,
    referal: '',
    referedBy: '',
    miniBio: '',
    dateOfBirth: new Date(),
    givenReputations: [],
    receivedReputations: [],
    stripeId: ''
  };

  user3: User = {
    login: 'admin',
    password: '$2b$10$koS.5su.IRTLnR1v3FqVHO0sl3HiZ9DuB7NL4OCQEJoSxMTl.M4N2',
    firstName: 'Administrator',
    lastName: 'Administrator',
    email: 'admin@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
    phone: '0633044102',
    verifiedPhone: false,
    verifiedEmail: false,
    referal: '',
    referedBy: '',
    miniBio: '',
    dateOfBirth: new Date(),
    givenReputations: [],
    receivedReputations: [],
    stripeId: ''
  };

  user4: User = {
    login: 'user',
    password: 'user',
    firstName: 'User',
    lastName: 'User',
    email: 'user@localhost.it',
    imageUrl: '',
    activated: true,
    langKey: 'en',
    createdBy: 'system',
    lastModifiedBy: 'system',
    phone: '0633044102',
    verifiedPhone: false,
    verifiedEmail: false,
    referal: '',
    referedBy: '',
    miniBio: '',
    dateOfBirth: new Date(),
    givenReputations: [],
    receivedReputations: [],
    stripeId: ''
  };

  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    await conn
      .createQueryBuilder()
      .insert()
      .into(Authority)
      .values([this.role1, this.role2, this.role3, this.role4, this.role5])
      .execute();

    await conn
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([this.user1, this.user2, this.user3, this.user4])
      .execute();

    await conn
      .createQueryBuilder()
      .relation(User, 'authorities')
      .of([this.user1, this.user3])
      .add([this.role1, this.role2]);

    await conn
      .createQueryBuilder()
      .relation(User, 'authorities')
      .of(this.user4)
      .add([this.role2]);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
