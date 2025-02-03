import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Guest from "@/Layouts/GuestLayout";
import { cn } from "@/lib/utils";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface LoginProps extends React.ComponentPropsWithoutRef<"div"> {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({
  status,
  canResetPassword,
  className,
  ...props
}: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false as boolean
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onFinish: () => reset("password")
    });
  };

  return (
    <Guest>
      <Head title="Login | Afif Camera Rental" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={data.email}
                    autoComplete="email"
                    onChange={(e) => setData("email", e.target.value)}
                    required
                  />
                  <InputError message={errors.email} />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {canResetPassword && (
                      <Link
                        href={route("password.request")}
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                    required
                  />
                  <InputError message={errors.password} />
                  <div className="mt-2">
                    <label className="flex items-center">
                      <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) =>
                          setData(
                            "remember",
                            (e.target.checked || false) as false
                          )
                        }
                      />
                      <span className="ms-2 text-sm">Remember me</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Guest>
  );
}
