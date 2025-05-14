import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Projects | CodeCraftix Technologies",
  description: "Explore the innovative projects developed by CodeCraftix Technologies.",
}

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-12 md:py-16 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/20 dark:to-transparent">
          <div className="container">
            <ScrollAnimation
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold">Our Projects</h1>
              <p className="text-xl text-muted-foreground">Innovative solutions crafted with passion and expertise</p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "PetReunite",
                  description: "A platform to help reunite lost pets with their owners across Sri Lanka.",
                  image: "/placeholder.svg?height=600&width=800&query=pet finder app interface",
                  tags: ["Next.js", "Tailwind CSS", "Redis", "Vercel"],
                  link: "/",
                },
                {
                  title: "MediTrack",
                  description: "A healthcare management system for tracking patient records and appointments.",
                  image: "/placeholder.svg?height=600&width=800&query=medical app dashboard",
                  tags: ["React", "Node.js", "MongoDB", "AWS"],
                  link: "#",
                },
                {
                  title: "EduConnect",
                  description: "An e-learning platform connecting students with tutors for personalized learning.",
                  image: "/placeholder.svg?height=600&width=800&query=education platform interface",
                  tags: ["Vue.js", "Firebase", "Tailwind CSS"],
                  link: "#",
                },
                {
                  title: "AgriTech",
                  description:
                    "Smart farming solution using IoT sensors to monitor crop health and optimize irrigation.",
                  image: "/placeholder.svg?height=600&width=800&query=agriculture technology dashboard",
                  tags: ["IoT", "React", "Python", "TensorFlow"],
                  link: "#",
                },
                {
                  title: "TourGuide",
                  description: "A mobile app for tourists to discover local attractions and experiences in Sri Lanka.",
                  image: "/placeholder.svg?height=600&width=800&query=travel guide app interface",
                  tags: ["React Native", "GraphQL", "MongoDB"],
                  link: "#",
                },
                {
                  title: "FinTrack",
                  description:
                    "Personal finance management tool for budgeting, expense tracking, and financial planning.",
                  image: "/placeholder.svg?height=600&width=800&query=finance app dashboard",
                  tags: ["Angular", "Node.js", "PostgreSQL"],
                  link: "#",
                },
              ].map((project, index) => (
                <ScrollAnimation
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="ghost" className="w-full group">
                        <Link href={project.link}>
                          View Project
                          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-brand-600 dark:bg-brand-900 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <ScrollAnimation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold">Have a project in mind?</h2>
              </ScrollAnimation>
              <ScrollAnimation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-xl text-brand-100">
                  Let's collaborate to bring your vision to life with our technical expertise.
                </p>
              </ScrollAnimation>
              <ScrollAnimation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Start a Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScrollAnimation>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
