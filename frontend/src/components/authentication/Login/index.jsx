import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import "../../css/login.css";
import "../../css/common.css";
import "./style.css";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .refine((s) => !s.includes(" "), "Whitespaces not allowed"),
});

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies();
  console.log("COOKIES", setCookie);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        setCookie("auth", result.cookie, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        navigate(result.redirect);
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Could not find your account",
      }).then(() => {
        navigate("/auth/signup");
      });
    } catch (error) {
      console.log("ERROR ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      }).then(() => {
        navigate("/auth/signup");
      });
    }
  };

  const loginDemoUser = async (event) => {
    event.preventDefault();
    const email = "demouser@gmail.com";
    const password = "demouser123";
    setValue("email", email);
    setValue("password", password);
    // await new Promise((resolve) => setTimeout(() => resolve, 5000));
    setTimeout(async () => {
      console.log("CONTROL ============");
      await onSubmit({ email, password });
    }, 2000);
  };

  return (
    <div className="form-center">
      <div className="shadow p-5 ">
        <h1 className="heading">Sign in to your account</h1>
        <form className="form-body mt-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2" htmlFor="email">
              Your email
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="text-warning">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password")}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-warning">{errors.password.message}</p>
            )}
          </div>
          <div className="action-buttons">
            <button
              type="submit"
              className="btn btn-primary mt-3 action-button-left"
            >
              Sign in
            </button>
            <button className="action-button-right" onClick={loginDemoUser}>
              Demo user
            </button>
          </div>
          <p className="text-sm font-light text-gray-800">
            Don’t have an account yet?{" "}
            <Link to="/auth/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
