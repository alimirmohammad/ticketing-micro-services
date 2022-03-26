import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

import useRequest from "../hooks/use-request";
import { SignUpDto } from "../typings/dto";

interface AuthProps {
  isSignUp?: boolean;
}

export default function Auth({ isSignUp = false }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { doRequest, error } = useRequest<SignUpDto>({
    url: `/api/users/${isSignUp ? "signup" : "signin"}`,
    method: "post",
    body: { email, password },
    onSuccess: () => router.push("/"),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    doRequest();
  }

  return (
    <form noValidate onSubmit={onSubmit}>
      <h1>Sign {isSignUp ? "Up" : "In"}</h1>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error}
      <button className="btn btn-primary" type="submit">
        Sign {isSignUp ? "Up" : "In"}
      </button>
    </form>
  );
}
