import OnboardingForm from "@/components/onboarding-form";
import {currentUser} from "@clerk/nextjs/server";
import {Loader2} from 'lucide-react'

export default async function Onboarding() {
    const user = await currentUser()

    if(!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin" size={24} />
            </div>
        )
    }



  return (
    <div className="container max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">
            Complete your profile
        </h1>
        <OnboardingForm 
        firstName={user.firstName || ''}
        lastName={user.lastName || ''}
        userEmail={user.emailAddresses[0]?.emailAddress || ''}
        />
    </div>
  )
}
