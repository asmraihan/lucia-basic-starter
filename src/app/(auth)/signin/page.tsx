import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/lucia/luciaAuth";

import { SignInForm } from "./_components/SignInForm";

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8  md:h-screen">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 ">
          Sign in to your account
        </h2>
        <SignInForm />

        <p>
          Dont have an account? Sign up{" "}
          <Link href="signup" className="text-blue-600">
            here.
          </Link>
        </p>
      </div>
    </div>
  );
}
