import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  showDashboard?: boolean;
  onNewConsultation?: () => void;
}

export function Header({ showDashboard, onNewConsultation }: HeaderProps) {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DermAI Advisor
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-sm hover:text-primary transition-colors">
              Features
            </a>
            <a href="https://www.aad.org/find-a-derm" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
              Find a Dermatologist
            </a>
            {showDashboard && (
              <Button
                onClick={onNewConsultation}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                New Consultation
              </Button>
            )}
          </nav>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through DermAI Advisor
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
                  How It Works
                </a>
                <a href="#features" className="text-sm hover:text-primary transition-colors">
                  Features
                </a>
                <a href="https://www.aad.org/find-a-derm" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
                  Find a Dermatologist
                </a>
                {showDashboard && (
                  <Button
                    onClick={onNewConsultation}
                    className="bg-gradient-primary text-primary-foreground hover:opacity-90 w-full"
                  >
                    New Consultation
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}