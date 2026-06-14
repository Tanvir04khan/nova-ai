import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import {
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FormEvent,
} from "react";
import { appRoutes } from "@/utils/routes";
import { useToast } from "./ui/toast";
import useSignup from "@/hooks/Auth/useSignup";
import { saveAccessTokenAndRefreshToken } from "@/utils/utils";

const initialSignUpDetails = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [signUpDetails, setSignUpDetails] = useState(initialSignUpDetails);

  const toast = useToast();

  const { mutate: signup, isPending: isSigningUp } = useSignup();

  const navigate = useNavigate();

  const handleChange =
    (field: keyof typeof initialSignUpDetails) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setSignUpDetails((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !signUpDetails.firstName ||
      !signUpDetails.lastName ||
      !signUpDetails.email ||
      !signUpDetails.password ||
      !signUpDetails.confirmPassword
    ) {
      return toast({
        message:
          "First Name, Last Name, Email, Password and Confirm Password is required.",
        variant: "warning",
      });
    }

    if (!signUpDetails.email.includes("@")) {
      return toast({
        message: "Please provide valid email.",
        variant: "warning",
      });
    }
    if (signUpDetails.phoneNumber && signUpDetails.phoneNumber.length > 10) {
      return toast({
        message: "please provide valid Phone Number.",
        variant: "warning",
      });
    }

    signup(signUpDetails, {
      onError: (res) => {
        toast({
          message: res.message,
          variant: "error",
        });
      },
      onSuccess: (res) => {
        if (
          !res.data.accessToken ||
          !res.data.refreshToken ||
          !res.data.userId
        ) {
          return toast({
            message: "Something went wrong, try logging in after some time.",
            variant: "error",
          });
        }

        toast({
          message: res.message,
          variant: "success",
        });

        saveAccessTokenAndRefreshToken(
          res.data.accessToken,
          res.data.refreshToken,
          res.data.userId,
        );

        navigate(appRoutes.NewChat);
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Get started with your NovaAI account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={signUpDetails.firstName}
                  onChange={handleChange("firstName")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={signUpDetails.lastName}
                  onChange={handleChange("lastName")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={signUpDetails.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                />
                <FieldDescription>
                  Optional — only enter a phone number if you want account
                  recovery or SMS notifications.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpDetails.email}
                  onChange={handleChange("email")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={signUpDetails.password}
                  onChange={handleChange("password")}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={signUpDetails.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">Create account</Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to={appRoutes.Auth}>Log in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By creating an account, you agree to our{" "}
        <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
