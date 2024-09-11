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
        <div className="flex flex-col lg:flex-row">
            {/* Start nav sidebar-menu */}
            <NavBar selected={selectedNavBarButton} />
            {/* End nav sidebar-menu */}

            {/* Optional left rail content */}
            {leftRailContent && (
                <div className="w-full lg:w-[380px] bg-teams-left p-4">
                    <div className="tab-content active">{leftRailContent}</div>
                </div>
            )}

            {/* Main content */}
            <div className={`flex-1 overflow-hidden transition-all duration-150 ${mainContent && !leftRailContent && !rightRailContent ? 'bg-lime-100' : ''}`}>
                {mainContent}
            </div>

            {/* Optional right rail content */}
            {rightRailContent && (
                <div className="w-full lg:w-[380px] bg-chat p-4">
                    <div className="tab-content active">{rightRailContent}</div>
                </div>
            )}
        </div>
    );
}
