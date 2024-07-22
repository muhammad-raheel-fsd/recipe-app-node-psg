import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { uploadImageHandler } from "../../utils/FirebaseImageUpload/uploadImage";
import "../../css/signup.css";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  username: z
    .string()
    .min(1, "Username is required")
    .refine((s) => !s.includes(" "), "Whitespaces not allowed"),
  password: z
    .string()
    .min(2, "Password is required")
    .refine((s) => !s.includes(" "), "Whitespaces not allowed"),
  profileImage: z.string().min(1, "Profile image is required"),
});

const UpdateUser = () => {
  const [cookies] = useCookies();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [existingUserDetails, setExistingUserDetails] = useState(null);

  const imageHandler = async (event) => {
    const image = event.target.files[0];
    const imageUrl = await uploadImageHandler(image);

    if (imageUrl === "404 error") {
      setError("profileImage", {
        type: "manual",
        message: "Image upload failed",
      });
      return;
    }

    console.log("object", imageUrl);
    setValue("profileImage", imageUrl);
  };

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/${cookies.auth.userId}`
      );
      const data = await response.json();
      if (data.status === 200) {
        setExistingUserDetails(data.data);
      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [cookies]);

  const sendata = async (data) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/api/users/update/${
        cookies.auth.userId
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (result.status === 200) {
      Swal.fire({
        title: "Success",
        text: "User created successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate(result.redirect);
      });
    }

    if (result.status === 400) {
      console.log("user found");
      Swal.fire({
        title: "Error",
        text: result.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    sendata(data);
  };

  return (
    <div className="form-center">
      <div className=" shadow p-5">
        <h1 className="heading">Update Your Profile</h1>
        <form className="form-body mt-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2" htmlFor="email">
              Your email
            </label>
            <input
              type="email"
              defaultValue={existingUserDetails?.email ?? ""}
              id="email"
              {...register("email")}
              className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <p className="text-warning">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2" htmlFor="username">
              Your Username
            </label>
            <input
              type="text"
              id="username"
              defaultValue={existingUserDetails?.username ?? ""}
              {...register("username")}
              className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${
                errors.username ? "border-red-500" : ""
              }`}
              placeholder="username"
            />
            {errors.username && (
              <p className="text-warning">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              defaultValue={existingUserDetails?.password ?? ""}
              id="password"
              {...register("password")}
              className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg outline-none focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-warning">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="mb-2" htmlFor="profileImage">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              defaultValue={existingUserDetails?.image ?? ""}
              onChange={imageHandler}
              accept=".png, .jpg, .jpeg" // Limit file types
              className={`block w-full text-sm p-1 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none  ${
                errors.profileImage ? "border-red-500" : ""
              }`}
            />
            {errors.profileImage && (
              <p className="text-warning">{errors.profileImage.message}</p>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Update account
          </button>
          {/* <p>
            Already have an account?{" "}
            <Link to="/auth/login" className="auth-link">
              Login here
            </Link>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
