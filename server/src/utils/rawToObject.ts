export const rawToObject = <D>(
	rawData: D,
	originalPrefix: string,
	nestedPrefixMap: Record<string, string>
) => {
	const object: Record<string, any> = {};
	Object.entries(rawData).forEach(([key, value]) => {
		const original = key.startsWith(`${originalPrefix}_`);
		const nested = nestedPrefixMap[key[0]];
		if (original) object[key.slice(2)] = value;
		else if (nested) {
			if (!object[nested]) object[nested] = {};
			object[nested][key.slice(2)] = value;
		} else object[key] = value;
	});
	return object as D;
};
