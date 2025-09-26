"use client"

import Image from 'next/image';
import { Fade } from 'react-swift-reveal';

interface ProfileImageProps {
    src: string,
    className: string
}

export default function ProfileImage(props: ProfileImageProps) {
    return (
        <Fade duration={1000} distance='40px'>
            <div className={props.className}>
                <div className="md:w-100 md:h-100 mx-5 rounded-full overflow-hidden bg-black-200">
                    <Image
                        src={props.src}
                        alt="Gustavo Barbosa"
                        width={300}
                        height={300}
                        className="w-full h-full grayscale object-cover"
                        priority
                    />
                </div>
            </div>
        </Fade>
    );


}