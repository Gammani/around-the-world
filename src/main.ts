import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './infrastructure/exception-filters/http-exception-filter';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        console.log(errors);

        const errorsForResponse: any = [];

        errors.forEach((e: any) => {
          const constraintKeys: any = Object.keys(e.constraints);
          constraintKeys.forEach((key) => {
            errorsForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
