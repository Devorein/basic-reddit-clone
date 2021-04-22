import { FieldNode, GraphQLResolveInfo, SelectionSetNode } from 'graphql';

export const checkForObjectSelection = (info: GraphQLResolveInfo, fields: string[]) => {
	function inner(
		parent: { selectionSet: SelectionSetNode },
		field: string
	): { selectionSet: SelectionSetNode } | null {
		let selectionNode: FieldNode | null = null;
		const selections = parent.selectionSet.selections;
		for (let index = 0; index < selections.length; index++) {
			const selection = selections[index];
			if (selection.kind === 'Field' && selection.name.value === field) {
				selectionNode = selection;
				break;
			} else if (selection.kind === 'FragmentSpread' && info.fragments[selection.name.value]) {
				selectionNode = inner(info.fragments[selection.name.value], field) as FieldNode;
				if (selectionNode) break;
			}
		}
		if (selectionNode && 'selectionSet' in selectionNode)
			return selectionNode as Required<FieldNode>;
		else return null;
	}

	let parent: { selectionSet: SelectionSetNode } | null = info.operation;
	for (let index = 0; index < fields.length; index++) {
		if (parent) parent = inner(parent, fields[index]);
		else break;
	}
	return Boolean(parent);
};
