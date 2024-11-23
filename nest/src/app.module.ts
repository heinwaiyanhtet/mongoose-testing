import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:7TlCGQLpNtO1Kn1c19pIFXuuMea1Rt8Ljv6hA9fxGOOz6WxbHs5ezQnZXRbG4wZV@109.123.239.215:3000?directConnection=true'),
    CatsModule,
  ],
})

export class AppModule {}
