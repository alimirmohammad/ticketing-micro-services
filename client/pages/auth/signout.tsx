import { useRouter } from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

export default function SignOut() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Signing you out...</div>;
}
