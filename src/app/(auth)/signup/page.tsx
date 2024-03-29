import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { validateRequest } from "@/lib/lucia/luciaAuth";

import { SignUpForm } from "./_components/SignUpForm"; 

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="pt:mt-0 mx-auto flex flex-col items-center justify-center px-6 pt-8  md:h-screen">
    <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 ">
          Create a Free Account
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
}
