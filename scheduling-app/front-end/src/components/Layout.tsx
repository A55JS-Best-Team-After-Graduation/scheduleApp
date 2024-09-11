// import { ReactNode } from "react";
// import { NavBar } from "./NavBar";

// interface LayoutProps {
//     selectedNavBarButton: string;
//     sideBarContent?: ReactNode;
//     mainContent?: ReactNode;
//     UserProfileDetailsContent?: ReactNode;
// }

// export function Layout({
//     selectedNavBarButton,
//     sideBarContent,
//     mainContent,
// }: LayoutProps) {

//     return (
//         <>
//             <Meta title="Chat App" />

//             <div className="lg:flex">
//                 {/* <!-- Start left sidebar-menu --> */}
//                 <NavBar selected={selectedNavBarButton}
//                 />
//                 {/* <!-- End left sidebar-menu --> */}

//                 {sideBarContent && (
//                     <div className="lg:w-[380px] ">
//                         <div>
//                             <div className="tab-content active"> {sideBarContent} </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* <!-- Start User chat --> */}
//                 <div className={`w-full overflow-hidden transition-all duration-150 ${mainContent && !sideBarContent ? '' : ''}`}>
//                     {mainContent}
//                 </div>
//                 {/* <!-- End User chat --> */}

//             </div>
//         </>
//     );
// }
