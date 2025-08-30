import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface MedicalDisclaimerProps {
  onAccept: () => void;
}

export function MedicalDisclaimer({ onAccept }: MedicalDisclaimerProps) {
  const [open, setOpen] = useState(true);

  const handleAccept = () => {
    setOpen(false);
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-gradient-soft border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Important Medical Disclaimer
          </DialogTitle>
          <DialogDescription className="text-base mt-4 space-y-4">
            <p>
              <strong>DermAI Advisor</strong> is an informational tool designed to provide
              general skin care guidance based on publicly available information and
              community experiences.
            </p>
            
            <Alert className="border-destructive/30 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle>Not Medical Advice</AlertTitle>
              <AlertDescription>
                This platform does NOT provide medical diagnosis, treatment, or
                professional medical advice. It is not a substitute for consultation
                with a qualified dermatologist or healthcare provider.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">By using this service, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The information provided is for educational purposes only</li>
                <li>You should consult a dermatologist for any medical concerns</li>
                <li>Individual results may vary significantly</li>
                <li>You should discontinue use if you experience adverse reactions</li>
                <li>Product recommendations are based on aggregated data, not medical expertise</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              For emergency medical conditions, please contact your healthcare provider
              immediately or call emergency services.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => window.location.href = "https://www.aad.org/find-a-derm"}
            className="sm:mr-auto"
          >
            Find a Dermatologist
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            I Understand & Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}