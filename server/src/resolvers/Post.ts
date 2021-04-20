import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import Post from '../entities/Post';
import { Context } from '../types';

@Resolver()
export class PostResolver {
	@Query(() => [ Post ])
	async posts (@Ctx() ctx: Context) {
		return ctx.em.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	post (
		@Arg('id', () => Int)
		id: number,
		@Ctx() ctx: Context
	) {
		return ctx.em.findOne(Post, { id });
	}

	@Mutation(() => Post)
	async createPost (
		@Arg('title', () => String)
		title: string,
		@Ctx() ctx: Context
	) {
		const post = ctx.em.create(Post, { title });
		await ctx.em.persistAndFlush(post);
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost (
		@Arg('id', () => Int)
		id: number,
		@Arg('title', () => String)
		title: string,
		@Ctx() ctx: Context
	) {
		const post = await ctx.em.findOne(Post, { id });
		if (!post) return null;
		post.title = title;
		await ctx.em.persistAndFlush(post);
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost (
		@Arg('id', () => Int)
		id: number,
		@Ctx() ctx: Context
	) {
		try {
			await ctx.em.nativeDelete(Post, { id });
			return true;
		} catch (err) {
			return false;
		}
	}
}
