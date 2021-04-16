import argon2 from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql';
import User from '../entities/User';
import { Context } from '../types';

@InputType()
class UsernamePasswordInput {
	@Field() username: string;
	@Field() password: string;
}

@ObjectType()
class FieldError {
	@Field() field: string;
	@Field() message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [ FieldError ], { nullable: true })
	errors?: FieldError[];
	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register (
		@Arg('input', () => UsernamePasswordInput)
		input: UsernamePasswordInput,
		@Ctx() { em }: Context
	) {
		const hashedPassword = await argon2.hash(input.password);
		const user = em.create(User, { password: hashedPassword, username: input.username });
		await em.persistAndFlush(user);
		return user;
	}

	@Mutation(() => UserResponse)
	async login (
		@Arg('input', () => UsernamePasswordInput)
		input: UsernamePasswordInput,
		@Ctx() { em }: Context
	) {
		const user = await em.findOne(User, { username: input.username });
		if (!user) {
			return {
				errors: [
					{
						name: 'username',
						message: "Couldn't find a user with that username"
					}
				]
			};
		}

		const valid = await argon2.verify(user.password, input.password);
		if (!valid)
			return {
				errors: [
					{
						name: 'password',
						message: 'Invalid password'
					}
				]
			};

		return {
			user
		};
	}
}
