const LoginPage = () => {

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
            <p>Username</p>
            <input type="text" className="input-field rounded-xl focus:border-blue-500 focus:border"></input>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <p>Password</p>
            <input type="password" className="input-field rounded-xl"></input>
          </div>
        </div>

        <div className="flex">
          <p className="text-blue-500 font-semibold cursor-pointer">
            Forgot password?
          </p>
        </div>

        <button className="btn-primary w-full">Login</button>

        <div className="flex-center gap-2">
          <p>Don't have an account</p>
          <p className="text-blue-500 font-semibold cursor-pointer">Sign up</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
