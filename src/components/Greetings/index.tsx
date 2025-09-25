interface SocialNetworkProps {
    name: string,
    url: string
}

interface GreetingsProps {
    className?: string,
    title: string,
    subTitle: string,
    message: string,
    socialNetworks: SocialNetworkProps[]
}

export default function Greetings(props: GreetingsProps) {
    return <>
        <div className={props.className}>
            <div className="grow">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight sm:text-7xl text-white">
                        {props.title}
                    </h2>
                    <h3 className="text-3xl font-semibold tracking-tight sm:text-5xl text-light-gray">
                        {props.subTitle}
                    </h3>
                    <p className="mt-8 text-lg font-medium text-pretty sm:text-xl/8 text-gray-300">
                        {props.message}
                    </p>
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-2 md:flex lg:gap-x-10 text-white">
                        {props.socialNetworks.map((link) => (
                            <a key={link.name} href={link.url}>
                                {link.name} <span aria-hidden="true">&rarr;</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
}