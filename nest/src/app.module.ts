import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { FamilyLinkModule } from './family-link/family-link.module';
import { ActivityModule } from './activity/activity.module';
import { ContactModule } from './contact/contact.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { EvidenceMarkModule } from './evidence-mark/evidence-mark.module';
import { EvidencePhotoModule } from './evidence-photo/evidence-photo.module';
import { EvidenceLocationModule } from './evidence-location/evidence-location.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PushModule } from './push/push.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: false,
      introspection: true,
      csrfPrevention: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({
        embed: true,
      })],
      context: ({ req }) => ({ req }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FamilyLinkModule,
    ActivityModule,
    ContactModule,
    ActivityLogModule,
    EvidenceMarkModule,
    EvidencePhotoModule,
    EvidenceLocationModule,
    PushModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}