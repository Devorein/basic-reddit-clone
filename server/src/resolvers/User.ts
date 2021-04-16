import argon2 from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import User from '../entities/User';
import { Context } from '../types';

@InputType()
class UserCreateInput {
	@Field() username: string;
	@Field() password: string;
}

@Resolver()
export class UserResolver {
	@Mutation(() => User)
	async register (
		@Arg('input', () => UserCreateInput)
		input: UserCreateInput,
		@Ctx() { em }: Context
	) {
		const hashedPassword = await argon2.hash(input.password);
		const user = em.create(User, { password: hashedPassword, username: input.username });
		await em.persistAndFlush(user);
		return user;
	}
}
