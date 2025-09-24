interface NavItem {
    name: string,
    href: string
}

interface NavBarProps {
    className?: string,
    items: NavItem[]
}

export default function NavBar(props: NavBarProps) {
    return <>
        <nav className={props.className}>
            <div className="mx-auto w-3/4 flex flex-col sm:flex-row justify-center lg:justify-end mx-10 my-10 gap-x-8">
                {props.items.map((item: NavItem) => (
                    <a 
                    key={item.name} 
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-center sm:text-left">
                        {item.name}
                    </a>
                ))}
            </div>
        </nav>
    </>
}