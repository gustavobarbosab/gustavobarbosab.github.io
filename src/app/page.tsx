import NavBar from '@/components/NavBar';
import BackgroundBubble from '../components/BackgroundBubble';
import Greetings from '@/components/Greetings';
import ProfileImage from '@/components/ProfileImage';

const greetings = {
  title: "Hello, I'm Gustavo Barbosa",
  message: "Android-focused Software Engineer with over 4 years of experience leading squads, 7 years delivering robust applications, and optimizing UX/UI to boost engagement metrics.",
  links: [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/gustavobarbosab' },
    { name: 'GitHub', url: 'https://www.github.com/gustavobarbosab' },
    { name: 'E-mail', url: 'mailto:gustavobarbosabarreto@gmail.com' },
  ]
}

const navBar = [
  {
    name: "Home",
    href: "#"
  },
  {
    name: "Skills",
    href: "#"
  },
  {
    name: "Companies",
    href: "#"
  }
]

export default function Example() {
  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      <NavBar
        items={navBar}
        className='w-full max-w-7xl px-4 mx-auto'
      />
      <BackgroundBubble />
      <div className='lg:flex justify-center w-3/4 mx-auto md:py-50'>
        <ProfileImage
          src="/images/profile.jpeg"
          className='lg:grow grow place-items-center'
        />
        <Greetings
          title={greetings.title}
          message={greetings.message}
          className='lg:grow mx-3 my-6'
          socialNetworks={greetings.links}
        />
      </div>
    </div>
  )
}
