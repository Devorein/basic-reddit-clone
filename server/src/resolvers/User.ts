import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import User from '../entities/User';
import { Context } from '../types';
import { UserDataInput } from '../types/Input/UserDataInput';
import { UserResponse } from '../types/Object/UserResponse';
import { sendEmail } from '../utils/sendEmail';
import { validateRegister } from '../utils/validateRegister';
@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	me (@Ctx() { req }: Context): null | Promise<User | undefined> {
		// You're not logged in
		if (!req.session.user_id) return null;
		return User.findOne(req.session.user_id);
	}

	@Mutation(() => UserResponse)
	async changePassword (
		@Arg('token', () => String)
		token: string,
		@Arg('newPassword', () => String)
		newPassword: string,
		@Ctx() { req, redis }: Context
	): Promise<UserResponse> {
		if (newPassword.length <= 4)
			return {
				errors: [
					{
						field: 'newPassword',
						message: 'Password must be greater than 4 characters'
					}
				]
			};
		const key = FORGET_PASSWORD_PREFIX + token;
		const userId = await redis.get(key);
		if (!userId)
			return {
				errors: [
					{
						field: 'token',
						message: 'token expired'
					}
				]
			};
		const intUserId = parseInt(userId);
		const user = await User.findOne(intUserId);
		if (!user)
			return {
				errors: [
					{
						field: 'token',
						message: 'User no longer exists'
					}
				]
			};

		const hashedPassword = await argon2.hash(newPassword);
		user.password = hashedPassword;
		req.session.user_id = user.id;
		await User.update(intUserId, { password: hashedPassword });
		await redis.del(key);
		return { user };
	}

	@Mutation(() => Boolean)
	async forgotPassword (
		@Arg('email', () => String)
		email: string,
		@Ctx() { redis }: Context
	): Promise<Boolean> {
		const user = await User.findOne({ where: { email } });
		if (!user) return true;

		const token = v4();
		await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24);
		await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`);
		return true;
	}

	@Mutation(() => UserResponse)
	async register (
		@Arg('input', () => UserDataInput)
		input: UserDataInput,
		@Ctx() { req }: Context
	): Promise<UserResponse> {
		const errors = validateRegister(input);
		if (errors !== undefined) return { errors };

		const hashedPassword = await argon2.hash(input.password);
		const user = (await getConnection()
			.createQueryBuilder()
			.insert()
			.into(User)
			.values({
				password: hashedPassword,
				username: input.username.toLowerCase(),
				email: input.email
			})
			.returning('*')
			.execute()).raw[0];

		try {
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
		@Ctx() { req }: Context
	) {
		const user = await User.findOne({
			where: usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail.toLowerCase() }
		});
		if (!user) {
			return {
				errors: [
					{
						field: 'usernameOrEmail',
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
