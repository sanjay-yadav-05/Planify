import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Users, Calendar, Award } from "lucide-react"
import FeaturedEvents from "@/components/featured-events"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Connect, Collaborate, Create Communities
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Join communities, participate in events, and connect with like-minded individuals on our platform.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="px-8">Get Started</Button>
              </Link>
               <Link href="/communities">
                <Button variant="outline" className="px-8">
                  Explore Communities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/50 rounded-lg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Join Communities</CardTitle>
                <CardDescription>Connect with communities that match your interests</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Become a member of existing communities or create your own. Invite others and grow together.</p>
              </CardContent>
              <CardFooter>
                <Link href="/communities">
                  <Button variant="ghost" className="gap-1">
                    Browse Communities <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Discover Events</CardTitle>
                <CardDescription>Find and participate in events organized by communities</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Register for events, ask questions, and provide feedback to help improve future experiences.</p>
              </CardContent>
              <CardFooter>
                <Link href="/events">
                  <Button variant="ghost" className="gap-1">
                    View Events <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Lead Clubs</CardTitle>
                <CardDescription>Create and manage clubs within your community</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Organize events, assign tasks, and utilize AI tools to generate content and certificates.</p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button variant="ghost" className="gap-1">
                    Manage Clubs <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
          <FeaturedEvents />
        </div>
      </section>
    </div>
  )
}

