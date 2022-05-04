import Link from "next/link";
import { CurrentUserResponse } from "../typings/dto";

export default function AppHeader({ currentUser }: CurrentUserResponse) {
  const links = [
    !Boolean(currentUser) && { label: "Sign Up", href: "/auth/signup" },
    !Boolean(currentUser) && { label: "Sign In", href: "/auth/signin" },
    Boolean(currentUser) && { label: "Sell Tickets", href: "/tickets/new" },
    Boolean(currentUser) && { label: "My Orders", href: "/orders" },
    Boolean(currentUser) && { label: "Sign Out", href: "/auth/signout" },
  ].flatMap((item) =>
    item
      ? [
          <li key={item.href} className="nav-item">
            <Link href={item.href}>
              <a className="nav-link">{item.label}</a>
            </Link>
          </li>,
        ]
      : []
  );

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
