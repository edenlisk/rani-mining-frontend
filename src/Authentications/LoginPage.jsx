import React, {useContext, useEffect, useState} from "react";
import { PiEnvelopeBold, PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import {useLoginMutation, useVerifyTokenMutation, useVerifyCodeMutation } from "../states/apislice";
import { setAuthToken, setUserData, setPermissions } from "../states/slice";
import {useDispatch, useSelector} from "react-redux";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import {SocketContext} from "../context files/socket";
import {message, Modal} from "antd";


const LoginPage = () => {
  const [login, { data,  isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const location = useLocation();
  const [show2fa, setShow2fa] = useState(false);
  const [twoFACode, setTwoFACode] = useState({ code: "", email: "" });
  const from = location.state?.from?.pathname || "/dashboard";
  useEffect(() => {
    if (isSuccess) {
      if (data?.token) return message.success("Logged in Successfully");
    } else if (isError) {
      const { message: errorMessage } = error.data;
      return message.error(errorMessage);
    }
  }, [isSuccess, isError, error]);

  const { token } = useSelector(state => state.persistedReducer?.global);
  const [verifyToken, {data: verifyTokenData, isSuccess: verifyTokenSuccess, isError: isTokenError, error: tokenError}] = useVerifyTokenMutation();
  const [verifyCode, {isSuccess: isVerifyCodeSuccess, isError: isVerifyCodeError, error: verifyCodeError}] = useVerifyCodeMutation();

  useEffect(() => {
    if (verifyTokenSuccess) {
      return navigate('/dashboard' || "/coltan");
    } else if (isTokenError) {
      // const { message: errorMessage } = tokenError.data;
      dispatch(setUserData(null));
      dispatch(setPermissions(null));
      dispatch(setAuthToken(null));
      message.error(`Your session has ended. please log in again!`);
      return navigate('/login');
    }
  }, [isTokenError, verifyTokenSuccess]);

  useEffect(() => {
    if (isVerifyCodeSuccess) {
      return message.success("Logged in Successfully");
    } else if (isVerifyCodeError) {
      const { message: errorMessage } = verifyCodeError.data;
      return message.error(errorMessage);
    }
  }, [isVerifyCodeSuccess, isVerifyCodeError, verifyCodeError]);



  useEffect(() => {
    const verifyLoginToken = async () => {
      if (token) {
        const response = await verifyToken({ token });
        if (response.data?.data) {
          const { userId: currentUserId } = response.data.data;
          if (!currentUserId) {
            dispatch(setUserData(null));
            dispatch(setPermissions(null));
            dispatch(setAuthToken(null));
            message.error("Your session has ended. Please login again");
            return navigate("/login");
          }
        }
      }
    };

    verifyLoginToken();

    const intervalId = setInterval(() => {
      verifyLoginToken();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [token]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({ body: user });
    if (response.data) {
      if (response.data?.token) {
        const { token } = response.data;
        const { user } = response.data.data;
        dispatch(setAuthToken(token));
        dispatch(setUserData(user));
        dispatch(setPermissions(user.permissions));
        // localStorage.setItem("profile", JSON.stringify(user));
        // localStorage.setItem("role", user.role);
        // localStorage.setItem("permissions", JSON.stringify(user.permissions));
        socket.emit("new-user-add", {_id: user._id, username: user.username, role: user.role, permissions: user.permissions});
        navigate(from, {replace: true});
      } else {
        const { user } = response.data.data;
        setTwoFACode(prevState => ({ ...prevState, email: user.email }));
        setShow2fa(true);
      }
    }
  };

  const handle2faSubmit = async () => {
    if (!twoFACode.code) return message.error("Please enter the code from your device");
    const response = await verifyCode({ body: { code: twoFACode.code, email: twoFACode.email }});
    if (response.data) {
      if (response.data?.token) {
        const { token } = response.data;
        const { user } = response.data.data;
        dispatch(setAuthToken(token));
        dispatch(setUserData(user));
        dispatch(setPermissions(user.permissions));
        // localStorage.setItem("profile", JSON.stringify(user));
        // localStorage.setItem("role", user.role);
        // localStorage.setItem("permissions", JSON.stringify(user.permissions));
        socket.emit("new-user-add", {_id: user._id, username: user.username, role: user.role, permissions: user.permissions});
        setShow2fa(false);
        navigate(from, {replace: true});
      }
    }
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="grid grid-cols-6 h-screen">
        <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3 lg:pt-16">
          <h2 className=" text-xl font-bold">Rani Mining Company staff sign in</h2>
          <p>Please login to your account</p>
          <form
            action=""
            className="flex flex-col justify-center gap-3"
            onSubmit={handleSubmit}
          >
            <span>
              <p className="mb-2">Email</p>
              <span className="flex items-center w-full p-2 rounded border justify-between">
                <input
                  type="email"
                  required
                  name="email"
                  id="email"
                  autoComplete="off"
                  className=" focus:outline-none w-full"
                  placeholder="Enter your Email"
                  onChange={handleChange}
                />
                <PiEnvelopeBold className="text-[#a0aaba]" />
              </span>
            </span>
            <span>
              <p className="mb-2">Password</p>
              <span className="flex items-center w-full p-2 rounded border justify-between">
                <input
                  type={show ? "text" : "password"}
                  required
                  name="password"
                  id="password"
                  className=" focus:outline-none w-full"
                  placeholder="Enter your Password"
                  onChange={handleChange}
                />
                {show ? (
                  <PiEyeSlashFill
                    className="text-[#a0aaba]"
                    onClick={() => setShow(!show)}
                  />
                ) : (
                  <PiEyeFill
                    className="text-[#a0aaba]"
                    onClick={() => setShow(!show)}
                  />
                )}
              </span>
              {/* <p className=" mt-2 hover:underline hover:text-blue-600" onClick={()=>navigate("/login/supplier")}>login as supplier</p> */}
            </span>
            {/*<p*/}
            {/*  className="mb-2 hover:underline "*/}
            {/*  onClick={() => navigate("/password/forgot")}*/}
            {/*>*/}
            {/*  Forgot password ?*/}
            {/*</p>*/}
            {isLoading ? (
             <button
             className="px-2 flex gap-1 items-center justify-center py-3 bg-blue-200 rounded-md text-gray-500"
             type="submit"
           >
             <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
             Logging in
           </button>
            ) : (
                <button
                type="submit"
                className="w-full px-2 py-3 bg-blue-400 rounded"
              >
                Login
              </button>
            )}
              <p className=" mt-8 hover:underline border bg-custom_blue-100 border-custom_blue-500 p-2 w-fit rounded shadow-sm cursor-pointer text-md text-custom_blue-600" onClick={()=>navigate("/login/supplier")}>Login as Rani Mining Company supplier</p>
            {/*<span className="flex items-center justify-center gap-2">*/}
            {/*  <p>Don’t have an account?</p>*/}
            {/*  <p*/}
            {/*    className=" hover:underline"*/}
            {/*    onClick={() => navigate("/register")}*/}
            {/*  >*/}
            {/*    Sign Up*/}
            {/*  </p>*/}
            {/*</span>*/}
          </form>
        </div>

        <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]" />
        <Modal
            open={show2fa}
            destroyOnClose
            onOk={() => handle2faSubmit()}
            onCancel={() => setShow2fa(!show2fa)}
            okButtonProps={{className: "bg-blue-500"}}
            cancelButtonProps={{className: "bg-red-500 text-white"}}
        >
          <div>
            <p className="text-center text-xl font-bold">Enter 2FA code</p>
            <input
                type="number"
                name="code"
                id="code"
                placeholder="Enter the 6 digit code from the app"
                className="w-full border p-2 rounded mt-2 focus:outline-none"
                onChange={(e) => setTwoFACode(prevState => ({...prevState, code: e.target.value}))}
                onWheelCapture={(e) => e.target.blur()}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};
export default LoginPage;
