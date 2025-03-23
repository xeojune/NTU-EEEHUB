import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Post, PostSchema } from '../post/schemas/post.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminGuard } from '../guards/admin.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    AdminGuard,
    {
      provide: 'JWT_SECRET',
      useFactory: (configService: ConfigService) => configService.get('JWT_SECRET'),
      inject: [ConfigService],
    },
  ],
  exports: [AdminService, AdminGuard],
})
export class AdminModule {}