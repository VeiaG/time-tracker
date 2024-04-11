import { Link } from "react-router-dom"


const AboutPage = () => {
  return (
    <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
            <div className="space-y-2 text-center">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Time Tracking
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Time tracking that's simple and powerful
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Track time with ease. Let your team focus on the work, not tracking their time.
              </p>
            </div>
            <div className="mx-auto max-w-sm space-y-2">
                <Link className="underline underline-offset-2" to="/">
                  Terms & Conditions
                </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center gap-4 px-4 md:px-6">
            
            <div className="space-y-4 text-center">
              <div className="space-y-2 inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Productivity
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Make every second count</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Time is your most valuable asset. Let's make the most of it.
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                The complete platform for building the Web
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Give your team the toolkit to stop configuring and start innovating. Securely build, deploy, and scale
                the best web experiences.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                to="/"
              >
                Get Started
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                to="/"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
  )
}

export default AboutPage