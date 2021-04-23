import { useRouter } from 'next/router';
import { usePostQuery } from '../generated/graphql';
import { useIsAuth } from './useIsAuth';

export const usePostById = () => {
	const router = useRouter();
	const { meData, meFetching } = useIsAuth();
	const intId = typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
	const [{ data: postData, fetching: postFetching, error: postError }] = usePostQuery({
		pause: intId === -1,
		variables: {
			id: intId,
		},
	});

	return {
		router,
		intId,
		meFetching,
		meData,
		postData: postData?.post,
		postFetching,
		postError,
	};
};
