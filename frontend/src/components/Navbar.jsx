import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          Merkato
        </Link>

        <div className="flex items-center gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-sm">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm">Get Started</button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;