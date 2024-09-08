import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { useSignUpAccount } from "src/api/authApi";
import "react-toastify/dist/ReactToastify.css";
import { useRef, useState } from "react";

interface ISignUpFormInput {
  displayName: string;
  username: string;
  password: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const notify = (isSignedIn: boolean) => {
    if (isSignedIn)
      toast.success("Create account successfully!", {
        position: "top-right",
      });
    else
      toast.error("Create account failed!", {
        position: "top-right",
      });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ISignUpFormInput>();

  const password = watch("password");

  const { mutate: signUpAccount } = useMutation({
    mutationFn: useSignUpAccount,
    onSuccess: (data) => {
      console.log("success", data);
      navigate("/login");
      notify(true);
    },
    onError: (error: any) => {
      console.log(error.response?.data?.message);
      notify(false);
    },
  });

  const onSubmit: SubmitHandler<ISignUpFormInput> = (data) => {
    const confirmPassword = confirmPasswordRef.current?.value;
    console.log(confirmPassword, password);

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }
    signUpAccount(data);
  };

  return (
    <div className="bg-cream h-screen flex-center">
      <div className="flex flex-col gap-4 bg-white w-full max-w-lg p-4 rounded-md">
        <div className="flex-center flex-col">
          <p className="h2-bold">SIGN UP</p>
          <p className="text-dark-3 font-semibold">
            Welcome, create your new account here.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p>Display name</p>
              <p className="text-red-500">*</p>
            </div>
            <input
              type="text"
              className="input-field rounded-xl"
              {...register("displayName", {
                required: {
                  value: true,
                  message: "Display name is required",
                },
              })}
            />
            {errors.displayName && (
              <p className="text-red-500">{errors.displayName?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p>Username</p>
              <p className="text-red-500">*</p>
            </div>
            <input
              type="text"
              className="input-field rounded-xl"
              {...register("username", {
                required: {
                  value: true,
                  message: "Username is required",
                },
                minLength: {
                  value: 3,
                  message: "Username must contain at least 3 characters",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-500">{errors.username?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p>Password</p>
              <p className="text-red-500">*</p>
            </div>
            <input
              type="password"
              className="input-field rounded-xl"
              {...register("password", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 4,
                  message: "Password must contain at least 4 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <p>Confirm password</p>
              <p className="text-red-500">*</p>
            </div>
            <input
              type="password"
              className="input-field rounded-xl"
              ref={confirmPasswordRef}
            />
            {confirmPasswordError && (
              <p className="text-red-500">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <button
          className="btn-primary w-full font-semibold"
          onClick={handleSubmit(onSubmit)}
        >
          SIGN UP
        </button>

        <div className="flex-center gap-2">
          <p>Already have an account?</p>
          <Link to={"/login"}>
            <p className="text-blue-500 font-semibold cursor-pointer">Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
