import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import Post from '../entities/Post';

@Resolver()
export class PostResolver {
	@Query(() => [ Post ])
	async posts (): Promise<Post[]> {
		return Post.find();
	}

	@Query(() => Post, { nullable: true })
	post (
		@Arg('id', () => Int)
		id: number
	): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post)
	async createPost (
		@Arg('title', () => String)
		title: string
	): Promise<Post> {
		return Post.create({ title }).save();
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost (
		@Arg('id', () => Int)
		id: number,
		@Arg('title', () => String)
		title: string
	) {
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
	) {
		try {
			await Post.delete(id);
			return true;
		} catch (err) {
			return false;
		}
	}
}
