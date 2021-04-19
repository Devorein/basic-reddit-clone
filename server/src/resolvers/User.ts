import argon2 from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import User from '../entities/User';
import { Context } from '../types';

@InputType()
class UserDataInput {
	@Field() username: string;
	@Field() password: string;
	@Field() email: string;
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
	@Query(() => User, { nullable: true })
	async me (@Ctx() { req, em }: Context) {
		// You're not logged in
		if (!req.session.user_id) return null;
		return await em.findOne(User, { id: req.session.user_id });
	}

	@Mutation(() => UserResponse)
	async register (
		@Arg('input', () => UserDataInput)
		input: UserDataInput,
		@Ctx() { em, req }: Context
	) {
		if (!input.email.includes('@'))
			return {
				errors: [
					{
						field: 'email',
						message: 'Invalid email'
					}
				]
			};

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
		const user = em.create(User, { password: hashedPassword, username: input.username, email: input.email });
		try {
			await em.persistAndFlush(user);
			req.session.user_id = user.id;
			return {
				user
			};
		} catch (err) {
			if (err.code === '23505') {
				return {
					errors: [
						{
							field: 'username',
							message: 'username already exists'
						}
					]
				};
			} else {
				return {
					errors: [
						{
							field: 'unknown',
							message: 'Unknown error occurred in the backend'
						}
					]
				};
			}
		}
	}

	@Mutation(() => UserResponse)
	async login (
		@Arg('input', () => UserDataInput)
		input: UserDataInput,
		@Ctx() { em, req }: Context
	) {
		const user = await em.findOne(User, { username: input.username });
		console.log(user);
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
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
						field: 'password',
						message: 'Invalid password'
					}
				]
			};

		req.session.user_id = user.id;

		return {
			user
		};
	}

	@Mutation(() => Boolean)
	logout (@Ctx() { req, res }: Context) {
		return new Promise((resolve) => {
			req.session.destroy((err) => {
				res.clearCookie(COOKIE_NAME);
				if (err) {
					console.log(err);
					resolve(false);
					return;
				}
				resolve(true);
			});
		});
	}
}
