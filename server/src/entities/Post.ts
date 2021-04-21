import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Upvote from "./Upvote";
import User from "./User";

@Entity()
@ObjectType()
export default class Post extends BaseEntity{
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field()
  @Column()
  creatorId!: number

  @Field(()=> String)
  @Column()
  title!: string;

  @Field(()=> String)
  @Column()
  text!: string;

  @Field(()=> Int)
  @Column({type: 'int', default: 0})
  points: number

  @Field(()=> User)
  @ManyToOne(()=> User, user=>user.posts)
  creator: User;
  
  @OneToMany(()=> Upvote, upvote=>upvote.post)
  upvotes: Upvote[]
  
  @Field(()=> String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt = Date;

}