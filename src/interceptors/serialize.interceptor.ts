// It is going to take an object and then serialize it eventually into JSON.
import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor {
    new(...args: any[]):{}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

// We make use of implements anytime that we want to create a new class that satisfies all the requirements of either an abstract class or an interface, in this case, an interface. So by adding on implements nest interceptor, TypeScript is going to check all the methods that exists in this interface.
export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto:any) {}
    intercept(context: ExecutionContext, handler: CallHandler):Observable<any> {
        // Run something before a request is handled by the request handler.
        console.log('I am running before the handler', context);
        return handler.handle().pipe(
            map((data:any) => {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}