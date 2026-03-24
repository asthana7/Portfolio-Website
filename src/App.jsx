import { useEffect, useMemo, useState} from "react"
import TurntableScene from "./components/TurntableScene"
import Overlay from "./components/Overlay"
import "./index.css"

const sections = [
  {
    id: "about",
    side: "SIDE A",
    track: "TRACK 01",
    title: "About Me",
    subtitle: "Machine Learning • Software Engineering • Creative Computing",
    duration: "Expected Graduation: May 2027",
    tags: ["UIUC", "ML", "Creative Tech", "Computer Vision"],
    theme: {
      labelColor: "#efe3cf",
      labelText: "#24180f",
      waveformColor: "#caa4ff",
    },
    content: [
      "I’m a junior at University of Illinois Urbana-Champaign studying Brain and Cognitive Science, with minors in Computer Science and Game Studies & Design.",
      "I enjoy building projects that combine machine learning, creativity, computer vision, and human-centered design.",
      "I’m especially interested in neural networks, multimodal technology, and interactive systems."
    ]
  },
  {
    id: "experience",
    side: "SIDE A",
    track: "TRACK 02",
    title: "Work Experience",
    subtitle: "Internships, research, and technical work",
    duration: "2024 – Present",
    tags: ["Internships", "Research", "Engineering"],
    theme: {
      labelColor: "#d6b06f",
      labelText: "#24180f",
      waveformColor: "#f0c27b",
    },
    items: [
      {
        title: "System Integrity",
        subtitle: "UIDAI / Enforcement Division",
        labelLine: "Python • APIs • Digital Forensics",
        badge: "DATABASE FRAUD DETECTION",
        accent: "#d9a2b4",
        color: "#4a1825",
        period: "June 2025 - August 2025",
        summary: "Workflow automation, fraud detection, and technical investigations",
        details: [
          "Built Python automation software for increased efficiency, reducing manual effort up to 40% across enforcement workflows",
          "API and database analysis using MySQL Workbench",
          "Forensic analysis support and technical investigations of over 20 unauthorized websites"
        ],
        stack: ["Python", "MySQL", "APIs", "Forensic Analysis of Digital Services"]
      },
      {
        title: "CultFit / CleverHarvey",
        subtitle: "Tech Intern",
        labelLine: "Java • React Native • App Development",
        badge: "APP DEVELOPMENT",
        accent: "#493c71ff",
        color: "#18372f",
        period: "July 2024 - August 2024",
        summary: "MVP App Development with a focus on health and recommendation algorithms",
        details: [
          "Built an MVP for an app capable of generating personalized fitness plans for a wide array of user needs",
          "Worked with Java, React Native, and Python",
          "Contributed to product-focused technical implementation"
        ],
        stack: ["Java", "React Native", "Python"]
      },
      
      {
        title: "Cognitive and Social Perception Research Lab (CASPER)",
        subtitle: "Undergraduate Research Assistant",
        labelLine: "Python • Data Collection • Experimental Pipeline Construction",
        badge: "COGNITIVE RESEARCH",
        accent: "#b8b5ff",
        color: "#23183f",
        period: "September 2025 - Present",
        summary: "Psychological and cognitive research design using Python and machine learning software",
        details: [
          "Experimental design and data collection",
          "Python-based analysis",
          "Research support in cognition and social perception"
        ],
        stack: ["Python", "IRB protocols", "Experiment Design and Pipeline Construction"]
      }
    ]
  },
  {
    id: "projects",
    side: "SIDE B",
    track: "TRACK 01",
    title: "Projects",
    subtitle: "Machine Learning, Creative Tech, Multimodal and Interactive systems",
    duration: "Ongoing",
    tags: ["AI", "Music Tech", "Computer Vision"],
    theme: {
      labelColor: "#c9a0ff",
      labelText: "#1d1030",
      waveformColor: "#b388ff",
    },
    items: [

      {
        title: "Visual ASL Teacher",
        subtitle: "Computer Vision + Machine Learning",
        labelLine: "Multimodal system • Real-time Interaction • Teachable Machine",
        badge: "VISUAL MACHINE LEARNING",
        accent: "#c8b6ff",//"#8ed8ff",
        color: "#2a1d46",//"#16263f",
        period: "November 2025",
        summary: "Learn American Sign Language by signing along to your favorite songs and receive feedback in real-time",
        details: [
          "Audio and feedback-based learning platform for American Sign Language",
          "Uses computer vision and transfered learning through Teachable Machine ",
          "Designed to make ASL learning more interactive, accessible and engaging"
        ],
        stack: ["Python", "OpenCV", "Mediapipe", "Machine Learning"]
      },
      
      {
        title: "Neurify",
        subtitle: "EEG-based Music Recommender",
        labelLine: "Python • Data Processing • Adaptive Algorithm Design",
        badge: "NEURAL SIGNAL PROCESSING",
        accent: "#9cd3ba",
        color: "#18372f",
        period: "October 2025 - Present",
        summary: "We know your music taste better than you",
        details: [
          "Recommends and queues music according to EEG-data, which contains data regarding focus and mood",
          "Aims to improve concentration and mood by adapting to the electrical activity in the brain",
          "Connects brain signals with music personalization"
        ],
        stack: ["Python", "EEG Data Interpretation", "Recommendation System"]
      },
      

      {
        title: "DJ Artificial",
        subtitle: "Hopfield Networks + Music Tech",
        labelLine: "Python • Machine Learning Principles • Audio Engineering",
        badge: "MUSIC INTELLIGENCE",
        accent: "#d9a2b4",
        color: "#4a1825",
        period: "February 2026 - Present",
        summary: "Employ DJ Artifical as your DJ assistant to help with transitions and creating a full set.",
        details: [
          "Music intelligence system inspired by Hopfield neural networks",
          "Explores assistance for production and mixing",
          "Combines machine learning, music systems, and creative tooling"
        ],
        stack: ["Python", "Neural Networks", "Audio Engineering"]
      }
    ]
  },

  {
  id: "contact",
  side: "SIDE B",
  track: "TRACK 02",
  title: "Get in Contact",
  subtitle: "Links, recs, and ways to reach me",
  duration: "Open",
  tags: ["Resume", "GitHub", "LinkedIn", "Playlist"],
  theme: {
    labelColor: "#d8c6d8",
    labelText: "#241624",
    waveformColor: "#e4b6d9",
  },
  links: [
    {
      label: "Email",
      value: "asthana7@illinois.edu",
      href: "mailto:asthana7@illinois.edu"
    },
    {
      label: "GitHub",
      value: "github.com/asthana7",
      href: "https://github.com/asthana7"
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/asthana7",
      href: "https://www.linkedin.com/in/ananya-asthana-46a5a53b4"
    },
    {
      label: "Resume",
      value: "Download PDF",
      href: `${import.meta.env.BASE_URL}resume.pdf`
    },
    {
      label: "Spotify Playlist",
      value: "Recommendations by yours truly",
      href: "https://shorturl.at/NK40u"
    }
  ]
}
]

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)
  const [isSleeveOpen, setIsSleeveOpen] = useState(false)

  const activeSection = useMemo(() => sections[activeIndex], [activeIndex])
  useEffect(() => {
    setSelectedItemIndex(0)
    setIsSleeveOpen(false)
  }, [activeIndex])

  return (
    <div className="app-shell">
      <TurntableScene
        activeIndex={activeIndex}
        activeSection={activeSection}
        selectedItemIndex={selectedItemIndex}
        setSelectedItemIndex={setSelectedItemIndex}
        setActiveIndex={setActiveIndex}
        isSleeveOpen={isSleeveOpen}
        setIsSleeveOpen={setIsSleeveOpen}
      />

      <Overlay
        sections={sections}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        selectedItemIndex={selectedItemIndex}
        setSelectedItemIndex={setSelectedItemIndex}
        isSleeveOpen={isSleeveOpen}
        setIsSleeveOpen={setIsSleeveOpen}
      />

    </div>
  )
}