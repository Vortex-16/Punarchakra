import NavigationHeader from "@/components/landing/NavigationHeader";

import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CoreFeatures from "@/components/landing/CoreFeatures";
import TrustSection from "@/components/landing/TrustSection";
import ImpactSection from "@/components/landing/ImpactSection";
import AccessibilitySection from "@/components/landing/AccessibilitySection";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <NavigationHeader />
            <main>
                <HeroSection />
                <HowItWorks />
                <CoreFeatures />
                <TrustSection />
                <ImpactSection />
                <AccessibilitySection />
                <FinalCTA />
            </main>
            <LandingFooter />
        </div>
    );
}
