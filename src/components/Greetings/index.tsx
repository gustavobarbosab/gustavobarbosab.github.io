"use client"

import Image from "next/image"
import { Fade } from "react-swift-reveal";

interface SocialNetworkProps {
    name: string,
    url: string,
    icon: string
}

interface GreetingsProps {
    className?: string,
    title: string,
    subTitle: string,
    message: string,
    socialNetworks: SocialNetworkProps[]
}

export default function Greetings(props: GreetingsProps) {
    return (
        <Fade left duration={2000} distance="40px">
            <div className={props.className + " grow"}>
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
                        {props.socialNetworks.map((item) => (
                            <a key={item.name} href={item.url}>
                                <div className="flex row gap-2 items-center">
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={16}
                                        height={16}
                                    />
                                    {item.name}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </Fade>
    );
}