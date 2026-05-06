"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "./StepIndicator"
import { Step1CoreInfo } from "./steps/Step1CoreInfo"
import { Step2CompensationLocation } from "./steps/Step2CompensationLocation"
import { Step3Description } from "./steps/Step3Description"
import { z } from "zod"
import { jobListingSchema } from "../actions/schemas"

const STEP_LABELS = ["Core Info", "Compensation & Location", "Description"]

const STEP_FIELDS = {
  1: ["title", "type", "experienceLevel"] as const,
  2: [
    "wage",
    "wageInterval",
    "locationRequirement",
    "city",
    "country",
  ] as const,
}

interface JobListingWizardProps {
  isEditing: boolean
  isSubmitting: boolean
}

export function JobListingWizard({
  isEditing,
  isSubmitting,
}: JobListingWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const form = useFormContext<z.infer<typeof jobListingSchema>>()

  async function handleNext() {
    const fields = STEP_FIELDS[currentStep as 1 | 2]
    const valid = await form.trigger(fields as any)
    if (valid) setCurrentStep(prev => (prev + 1) as 2 | 3)
  }

  function handleBack() {
    setCurrentStep(prev => (prev - 1) as 1 | 2)
  }

  return (
    <div className="space-y-8">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={3}
        stepLabels={STEP_LABELS}
      />

      <div>
        {currentStep === 1 && <Step1CoreInfo />}
        {currentStep === 2 && <Step2CompensationLocation />}
        {currentStep === 3 && (
          <Step3Description
            isEditing={isEditing}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className={currentStep === 1 ? "invisible" : ""}
        >
          Back
        </Button>
        {currentStep < 3 && (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
