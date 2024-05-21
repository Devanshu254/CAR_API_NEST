// Inside this file we are going to create a class that lists all the different properties of incoming request that a user should have. We are also going to define some validation tools around it.
import {IsEmail, IsString} from 'class-validator';
export class CreateUserDto {
    // We expect an incoming request that is intended to create a user to have an email that is supposed to be an email of string and a password of string. 
    @IsEmail()
    email:string;

    @IsString()
    password:string;    
    // Now we will add class validator package so that with the help of that we can set some validation tools.
}