import router from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
	const [{ data: meData, fetching: meFetching }] = useMeQuery();
	useEffect(() => {
		if (!meFetching && !meData?.me) router.push(`/login?next=${router.pathname}`);
	}, [meFetching, meData, router]);
	return { meData: meData?.me, meFetching };
};
