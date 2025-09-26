"use client"

import { Fade } from "react-swift-reveal";

export default function Footer() {
    return (
        <Fade bottom duration={2000} distance="40px">
            <footer className='mx-auto px-15'>
                <hr className="border-t border-gray-800 my-1"></hr>
                <p className='dark:text-white text-gray-900 font-semibold text-pretty text-center py-10 text-xl'>Made with ❤️ by Gustavo Barbosa</p>
            </footer>
        </Fade>
    );
}