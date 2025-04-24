import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Guest from "@/Layouts/AuthLayout";
import { cn } from "@/lib/utils";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("register"), {
      onFinish: () => reset("password", "password_confirmation")
    });
  };

  return (
    <Guest>
      <Head title="Register | Afif Camera Rental" />

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Fill the fields below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    name="name"
                    placeholder="John Doe"
                    value={data.name}
                    autoComplete="name"
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    autoComplete="new-password"
                    onChange={(e) => setData("password", e.target.value)}
                    required
                  />
                  <InputError message={errors.password} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    required
                  />
                  <InputError message={errors.password_confirmation} />
                </div>
                <Button type="submit" className="w-full" disabled={processing}>
                  Register
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already registered?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Guest>
  );
}
