import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  useEffect(() => {
    if (!fetching && !data?.me)
      router.push(`/login?next=${router.pathname}`)
  }, [fetching, data, router]);
  return {meData: data?.me, fetching}
}