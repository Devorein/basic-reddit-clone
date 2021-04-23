import { GraphQLResolveInfo } from 'graphql';
import {
  Arg,
  Ctx,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from 'type-graphql';
import { getConnection } from 'typeorm';
import Post from '../entities/Post';
import Upvote from '../entities/Upvote';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { PostInput } from '../types/Input/PostInput';
import { PaginatedPosts } from '../types/Object/PaginatedPosts';
import { checkForObjectSelection } from '../utils/checkForObjectSelection';
import { rawToObject } from '../utils/rawToObject';

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(
		@Root() root: Post,
		@Arg('lines', () => Int, { nullable: true }) lines: number | null
	) {
		return (
			root.text
				.split('.')
				.slice(0, lines ?? 1)
				.join('.') + '.'
		);
	}

	@Mutation(() => Boolean)
	async vote(
		@Arg('postId', () => Int) postId: number,
		@Arg('value', () => Int) value: number,
		@Ctx() ctx: Context
	) {
		const point = value < 0 ? -1 : value > 0 ? 1 : 0;
		const user_id = ctx.req.session.user_id;
		const upvote = await Upvote.findOne({ where: { postId, userId: user_id } });
		if (!upvote) {
			await getConnection().transaction(async (tm) => {
				await tm.query(`
          INSERT INTO upvote ("userId", "postId", value)
          VALUES(${user_id}, ${postId}, ${point});
        `);
				await tm.query(`
          UPDATE post
          SET points = points + ${point}
          WHERE id = ${postId};
        `);
			});
			return true;
		} else if (upvote && upvote.value !== point) {
			let amount = point;
			if (upvote.value === -1 && point === 0) amount = 1;
			else if (upvote.value === -1 && point === 1) amount = 2;
			else if (upvote.value === 1 && point === 0) amount = -1;
			else if (upvote.value === 1 && point === -1) amount = -2;

			await getConnection().transaction(async (tm) => {
				await tm.query(`
          UPDATE upvote
          SET value = ${point}
          WHERE "userId" = ${user_id} and "postId" = ${postId}; 
        `);

				await tm.query(`
          UPDATE post
          SET points = points + ${amount}
          WHERE id = ${postId};
        `);
			});
			return true;
		}
		return false;
	}

	@Query(() => PaginatedPosts)
	async posts(
		@Arg('limit', () => Int)
		limit: number,
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null,
		@Info() info: GraphQLResolveInfo,
		@Ctx() { req }: Context
	): Promise<PaginatedPosts> {
		const containsCreatorSelection = checkForObjectSelection(info, ['posts', 'posts', 'creator']);
		const realLimit = Math.min(50, limit);
		const qb = getConnection().getRepository(Post).createQueryBuilder('p');
		if (containsCreatorSelection) qb.innerJoinAndSelect('p.creator', 'c', 'c.id = p."creatorId"');
		const subQuery = getConnection()
			.createQueryBuilder()
			.select('value')
			.from(Upvote, 'u')
			.where(`u."userId" = ${req.session.user_id}  and u."postId" = p.id`)
			.getQuery();

		req.session.user_id && qb.addSelect(`(${subQuery})`, 'voteStatus');

		qb.orderBy('p."createdAt"', 'DESC').limit(realLimit + 1);
		if (cursor) qb.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
		const posts = await qb.getRawMany();
		return {
			posts: posts
				.map((post) => rawToObject<Post>(post, 'p', { c: 'creator' }))
				.slice(0, realLimit),
			hasMore: posts.length === realLimit + 1,
		};
	}

	@Query(() => Post, { nullable: true })
	post(
		@Arg('id', () => Int)
		id: number
	): Promise<Post | undefined> {
		return Post.findOne(id, {relations: ['creator']});
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(
		@Arg('input', () => PostInput)
		input: PostInput,
		@Ctx() ctx: Context
	): Promise<Post> {
		return (
			await getConnection()
				.createQueryBuilder()
				.insert()
				.into(Post)
				.values({ ...input, creatorId: ctx.req.session.user_id })
				.returning('*')
				.execute()
		).raw[0];
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
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
	async deletePost(
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
