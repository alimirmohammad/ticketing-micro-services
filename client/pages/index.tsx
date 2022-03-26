import { CurrentUserResponse } from "../typings/dto";

export default function LandingPage({ currentUser }: CurrentUserResponse) {
  return <h1>You are {currentUser ? "" : "NOT"} signed in!</h1>;
}
