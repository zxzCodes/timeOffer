import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, BarChart } from 'lucide-react'
import { MobileNav } from "@/components/common/mobile-nav"
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper"

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-white z-40">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">TimeOffer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            How it works
          </Link>
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
          
          {/* Auth buttons for desktop */}
          <div className="flex items-center gap-4 ml-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <MobileNav />
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-10 md:py-20 lg:py-24 xl:py-44">
          <MaxWidthWrapper>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl/none font-bold tracking-tighter">
                    Effortless Time Off Management
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Streamline your company&apos;s time off requests and approvals with our intuitive platform.
                  </p>
                </div>

                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <Button className="bg-black hover:bg-gray-800 text-white">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <Button className="bg-black hover:bg-gray-800 text-white" asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </SignedIn>
                  <Button variant="outline" className="border-black text-black hover:bg-gray-100" asChild>
                    <Link href="/features">Learn More</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={"/horo.png"}
                    width={600}
                    height={400}
                    priority
                    className="w-full h-auto object-cover"
                    alt="dashboard screenshot"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/20 to-transparent h-8"></div>
                </div>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        <section className="w-full py-10 md:py-20 lg:py-24 xl:py-44 bg-gray-50">
          <MaxWidthWrapper>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-center dark:text-gray-400">
                  Discover the powerful features that make TimeOffer the best choice for managing time off requests.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-center gap-6 py-10 lg:grid-cols-3 lg:gap-12">
              <Card className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <Calendar className="w-10 h-10 text-black" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Easy Request Submission</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Employees can submit time off requests in just a few clicks, making the process quick and
                        efficient.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <Clock className="w-10 h-10 text-black" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Automated Approvals</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Streamline the approval process with customizable workflows that notify managers and track
                        status automatically.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-center space-y-4">
                    <BarChart className="w-10 h-10 text-black" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">Comprehensive Reporting</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Generate detailed reports on time off usage, patterns, and availability across teams and
                        departments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </MaxWidthWrapper>
        </section>
      </main>
    </div>
  )
}
