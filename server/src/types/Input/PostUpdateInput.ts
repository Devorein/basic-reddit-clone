import { Field, InputType } from 'type-graphql';

@InputType()
export class PostUpdateInput {
	@Field(() => String, { nullable: true }) text: string;
	@Field(() => String, { nullable: true }) title: string;
}
