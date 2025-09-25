import ThemeToggle from '../ThemeToggle';

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
            <div className="w-full flex flex-col sm:flex-row justify-end items-center my-10 gap-x-8 mx-auto">
                {props.items.map((item: NavItem) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className="hover:text-gray-900 text-gray-300 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-center sm:text-left">
                        {item.name}
                    </a>
                ))}
                <ThemeToggle />
            </div>
        </nav>
    </>
}