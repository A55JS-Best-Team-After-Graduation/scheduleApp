import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../service/service";
import { AppContext } from "../../context/AppContext";

const NavBar=({ selected }) => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      console.log("User logged out successfully.");
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="sidebar-menu w-full lg:w-[75px] shadow lg:flex lg:flex-col flex flex-row justify-between items-center fixed lg:relative z-40 bottom-0">
        <div className="hidden lg:my-5 lg:block">
          <NavLink to="/" className="block">
            <span>
              <img src="public/vite.svg" alt="" className="h-[30px]" />
            </span>
          </NavLink>
        </div>

        {/* <!-- Tabs --> */}
        <div className="w-full mx-auto lg:my-auto">
          <ul id="tabs" className="flex flex-row justify-center w-full lg:flex-col lg:flex nav-tabs" >

            {/*Teams*/}
            <li className="flex-grow lg:flex-grow-0">
              <NavLink to="/groups" className={`tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg cursor-pointer ${selected === "teams" ? "active" : ""}`} >
                <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                  <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                  <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">
                    Teams
                  </span>
                </div>
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </>
  );
}

export default NavBar;