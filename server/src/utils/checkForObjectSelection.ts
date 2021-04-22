import { FragmentDefinitionNode, GraphQLResolveInfo, SelectionNode } from 'graphql';

export const checkForObjectSelection = (info: GraphQLResolveInfo, fields: string[]) => {
	let parent = info.operation.selectionSet;
	for (let index = 0; index < fields.length; index++) {
		const field = fields[index];
		let selectionNode: SelectionNode | FragmentDefinitionNode | null = null;
		for (let _index = 0; _index < parent.selections.length; _index++) {
			const selection = parent.selections[_index];
			if (selection.kind === 'Field' && selection.name.value === field) {
				selectionNode = selection;
				break;
			} else if (selection.kind === 'FragmentSpread' && info.fragments[selection.name.value]) {
				selectionNode = info.fragments[selection.name.value];
				index--;
				break;
			}
		}
		if (selectionNode && 'selectionSet' in selectionNode) parent = selectionNode.selectionSet!;
		else return false;
	}
	return true;
};
