
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UPICheckResult {
  isRegistered: boolean;
  reportCount: number;
  riskLevel: "low" | "medium" | "high";
  lastReported?: string;
  details: string;
}

export function UPIFraudChecker() {
  const { toast } = useToast();
  const [upiId, setUpiId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<UPICheckResult | null>(null);

  // This is a mock database of known fraudulent UPI IDs and phone numbers
  // In a real application, this would come from a backend database
  const fraudDatabase = {
    upiIds: [
      "scammer@ybl", 
      "fraud@okicici", 
      "payment@paytm.fraud",
      "refund@axl"
    ],
    phoneNumbers: [
      "9876543210", 
      "8765432109", 
      "7654321098"
    ],
    // Mapping of UPI ID patterns to report counts (simplified mock)
    reportCounts: {
      "scammer@": 42,
      "fraud@": 29,
      "refund@": 15,
      "payment@": 7
    }
  };

  const checkUPIFraud = () => {
    if ((!upiId || !upiId.includes("@")) && (!phoneNumber || phoneNumber.length < 10)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid UPI ID or phone number",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);

    // Simulate API call delay
    setTimeout(() => {
      let isRegistered = false;
      let reportCount = 0;
      let riskLevel: "low" | "medium" | "high" = "low";
      let lastReported = "";
      let details = "";

      // Check if UPI ID exists in fraud database
      if (upiId) {
        isRegistered = fraudDatabase.upiIds.some(id => id === upiId);
        
        // Check for pattern matches
        Object.entries(fraudDatabase.reportCounts).forEach(([pattern, count]) => {
          if (upiId.includes(pattern)) {
            reportCount = count;
          }
        });
      }

      // Check if phone number exists in fraud database
      if (phoneNumber && !isRegistered) {
        isRegistered = fraudDatabase.phoneNumbers.some(num => num === phoneNumber);
        if (isRegistered) {
          reportCount = Math.floor(Math.random() * 30) + 5; // Random number between 5-35
        }
      }

      // Generate random dates for demonstration
      const randomDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      };

      // If no exact match but has some reports, simulate partial match
      if (!isRegistered && !reportCount) {
        // 20% chance of having some reports anyway (similar patterns)
        if (Math.random() < 0.2 && upiId) {
          reportCount = Math.floor(Math.random() * 5) + 1;
        }
      }

      // Determine risk level based on report count
      if (reportCount > 20) {
        riskLevel = "high";
      } else if (reportCount > 5) {
        riskLevel = "medium";
      } else {
        riskLevel = "low";
      }

      // Set the last reported date if there are reports
      if (reportCount > 0) {
        lastReported = randomDate();
      }

      // Generate appropriate details message
      if (isRegistered) {
        details = `This ${upiId ? "UPI ID" : "phone number"} has been reported multiple times for fraudulent activities. Exercise extreme caution and do not send money to this account.`;
      } else if (reportCount > 0) {
        details = `This ${upiId ? "UPI ID" : "phone number"} has some reports of suspicious activity. Verify the recipient before proceeding with any transaction.`;
      } else {
        details = `No fraud reports found for this ${upiId ? "UPI ID" : "phone number"}. However, always verify the recipient before sending money.`;
      }

      // Set the check result
      setCheckResult({
        isRegistered,
        reportCount,
        riskLevel,
        lastReported: reportCount > 0 ? lastReported : undefined,
        details
      });

      setIsChecking(false);

      // Show toast notification
      toast({
        title: isRegistered 
          ? "Warning: Fraudulent Account Detected" 
          : reportCount > 0 
            ? "Caution: Some Reports Found" 
            : "Check Complete: No Reports Found",
        description: details.substring(0, 100) + (details.length > 100 ? "..." : ""),
        variant: isRegistered ? "destructive" : reportCount > 0 ? "default" : "default"
      });
    }, 1500);
  };

  const handleReset = () => {
    setUpiId("");
    setPhoneNumber("");
    setCheckResult(null);
  };

  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-cyber-primary" />
          UPI Fraud Checker
        </CardTitle>
        <CardDescription>
          Verify if a UPI ID or phone number has been reported for fraud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">UPI ID</label>
            <Input
              placeholder="Enter UPI ID (e.g., name@okicici)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          
          <div className="text-center text-sm text-cyber-muted">OR</div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Phone Number</label>
            <Input
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setPhoneNumber(value);
                }
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              onClick={checkUPIFraud}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check UPI/Phone'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
          
          {checkResult && (
            <div className={`mt-4 p-4 rounded-md ${
              checkResult.riskLevel === "low" ? 'bg-green-900/20' : 
              checkResult.riskLevel === "medium" ? 'bg-amber-900/20' : 
              'bg-red-900/20'
            }`}>
              <div className="flex items-center mb-3">
                {checkResult.riskLevel === "low" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : checkResult.riskLevel === "medium" ? (
                  <Info className="h-5 w-5 text-amber-500 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <h3 className="font-semibold">
                  {checkResult.riskLevel === "low" 
                    ? 'Low Risk' 
                    : checkResult.riskLevel === "medium" 
                      ? 'Medium Risk' 
                      : 'High Risk'}
                </h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Reported Fraud Cases:</span>
                  <span className={
                    checkResult.reportCount === 0 ? 'text-green-400' :
                    checkResult.reportCount < 10 ? 'text-amber-400' : 'text-red-400'
                  }>
                    {checkResult.reportCount}
                  </span>
                </div>
                
                {checkResult.lastReported && (
                  <div className="flex justify-between">
                    <span>Last Reported:</span>
                    <span>{checkResult.lastReported}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>In Fraud Database:</span>
                  <span className={checkResult.isRegistered ? 'text-red-400' : 'text-green-400'}>
                    {checkResult.isRegistered ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p>{checkResult.details}</p>
                </div>
                
                {(checkResult.reportCount > 0 || checkResult.isRegistered) && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <Button variant="destructive" size="sm" className="w-full">
                      Report This Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
