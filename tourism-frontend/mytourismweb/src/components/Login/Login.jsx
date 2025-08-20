import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets.js";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase.js";
import { toast } from "react-toastify";
const Login = ({ login, setLogin, providerLogin, setProviderLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const role = login ? "user" : "serviceprovider";

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Update the data with Google account info
      const googleData = {
        name: user.displayName,
        email: user.email,
        password: user.uid, // or a fixed string like "google-oauth", but must match backend logic
      };

      let newUrl = url;
      if (login) {
        newUrl +=
          currState === "Login" ? "api/user/login" : "api/user/register";
      } else if (providerLogin) {
        newUrl +=
          currState === "Login"
            ? "api/serviceprovider/login"
            : "api/serviceprovider/register";
      }

      const response = await axios.post(newUrl, googleData);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successfully");
        setLogin(false);
        setProviderLogin(false);
        navigate("/");
      } else {
        toast(response.data.message);
      }
    } catch (error) {
      toast.error("Google login failed");
    }
    setLoading(false);
  };

  const onLogin = async (event) => {
    event.preventDefault();
    try {
      let newUrl = url;

      setLoading(true);
      if (login) {
        newUrl +=
          currState === "Login" ? "api/user/login" : "api/user/register";
      } else if (providerLogin) {
        newUrl +=
          currState === "Login"
            ? "api/serviceprovider/login"
            : "api/serviceprovider/register";
      }

      //send infromation or login in backend
      const response = await axios.post(newUrl, data);
      console.log(response.data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        setLogin(false);
        setProviderLogin(false);
        // setLoading(false);
        navigate("/");
      } else {
        toast.error(response.data.message || "");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const loginCrossHandler = () => {
    setLogin(false);
    setProviderLogin(false);
    navigate("/");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return loading ? (
    <div className="login-spinner flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EBEB1]"></div>
    </div>
  ) : (
    <div className="login ">
      <form
        action=""
        onSubmit={onLogin}
        className="login-container w-full max-w-[80%] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] mx-auto p-4  "
      >
        <div className="login-header">
          <h2>{currState}</h2>
          <img onClick={loginCrossHandler} src={assets.cross_icon} alt="" />
        </div>

        {/* eamil login fucntionality */}
        <div className="login-info">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="fullname"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="password"
            required
          />

          <p className="text-sm text-[#007BFF] hover:text-[#0559b3] text-end w-full">
            <Link
              to={`/forgot-password/${role}`}
              onClick={() => {
                setLogin(false);
                setProviderLogin(false);
              }}
            >
              Forgot Password?
            </Link>
          </p>
        </div>
        <div className="login-condition">
          <input type="checkbox" required />
          <p className="mt-5">
            By continue, i agree to the
            <a
              className="underline"
              href="/termsofuse"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007BFF", marginLeft: "4px" }}
            >
              terms of use & privacy policy
            </a>{" "}
          </p>
        </div>
        <button type="submit">
          {currState == "SignUp" ? "Create account" : "Login"}
        </button>

        {/*Google Login fucnitonlaity*/}
        <p className="text-center mt-5 text-[#828282]">OR</p>
        <div className="google-login-btn">
          <button type="button" onClick={handleGoogleLogin}>
            <img src={assets.google_icon} alt="google" />
            {currState} with Google
          </button>
        </div>

        <div className="form-switch">
          {currState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("SignUp")}>SignUp here!</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login here!</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
