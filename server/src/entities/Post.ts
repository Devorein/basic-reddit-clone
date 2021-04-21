import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export default class Post extends BaseEntity{
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field(()=> String)
  @Column()
  title!: string;

  @Field(()=> String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt = Date;

}