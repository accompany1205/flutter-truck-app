import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormconfig } from './orm.config';
import { TransporterAccountModule } from './module/transporter-account.module';
import { ReputationModule } from './module/reputation.module';
import { ClientAccountModule } from './module/client-account.module';
import { IdentityModule } from './module/identity.module';
import { CommentsModule } from './module/comments.module';
import { TripModule } from './module/trip.module';
import { ChatModule } from './module/chat.module';
import { MatchModule } from './module/match.module';
import { TruckModule } from './module/truck.module';
import { DriverModule } from './module/driver.module';
import { RegionModule } from './module/region.module';
import { LocationModule } from './module/location.module';
import { ConversationModule } from './module/conversation.module';
import { LacusRegistrationModule } from './lacus/module/lacus.account.module';
import { PaymentModule } from './module/payment.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    TransporterAccountModule,
    ReputationModule,
    ClientAccountModule,
    IdentityModule,
    CommentsModule,
    TripModule,
    ChatModule,
    MatchModule,
    TruckModule,
    DriverModule,
    RegionModule,
    LocationModule,
    ConversationModule,
    LacusRegistrationModule,
    PaymentModule,
    // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
    // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
    // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ]
})
export class AppModule {}
