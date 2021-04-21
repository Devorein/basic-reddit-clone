import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import Post from '../entities/Post';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { PostInput } from '../types/Input/PostInput';

@Resolver()
export class PostResolver {
	@Query(() => [ Post ])
	async posts (
		@Arg('limit', () => Int)
		limit: number,
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null
	): Promise<Post[]> {
		const realLimit = Math.min(50, limit);
		const qb = getConnection()
			.getRepository(Post)
			.createQueryBuilder('p')
			.orderBy('"createdAt"', 'DESC')
			.take(realLimit);
		if (cursor) qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
		return qb.getMany();
	}

	@Query(() => Post, { nullable: true })
	post (
		@Arg('id', () => Int)
		id: number
	): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost (
		@Arg('input', () => PostInput)
		input: PostInput,
		@Ctx() ctx: Context
	): Promise<Post> {
		return (await getConnection()
			.createQueryBuilder()
			.insert()
			.into(Post)
			.values({ ...input, creatorId: ctx.req.session.user_id })
			.returning('*')
			.execute()).raw[0];
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost (
		@Arg('id', () => Int)
		id: number,
		@Arg('title', () => String)
		title: string
	): Promise<Post | null> {
		const post = await Post.findOne(id);
		if (!post) return null;
		await Post.update({ id }, { title });
		post.title = title;
		return post;
	}

	@Mutation(() => Boolean)
	async deletePost (
		@Arg('id', () => Int)
		id: number
	): Promise<boolean> {
		try {
			await Post.delete(id);
			return true;
		} catch (err) {
			return false;
		}
	}
}
