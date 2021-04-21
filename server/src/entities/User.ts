import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Post from "./Post";
import Upvote from "./Upvote";

@Entity()
@ObjectType()
export default class User extends BaseEntity{
  @Field(()=> Int)
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Field(()=> String)
  @Column({unique: true})
  username!: string;
  
  @Field(()=> String)
  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @OneToMany(()=> Post, post=>post.creator)
  posts: Post[]
  
  @OneToMany(()=> Upvote, upvote=>upvote.user)
  upvotes: Upvote[]

  @Field(()=> String)
  @CreateDateColumn()
  createdAt = Date;

  @Field(()=> String)
  @UpdateDateColumn()
  updatedAt = Date;
}