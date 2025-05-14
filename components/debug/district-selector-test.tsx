"use client"

import { useState, useEffect } from "react"
import { sriLankaDistricts } from "@/lib/sri-lanka-data"
import { logDataLoading, validateData } from "@/lib/debug-utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DistrictSelector } from "@/components/district-selector"

export function DistrictSelectorTest() {
  const [district, setDistrict] = useState("")
  const [districtCount, setDistrictCount] = useState(0)

  useEffect(() => {
    // Log the districts data for debugging
    logDataLoading("DistrictSelectorTest", sriLankaDistricts)
    validateData("DistrictSelectorTest", sriLankaDistricts, 25)
    setDistrictCount(sriLankaDistricts.length)
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>District Selector Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm mb-2">Available Districts: {districtCount}</p>
          <DistrictSelector value={district} onChange={setDistrict} />
        </div>

        {district && (
          <div className="p-4 bg-muted rounded-md">
            <p>
              Selected District: <strong>{district}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
