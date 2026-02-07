import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Import your modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { GoodsModule } from './goods/goods.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // Don't throw error if .env is missing (Vercel uses env vars directly)
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        
        if (!uri) {
          console.error('MONGODB_URI is not defined!');
          throw new Error('MONGODB_URI environment variable is required');
        }
        
        console.log('Connecting to MongoDB...');
        console.log('URI starts with:', uri.substring(0, 20) + '...');
        
        return {
          uri,
          // Connection options for serverless
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          minPoolSize: 1,
        };
      },
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    VendorsModule,
    GoodsModule,
    AdminModule,
    UploadsModule,
  ],
})
// export class AppModule implements OnModuleInit {
//   private readonly logger = new Logger(AppModule.name);

//   async onModuleInit() {
//     this.logger.log('AppModule initialized successfully');
//   }
// }

export class AppModule  {}