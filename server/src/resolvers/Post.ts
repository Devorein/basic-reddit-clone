import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, FieldResolver, Info, Int, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import Post from '../entities/Post';
import { isAuth } from '../middleware/isAuth';
import { Context } from '../types';
import { PostInput } from '../types/Input/PostInput';
import { PaginatedPosts } from '../types/Object/PaginatedPosts';
import { checkForObjectSelection } from '../utils/checkForObjectSelection';

@Resolver(Post)
export class PostResolver {
  @FieldResolver(()=> String)
  textSnippet(@Root() root: Post, @Arg('lines', ()=> Int, {nullable: true}) lines: number | null){
    return root.text.split(".").slice(0, lines ?? 1).join(".")+".";
  }

	@Query(() => PaginatedPosts)
	async posts (
		@Arg('limit', () => Int)
		limit: number,
		@Arg('cursor', () => String, { nullable: true })
		cursor: string | null,
    @Info() info: GraphQLResolveInfo
	): Promise<PaginatedPosts> {
    const containsCreatorSelection = checkForObjectSelection(info, ['posts','posts','creator']);
		const realLimit = Math.min(50, limit);
		const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p');
    if(containsCreatorSelection)
      qb.innerJoinAndSelect("p.creator", "c", 'c.id = p."creatorId"')	
			
    qb.orderBy('p."createdAt"', 'DESC')
			.limit(realLimit+1);
		if (cursor) qb.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
		const posts = await qb.getMany();
    return {posts: posts.slice(0, realLimit), hasMore: posts.length === realLimit + 1};
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
