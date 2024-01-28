import React, {useContext, useEffect, useState} from "react";
import { PiEnvelopeBold, PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../states/apislice";
import { setAuthToken, setUserData, setPermissions  } from "../states/slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ImSpinner2 } from "react-icons/im";
import { SocketContext } from "../context files/socket";
import { message } from "antd";


const SupplierLogin=()=>{
    const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
    const [show, setShow] = useState(false);
    const [user, setUser] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    useEffect(() => {
      if (isSuccess) {
        return message.success("Logged in Successfully")
      } else if (isError) {
        const { message: errorMessage } = error.data;
        return message.error(errorMessage);
      }
    }, [isSuccess, isError, error]);
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!user.email || !user.password) {
        return message.error("Please fill all fields");
      } else {
          navigate('/suppliers/due-diligence');
      }
      // const response = await login({ body: user });
      // if (response.data) {
        // const { token } = response.data;
        // const { user } = response.data.data;
        // dispatch(setAuthToken(token));
        // dispatch(setUserData(user));
        // dispatch(setPermissions(user.permissions));
        // localStorage.setItem("profile", JSON.stringify(user));
        // localStorage.setItem("role", user.role);
        // localStorage.setItem("permissions", JSON.stringify(user.permissions));
        // socket.emit("new-user-add", {_id: user._id, username: user.username, role: user.role, permissions: user.permissions});
        // navigate(from, {replace: true});
      // }
    };
  
    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };

    return(
        <>
        <div className="grid grid-cols-6 h-screen">
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3 lg:pt-16">
            <h2 className=" text-xl font-bold">Rani Mining Company supplier sign in</h2>
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
              </span>
              {/*<p*/}
              {/*  className="mb-2 hover:underline "*/}
              {/*  onClick={() => navigate("/password/forgot")}*/}
              {/*>*/}
              {/*  Forgot password ?*/}
              {/*</p>*/}
              {isLoading ? (
               <button
               className="px-2 flex gap-1 items-center justify-center py-3 bg-amber-100 rounded-md text-gray-500"
               type="submit"
             >
               <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
               Loging in
             </button>
              ) : (
                  <button
                  type="submit"
                  className="w-full px-2 py-3 bg-amber-200 rounded"
                >
                  Login
                </button>
              )}
 
            </form>
          </div>
  
          <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]" />
        </div>
      </>
    )
}

export default SupplierLogin;