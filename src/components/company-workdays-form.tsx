"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { updateCompanyWorkingDays } from "@/lib/actions/adminAction";
// import { updateCompanyWorkingDays } from "@/lib/actions/admin-actions";
const weekdays = [
  {
    label: "Monday",
    id: "monday",
  },
  {
    label: "Tuesday",
    id: "tuesday",
  },
  {
    label: "Wednesday",
    id: "wednesday",
  },
  {
    label: "Thursday",
    id: "thursday",
  },
  {
    label: "Friday",
    id: "friday",
  },
  {
    label: "Saturday",
    id: "saturday",
  },
  {
    label: "Sunday",
    id: "sunday",
  },
];

interface CompanyWorkingDaysFormProps {
  initialWorkingDays: string[];
}

const CompanyWorkingDaysForm = ({
  initialWorkingDays,
}: CompanyWorkingDaysFormProps) => {


  const [selectedDays, setSelectedDays] =
    useState<string[]>(initialWorkingDays);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(initialWorkingDays);
  }, [initialWorkingDays]); // Log the initial working days     

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }; // Toggle the selected day 

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      const data = await updateCompanyWorkingDays(selectedDays);
      if (data.success) {
        toast.success("Working days updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update working days");
      setError("Failed to update working days");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant={"destructive"}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Select Working Days</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weekdays.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={selectedDays.includes(day.id)}
                  onCheckedChange={() => handleDayToggle(day.id)}
                />
                <Label htmlFor={day.id}>{day.label}</Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};



export default CompanyWorkingDaysForm;

