"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { useRouter } from "next/navigation"

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<string>("")
  const router = useRouter()
  
  const nextStep = () => {
    if (step < 4) setStep(step + 1)
    else router.push("/dashboard") // Redirect to dashboard
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col relative overflow-hidden">
      <div className="absolute top-8 left-8">
        <BrandLogo />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue-500" : "bg-gray-200"}`} 
              />
            ))}
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold">Academic Profile</h2>
                    <p className="text-gray-500">Tell us about your educational background.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>College / University</Label>
                      <Input placeholder="E.g. Stanford University" />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch / Specialization</Label>
                      <Input placeholder="E.g. Computer Science" />
                    </div>
                    <div className="space-y-2">
                      <Label>Graduation Year</Label>
                      <Input type="number" placeholder="2027" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold">Skills & Interests</h2>
                    <p className="text-gray-500">What do you bring to the table?</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Top Skills (comma separated)</Label>
                      <Input placeholder="React, Python, Figma..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Project Interests</Label>
                      <Input placeholder="Web3, AI, Fintech..." />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold">Your Goals</h2>
                    <p className="text-gray-500">What are you looking to achieve?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Team", "Hackathon", "Startup", "Research", "Open Source", "College Project"].map(goal => (
                      <div 
                        key={goal} 
                        onClick={() => setSelectedGoal(goal)}
                        className={`p-4 border rounded-xl cursor-pointer transition-colors text-sm text-center ${selectedGoal === goal ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-200 hover:bg-gray-100 text-gray-900'}`}
                      >
                        {goal}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center pt-8"
                >
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Privacy First</h2>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                      We never expose your email, phone, or exact address.
                    </p>
                    <div className="p-6 border border-blue-500/30 bg-blue-500/10 rounded-2xl mb-8">
                       <h3 className="font-semibold text-blue-400 mb-2">Anonymous Mode: ON</h3>
                       <p className="text-sm text-blue-200/70">Your profile will be hidden until you request a connection.</p>
                    </div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Your Synqverse is ready.</h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} className="flex-1 border-gray-200 text-gray-900">
                Back
              </Button>
            )}
            <Button onClick={nextStep} className="flex-1 bg-orange-500 text-white hover:bg-orange-600">
              {step === 4 ? "Enter Dashboard" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
