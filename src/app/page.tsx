import NavBar from '@/components/NavBar';
import BackgroundBubble from '../components/BackgroundBubble';
import Greetings from '@/components/Greetings';
import ProfileImage from '@/components/ProfileImage';
import Skill from '@/components/Skill';
import Footer from '@/components/Footer';

const navBar = [
  {
    name: "Home",
    href: "#"
  },
  {
    name: "Skills",
    href: "#"
  },
]

const greetings = {
  title: "Hello 👋,",
  subTitle: " I'm Gustavo Barbosa",
  message: "Android-focused Software Engineer with over 4 years of experience leading squads, 7 years delivering robust applications, and optimizing UX/UI to boost engagement metrics.",
  links: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gustavobarbosab',
      icon: "/icons/linkedin.svg"
    },
    {
      name: 'GitHub',
      url: 'https://www.github.com/gustavobarbosab',
      icon: "/icons/github.svg"
    },
    {
      name: 'E-mail',
      url: 'mailto:gustavobarbosabarreto@gmail.com',
      icon: "/icons/mail.svg"
    },
  ]
}

const androidSkills = {
  text: "Android Development",
  imageUrl: "/images/development.svg",
  descriptions: [
    "Jetpack Compose for modern UI development",
    "Kotlin Coroutines and Flow for asynchronous programming",
    "Hilt/Koin for dependency injection",
    "Modularization and Clean Architecture patterns",
    "Firebase integration (Crashlytics, Analytics, Remote Config)",
    "Unit and UI testing with JUnit, Espresso and Robolectric",
    "CMP Compose Multiplatform",
    "Continuous Integration/Continuous Deployment (CI/CD)"
  ]
}

const leadershipSkills = {
  text: "Leadership & Team Management",
  imageUrl: "/images/leadership.svg",
  descriptions: [
    "Led agile transformation initiatives that improved team velocity",
    "Mentored 10+ developers, with 80% receiving promotions",
    "Established Kanban workflows that reduced project delivery time",
    "Served as technical lead for critical mobile applications serving 5M+ users",
    "Facilitated cross-team collaboration between engineering, product, and design",
    "Created technical documentation and knowledge sharing programs for team growth"
  ]
}

export default function Example() {
  return (
    <div className='dark:bg-dark bg-light'>
      <div className="relative isolate overflow-hidden bg-gray-900">
        <NavBar
          items={navBar}
          className='w-full max-w-7xl px-4 mx-auto'
        />
        <BackgroundBubble />
        <div className='lg:flex justify-center w-3/4 mx-auto md:py-50'>
          <ProfileImage
            src="/images/profile.jpeg"
            className='md:grow place-items-center'
          />
          <Greetings
            title={greetings.title}
            subTitle={greetings.subTitle}
            message={greetings.message}
            className='lg:grow mx-3 my-6'
            socialNetworks={greetings.links}
          />
        </div>
      </div>

      <Skill
        className="xl:w-1/2 w-3/4 text-gray-900 mx-auto my-20"
        text={androidSkills.text}
        imageOnTheLeft={false}
        descriptions={androidSkills.descriptions}
        largeImageSrc={androidSkills.imageUrl} />

      <Skill
        className="xl:w-1/2 w-3/4 text-gray-900 mx-auto my-20"
        text={leadershipSkills.text}
        imageOnTheLeft={true}
        descriptions={leadershipSkills.descriptions}
        largeImageSrc={leadershipSkills.imageUrl} />

      <Footer/>
    </div>
  )
}
