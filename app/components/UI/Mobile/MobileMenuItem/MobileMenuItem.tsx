import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

interface MenuItem {
    name: string;
    path: string;
}

interface MobileMenuItemProps {
    title?: string;
    path: string;
    items?: MenuItem[];
    onCloseMenu: () => void;
}

export const MobileMenuItem = ({ 
    title, 
    path, 
    items, 
    onCloseMenu 
}: MobileMenuItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasItems = items && items.length > 0;

    return (
        <div className="border-b border-white/10 ">
            {hasItems ? (
                <>
                     <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-between w-full px-5 py-3 hover:bg-white/5 transition-colors"
                    >
                        <span className=" text-md">{title}</span>
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-gray-400" />
                        ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                        )}
                    </button>

                     {isExpanded && (
                        <div className="bg-white/5 backdrop-blur-sm">
                            {items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.path}
                                    className="block px-10 py-2.5 !text-white hover:text-white hover:bg-white/5 border-l-2 border-transparent hover:border-accent-600"
                                    onClick={onCloseMenu}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                 <Link
                    href={path}
                    className="block px-5 py-3 text-md text-white hover:text-accent-600 hover:bg-white/5 transition-colors"
                    onClick={onCloseMenu}
                >
                    {title}
                </Link>
            )}
        </div>
    );
};