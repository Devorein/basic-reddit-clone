import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import User from '../entities/User';
import { Context } from '../types';
import { UserDataInput } from '../types/Input/UserDataInput';
import { UserResponse } from '../types/Object/UserResponse';
import { validateRegister } from '../utils/validateRegister';
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
		const validationErrors = validateRegister(input);
		if (validationErrors !== undefined) return validationErrors;

		const hashedPassword = await argon2.hash(input.password);
		const user = em.create(User, {
			password: hashedPassword,
			username: input.username.toLowerCase(),
			email: input.email
		});
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
		@Arg('usernameOrEmail', () => String)
		usernameOrEmail: string,
		@Arg('password', () => String)
		password: string,
		@Ctx() { em, req }: Context
	) {
		const user = await em.findOne(
			User,
			usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail.toLowerCase() }
		);
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

		const valid = await argon2.verify(user.password, password);
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
