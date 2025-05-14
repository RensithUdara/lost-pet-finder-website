import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollAnimation } from "@/components/ui/scroll-animation"
import { ChevronRight, Code, Globe, Heart, Lightbulb, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | CodeCraftix Technologies",
  description: "Learn about CodeCraftix Technologies, our mission, values, and the team behind PetReunite.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/20 dark:to-transparent py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <ScrollAnimation
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  About <span className="text-brand-600 dark:text-brand-400">CodeCraftix</span> Technologies
                </h1>
                <p className="text-xl text-muted-foreground">
                  Crafting innovative solutions that make a difference in people's lives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      Contact Us <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    <Link href="/projects">Our Projects</Link>
                  </Button>
                </div>
              </ScrollAnimation>
              <ScrollAnimation
                className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/modern-tech-office-developers.png"
                  alt="CodeCraftix Technologies Office"
                  fill
                  className="object-cover"
                  priority
                />
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <ScrollAnimation
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
              <p className="text-xl text-muted-foreground">From a small startup to a leading technology company</p>
            </ScrollAnimation>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation
                className="order-2 md:order-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-6">
                  <p className="text-lg">
                    Founded in 2020, CodeCraftix Technologies began with a simple mission: to create technology that
                    improves lives. What started as a small team of passionate developers has grown into a dynamic
                    company at the forefront of technological innovation.
                  </p>
                  <p className="text-lg">
                    Our journey began with developing custom software solutions for local businesses. As our reputation
                    for quality and innovation grew, so did our team and our ambitions. Today, we specialize in web
                    applications, mobile development, and AI-driven solutions that serve clients across Sri Lanka and
                    beyond.
                  </p>
                  <p className="text-lg">
                    PetReunite is one of our flagship projects, born from our desire to use technology for social good.
                    By helping reunite lost pets with their owners, we're making a tangible difference in our community.
                  </p>
                </div>
              </ScrollAnimation>
              <ScrollAnimation
                className="order-1 md:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Image src="/placeholder-85a2q.png" alt="Our Team Collaborating" fill className="object-cover" />
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <ScrollAnimation
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
            </ScrollAnimation>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Code className="h-10 w-10 text-brand-600" />,
                  title: "Technical Excellence",
                  description:
                    "We're committed to writing clean, efficient code and staying at the cutting edge of technology.",
                },
                {
                  icon: <Heart className="h-10 w-10 text-coral-500" />,
                  title: "Social Impact",
                  description:
                    "We believe technology should be a force for good, creating solutions that address real social needs.",
                },
                {
                  icon: <Users className="h-10 w-10 text-brand-600" />,
                  title: "Collaborative Spirit",
                  description:
                    "We value teamwork and believe the best solutions come from diverse perspectives working together.",
                },
                {
                  icon: <Lightbulb className="h-10 w-10 text-coral-500" />,
                  title: "Innovation",
                  description: "We're not afraid to think differently and push boundaries to solve complex problems.",
                },
                {
                  icon: <Globe className="h-10 w-10 text-brand-600" />,
                  title: "Accessibility",
                  description:
                    "We design inclusive products that can be used by everyone, regardless of ability or background.",
                },
                {
                  icon: <Users className="h-10 w-10 text-coral-500" />,
                  title: "Client Partnership",
                  description: "We see our clients as partners and work closely with them to achieve their goals.",
                },
              ].map((value, index) => (
                <ScrollAnimation
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-800">
                    <CardContent className="p-6 space-y-4">
                      <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-900/30 w-fit">{value.icon}</div>
                      <h3 className="text-xl font-semibold">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <ScrollAnimation
              className="max-w-3xl mx-auto text-center space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold">Our Team</h2>
              <p className="text-xl text-muted-foreground">Meet the talented people behind CodeCraftix Technologies</p>
            </ScrollAnimation>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Amal Perera",
                  role: "Founder & CEO",
                  image: "/placeholder-bdae0.png",
                },
                {
                  name: "Priya Jayawardena",
                  role: "CTO",
                  image: "/placeholder-zlfrq.png",
                },
                {
                  name: "Dinesh Kumar",
                  role: "Lead Developer",
                  image: "/placeholder-4qdqf.png",
                },
                {
                  name: "Tharushi Silva",
                  role: "UX Designer",
                  image: "/placeholder-bvx0k.png",
                },
                {
                  name: "Nuwan Bandara",
                  role: "Backend Developer",
                  image:
                    "/placeholder.svg?height=400&width=400&query=professional headshot of south asian male developer",
                },
                {
                  name: "Malini Gunaratne",
                  role: "Project Manager",
                  image:
                    "/placeholder.svg?height=400&width=400&query=professional headshot of south asian female project manager",
                },
                {
                  name: "Rajiv Mendis",
                  role: "Mobile Developer",
                  image:
                    "/placeholder.svg?height=400&width=400&query=professional headshot of south asian male app developer",
                },
                {
                  name: "Lakshmi Perera",
                  role: "QA Engineer",
                  image:
                    "/placeholder.svg?height=400&width=400&query=professional headshot of south asian female QA engineer",
                },
              ].map((member, index) => (
                <ScrollAnimation
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                >
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-muted-foreground">{member.role}</p>
                    </CardContent>
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
                <h2 className="text-3xl md:text-4xl font-bold">Ready to work with us?</h2>
              </ScrollAnimation>
              <ScrollAnimation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-xl text-brand-100">
                  Let's discuss how CodeCraftix Technologies can help bring your ideas to life.
                </p>
              </ScrollAnimation>
              <ScrollAnimation
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">Get in Touch</Link>
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
