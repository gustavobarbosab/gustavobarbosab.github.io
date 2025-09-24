import Image from 'next/image';

interface ProfileImageProps {
    src: string,
    className: string
}

export default function ProfileImage(props : ProfileImageProps) {
    return <>
        <div className={props.className}>
            <div className="w-100 h-100 mx-5 rounded-full overflow-hidden bg-black-200">
                <Image
                    src={props.src}
                    alt="Gustavo Barbosa"
                    width={350}
                    height={350}
                    className="w-full h-full grayscale object-cover"
                    priority
                />
            </div>
        </div>
    </>
}