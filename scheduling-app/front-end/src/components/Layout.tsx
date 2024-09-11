import { ReactNode } from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
    selectedNavBarButton: string;
    leftRailContent?: ReactNode;
    mainContent?: ReactNode;
    rightRailContent?: ReactNode;
}

export function Layout({
    selectedNavBarButton,
    leftRailContent,
    mainContent,
    rightRailContent,
}: LayoutProps) {

    return (
        
        <div className="flex flex-col lg:flex-row"> {/* adjusts the layout to stack elements vertically on smaller screens and horizontally on larger screens */}

            {/* Start nav sidebar-menu */}
            <NavBar selected={selectedNavBarButton} />
            {/* End nav sidebar-menu */}

            {/* Optional left rail content */}
            {leftRailContent && (
                <div className="lg:w-[380px] lg:block hidden">
                    <div className="tab-content active">{leftRailContent}</div>
                </div>
            )}

            {/* Main content */}
            <div className={`flex-1 overflow-hidden transition-all duration-150 ${mainContent && !leftRailContent && !rightRailContent ? 'bg-lime-100' : ''}`}>
                {mainContent}
            </div>

            {/* Optional right rail content */}
            {rightRailContent && (
                <div className="lg:w-[380px] lg:block hidden">
                    <div className="tab-content active">{rightRailContent}</div>
                </div>
            )}
        </div>
    );
}
