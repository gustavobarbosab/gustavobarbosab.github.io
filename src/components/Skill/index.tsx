"use client"

import Image from "next/image"
import { Fade } from "react-swift-reveal";

interface SkillProps {
    largeImageSrc: string,
    text: string,
    descriptions: string[],
    imageOnTheLeft: boolean,
    className?: string
}

export default function Skill(props: SkillProps) {

    const imageSection = (
        <div key="image-section" id="skills" className="flex items-center justify-center p-5">
            <Image
                className="my-auto"
                width={350}
                height={350}
                src={props.largeImageSrc}
                alt={"Image describing" + props.text} />
        </div>
    );


    const descriptionSection = (
        <div key="description-section" className="grow dark:text-white text-gray-900">
            <div className="text-center text-5xl font-semibold tracking-tight sm:text-4xl mb-5">{props.text}</div>
            {props.descriptions.map((item, index) => (
                <p className="p-2 text-xl font-medium text-pretty text-gray-700 sm:text-xl/8 dark:text-gray-300"
                    key={index}>⚡ {item}</p>
            ))}
        </div>
    );



    const sections = props.imageOnTheLeft
        ? [imageSection, descriptionSection]
        : [descriptionSection, imageSection];

    return (
        <Fade right={!props.imageOnTheLeft} left={props.imageOnTheLeft} duration={2000} distance="40px">
            <div className={props.className} >
                <div className="md:flex md:row gap-3">
                    {sections}
                </div>
            </div>
        </Fade>
    );
}