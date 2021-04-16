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
	@Mutation(() => UserResponse)
	async register (
		@Arg('input', () => UsernamePasswordInput)
		input: UsernamePasswordInput,
		@Ctx() { em }: Context
	) {
		if (input.username.length <= 4)
			return {
				errors: [
					{
						field: 'username',
						message: 'Username must be at least 5 characters long'
					}
				]
			};

		if (input.password.length <= 7)
			return {
				errors: [
					{
						field: 'password',
						message: 'Password must be at least 8 characters long'
					}
				]
			};

		const hashedPassword = await argon2.hash(input.password);
		const user = em.create(User, { password: hashedPassword, username: input.username });
		try {
			await em.persistAndFlush(user);
		} catch (err) {
			if (err.code === '23505' || err.detail.includes('already exists'))
				return {
					errors: [
						{
							field: 'username',
							message: 'A user with that username already exists'
						}
					]
				};
		}
		return { user };
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
