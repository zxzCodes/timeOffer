import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-[95%] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:max-w-[1920px]",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper
