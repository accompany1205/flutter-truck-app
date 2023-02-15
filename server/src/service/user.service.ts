import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import ClientAccount from '../domain/client-account.entity';
import TransporterAccount from '../domain/transporter-account.entity';
import { UserRepository } from '../repository/user.repository';
import { ClientAccountRepository } from '../repository/client-account.repository';
import { TransporterAccountRepository } from '../repository/transporter-account.repository';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { RoleType } from '../security/role-type';
import bcrypt from 'bcrypt';
import { exception } from 'console';
import { Payload } from 'src/security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { EmailVerificationEntity } from '../domain/email-verification.entity';
import { transporter } from '../shared/email-constants';
import { config } from '../config';


@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(ClientAccountRepository) private clientAccountRepository: ClientAccountRepository,
    @InjectRepository(TransporterAccountRepository) private transporterAccountRepository: TransporterAccountRepository,
    @InjectStripe() private readonly stripeClient: Stripe,
    @InjectRepository(EmailVerificationEntity) private readonly emailVerificationRepository: Repository<EmailVerificationEntity>,
  ) { }

  async findById(id: string, relations?: string[],): Promise<User | undefined> {

    var rel = ['authorities'];

    if (relations) {
      rel = relations;
      rel.push('authorities');
    }
    const result = await this.userRepository.findOne({ where: { id: id }, relations: rel });
    return this.flatAuthorities(result);
  }

  async AddBalance(userId: string, kilometers?: number, months?: number) {
    const transporterAccount = await this.transporterAccountRepository.findOne(userId);
    if (kilometers) {
      transporterAccount.balance += kilometers;
    } else if (months) {
      if (transporterAccount.endOfSubscription !== null) {
        transporterAccount.endOfSubscription = new Date(transporterAccount.endOfSubscription.setMonth(transporterAccount.endOfSubscription.getMonth() + months));
      } else {
        let currentDate: Date = new Date();
        currentDate.setMonth(currentDate.getMonth() + months);
        transporterAccount.endOfSubscription = currentDate;
      }
    }
    return await this.transporterAccountRepository.save(transporterAccount);
  }

  async findByfields(options: FindOneOptions<User>): Promise<User | undefined> {

    if (options.relations) {
      options.relations.push('authorities');
    } else {
      options.relations = ['authorities'];
    }

    const result = await this.userRepository.findOne(options);
    return this.flatAuthorities(result);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login: email } });
  }


  async find(options: FindManyOptions<User>): Promise<User | undefined> {
    const result = await this.userRepository.findOne(options);
    return this.flatAuthorities(result);
  }

  async findAndCount(options: FindManyOptions<User>): Promise<[User[], number]> {
    options.relations = ['authorities'];
    const resultList = await this.userRepository.findAndCount(options);
    const users: User[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(user => users.push(this.flatAuthorities(user)));
      resultList[0] = users;
    }
    return resultList;
  }

  async save(user: User): Promise<User | undefined> {
    user = this.convertInAuthorities(user);
    if (user.password) {
      user.password = await this.encryptPassword(user.password);
    } else if (user.dateOfBirth) {
      user.dateOfBirth = new Date(user.dateOfBirth);
    }
    const result = await this.userRepository.save(user);
    return this.flatAuthorities(result);
  }

  async saveClient(clientUser: ClientAccount): Promise<any | undefined> {
    clientUser.user.authorities = [{ name: RoleType.CLIENT }];
    clientUser.user.password = await this.encryptPassword(clientUser.user.password);
    clientUser.user.stripeId = (await this.stripeClient.customers.create({
      'email': clientUser.user.email,
      'name': clientUser.user.firstName + ' ' + clientUser.user.lastName
    })).id;
    try {
      clientUser.user = await this.userRepository.save(clientUser.user);
      clientUser.id = clientUser.user.id;
      const clientResult = await this.clientAccountRepository.save(clientUser);
      clientUser.id = clientUser.user.id;
      const payload: Payload = { id: clientUser.user.id, username: clientUser.user.login, authorities: [clientUser.user.authorities[0].name] };
      const id_token = this.jwtService.sign(payload);
      clientUser.user.authorities = [clientUser.user.authorities[0].name];
      return {
        id_token: id_token,
        user: clientResult.user
      };
    } catch (e) {
      throw new exception(e);
    }
  }

  async saveTransporter(transporterAccount: TransporterAccount): Promise<any | undefined> {
    transporterAccount.user.authorities = [{ name: RoleType.TRANSPORTER }];
    transporterAccount.user.activated = false;
    transporterAccount.user.verifiedPhone = false;
    transporterAccount.user.verifiedEmail = false;
    transporterAccount.balance = 0;
    transporterAccount.user.stripeId = (await this.stripeClient.customers.create({
      'email': transporterAccount.user.email,
      'name': transporterAccount.user.firstName + ' ' + transporterAccount.user.lastName
    })).id;
    try {
      transporterAccount.user = await this.save(transporterAccount.user);
      transporterAccount.id = transporterAccount.user.id;
      transporterAccount.balance = 0;
      const transporterResult = await this.transporterAccountRepository.save(transporterAccount);
      const payload: Payload = { id: transporterAccount.user.id, username: transporterAccount.user.login, authorities: [transporterAccount.user.authorities[0].name] };
      const id_token = this.jwtService.sign(payload);
      transporterAccount.user.authorities = [transporterAccount.user.authorities[0].name];
      return {
        id_token: id_token,
        user: transporterAccount.user
      }
    } catch (e) {
      throw new exception(e);
    }
  }

  async update(user: User): Promise<User | undefined> {
    return await this.save(user);
  }

  private async deleteComplete(user: User): Promise<User | undefined> {
    return await this.userRepository.remove(user);
  }

  async delete(user: User): Promise<User | undefined> {
    return await this.userRepository.softRemove(user);
  }

  private flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach(authority => authorities.push(authority.name));
      user.authorities = authorities;
    }
    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach(authority => authorities.push({ name: authority }));
      user.authorities = authorities;
    }
    return user;
  }

  // This is a public given authoritie
  private convertInAuthoritiesPublic(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      if (user.authorities == 'client') {
        authorities.push({ name: RoleType.CLIENT });
      } else if (user.authorities == 'transporter') {
        authorities.push({ name: RoleType.TRANSPORTER });
      } else if (user.authorities == 'driver') {
        authorities.push({ name: RoleType.DRIVER });
      } else {
        authorities.push({ name: RoleType.ADMIN });
      }

      user.authorities = authorities;
    }
    return user;
  }

  // The system administrater will only use this method to create users with any roles
  private convertInAuthoritiesSystemAdmin(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach(authority => authorities.push({ name: authority }));
      user.authorities = authorities;
    }
    return user;
  }

  private async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public comparePasswords(password, hashedPassword): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  async createEmailToken(email: string) {
    const emailVerification = await this.emailVerificationRepository.findOne({
      email,
    });

    if (!emailVerification) {
      const emailVerificationToken = await this.emailVerificationRepository.save(
        {
          email,
          emailToken: (
            Math.floor(Math.random() * 9000000) + 1000000
          ).toString(),
          timestamp: new Date(),
        },
      );
      return emailVerificationToken;
    }
    return false;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const emailVerif = await this.emailVerificationRepository.findOne({
      emailToken: token,
    });
    if (emailVerif && emailVerif.email) {
      const userFromDb = await this.findByEmail(emailVerif.email);
      if (userFromDb) {
        userFromDb.verifiedEmail = true;
        await this.update(userFromDb);
        await this.emailVerificationRepository.delete({ emailToken: token });
        return true;
      }
    } else {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmailVerification(email: string) {
    const repository = await this.emailVerificationRepository.findOne({
      email,
    });

    if (repository && repository.emailToken) {
      const mailOptions = {
        from: '"Lacus" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Account Activation',
        text: 'Activate account',
        html: `Hi! <br><br> Thanks for your registration<br><br>
          <a href='${config.get('app.ip')}:${config.get('app.port')}/api/lacus/email/verify/${repository.emailToken}'>Click here to activate your account</a>`,
      };

      return await this.sendEmail(mailOptions);
    } else {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }
  }

  async sendEmail(mailOptions) {
    return await new Promise<{}>(async (resolve, reject) => {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {

          console.log(
            `Error while sending message: ${error}`,
            'sendEmailVerification',
          );

          return reject(error);
        }
        console.log(`Send message: ${info.messageId}`, 'sendEmailVerification');
        resolve({ message: 'Successfully send email' });
      });
    });
  }
}
