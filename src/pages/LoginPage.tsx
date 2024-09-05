import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { useSignInAccount } from "src/api/authApi";
import "react-toastify/dist/ReactToastify.css";

interface ILoginFormInput {
  username: string;
  password: string;
}

const LoginPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

  const notify = (isSignedIn: boolean) => {
    if (isSignedIn)
      toast.success("Login successfully!", {
        position: "top-right",
      });
    else
      toast.error("Login failed!", {
        position: "top-right",
      });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginFormInput>();

  const { mutate: loginAccount } = useMutation({
    mutationFn: useSignInAccount,
    onSuccess: (response) => {
      const token = response.data.token;
      // console.log(response.data.token);
      localStorage.setItem("token", token);
      setIsSignedIn(true);
      navigate("/");
      notify(true);
    },
    onError: (error: any) => {
      console.log(error.response?.data?.message);
      notify(false);
    },
  });

  const onSubmit: SubmitHandler<ILoginFormInput> = (data) => {
    loginAccount(data);
  };

  return (
    <div className="bg-cream h-screen flex-center">
      <div className="flex flex-col gap-4 bg-white w-full max-w-lg p-4 rounded-md">
        <div className="flex-center flex-col">
          <p className="h2-bold">LOGIN</p>
          <p className="text-dark-3 font-semibold">
            Streamline your tasks, achieve more.
          </p>
        </div>

        <div className="">
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
              })}
            />
            {errors.username && (
              <p className="text-red-500">{errors.username?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
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

              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password?.message}</p>
            )}
          </div>
        </div>

        <div className="flex">
          <p className="text-blue-500 font-semibold cursor-pointer">
            Forgot password?
          </p>
        </div>

        <button
          className="btn-primary w-full font-semibold"
          onClick={handleSubmit(onSubmit)}
        >
          LOGIN
        </button>

        <div className="flex-center gap-2">
          <p>Don't have an account?</p>
          <Link to={"/signup"}>
            <p className="text-blue-500 font-semibold cursor-pointer">
              Sign up
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
