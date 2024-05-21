import { AfterInsert, AfterRemove, AfterUpdate ,Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'; // All three things are decorators, these decorators are going to help TypeORM some different properties that we are going to add within our entity.
// import { Exclude } from 'class-transformer'; // It is a companion package for class validator..

import { Report } from 'src/reports/report.entity';


@Entity()
export class User {
    // We are going to list out all the different peoperties that a user have.
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    // @Exclude()
    password: string;

    @OneToMany( () => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with ID', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('Updated User With id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed user with Id',this.id);
    }
}