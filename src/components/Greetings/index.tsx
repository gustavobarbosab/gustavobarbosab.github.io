interface SocialNetworkProps {
    name: string,
    url: string
}

interface GreetingsProps {
    className?: string,
    title: string,
    message: string,
    socialNetworks: SocialNetworkProps[]
}

export default function Greetings(props: GreetingsProps) {
    return <>
        <div className={props.className}>
            <div className="grow">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-white">
                        Hi, I&apos;m Gustavo.
                    </h2>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-700 sm:text-xl/8 dark:text-gray-300">
                        Android-focused Software Engineer with over 4 years of experience leading squads, 7 years delivering robust applications, and optimizing UX/UI to boost engagement metrics.
                    </p>
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-gray-900 sm:grid-cols-2 md:flex lg:gap-x-10 dark:text-white">
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