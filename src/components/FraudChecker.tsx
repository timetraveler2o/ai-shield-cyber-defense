
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Shield, AlertTriangle, CheckCircle, AlertCircle, ExternalLink, Link2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type CheckResult = {
  safe: boolean;
  score: number;
  threats: string[];
  details: string;
};

export function FraudChecker() {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const analyzeFraud = (input: string) => {
    // This is a mock implementation - in a real app you would call an AI service
    setIsChecking(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Check for common fraud indicators (this is simplified for demo)
      const lowerInput = input.toLowerCase();
      const threats: string[] = [];
      let score = 0;
      let isSafe = true;
      
      // Check for suspicious keywords
      const suspiciousTerms = [
        "urgent", "password", "bank account", "credit card", "verify", 
        "suspended", "login", "update your information", "gift card",
        "lottery", "won", "free", "investment opportunity", "bitcoin"
      ];
      
      suspiciousTerms.forEach(term => {
        if (lowerInput.includes(term)) {
          threats.push(`Contains suspicious term: "${term}"`);
          score += 15;
        }
      });
      
      // Check for suspicious URLs
      if (lowerInput.includes("http")) {
        // Look for suspicious URL patterns
        if (!/https:\/\//.test(lowerInput) && /http:\/\//.test(lowerInput)) {
          threats.push("Uses insecure HTTP instead of HTTPS");
          score += 20;
        }
        
        // Check for suspicious domains
        const suspiciousDomains = [
          "amaz0n", "paypaI", "g00gle", "faceb00k", "apple-id", 
          "secure-bank", "verify-account", "login-secure"
        ];
        
        suspiciousDomains.forEach(domain => {
          if (lowerInput.includes(domain)) {
            threats.push(`Contains suspicious domain: "${domain}"`);
            score += 25;
          }
        });
      }
      
      // Add more checks for specific fraud patterns
      if (lowerInput.includes("account suspended") || lowerInput.includes("verify your account")) {
        threats.push("Contains account verification phishing attempt");
        score += 30;
      }
      
      if (lowerInput.includes("payment") && lowerInput.includes("urgent")) {
        threats.push("Urgent payment request - potential scam");
        score += 35;
      }
      
      // Determine safety based on score
      if (score >= 50) {
        isSafe = false;
      }
      
      // Generate details
      let details = isSafe 
        ? "No significant fraud indicators detected." 
        : "This content contains multiple fraud indicators and may be attempting to scam users.";
      
      if (threats.length > 0) {
        details += " Specific concerns have been identified and are listed above.";
      }
      
      setCheckResult({
        safe: isSafe,
        score: score,
        threats: threats,
        details: details
      });
      
      setIsChecking(false);
      
      toast({
        title: isSafe ? "Analysis Complete: Likely Safe" : "Warning: Potential Fraud Detected",
        description: isSafe ? "No significant fraud indicators found" : "This may be fraudulent content",
        variant: isSafe ? "default" : "destructive",
      });
    }, 1500);
  };

  const handleCheck = () => {
    const input = url || content;
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a URL or paste content to analyze",
        variant: "destructive"
      });
      return;
    }
    
    analyzeFraud(input);
  };

  return (
    <Card className="border-cyber-primary/20 bg-cyber-dark">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-cyber-primary" />
          Fraud Detection Tool
        </CardTitle>
        <CardDescription>
          Check websites, messages or content for fraud indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <Link2 className="mr-2 h-4 w-4 text-cyber-muted" />
              <label htmlFor="url" className="text-sm font-medium">
                Check URL for fraud
              </label>
            </div>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={() => setUrl("")}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-cyber-muted">OR</div>
          
          <div>
            <div className="flex items-center mb-2">
              <ExternalLink className="mr-2 h-4 w-4 text-cyber-muted" />
              <label htmlFor="content" className="text-sm font-medium">
                Paste text to analyze
              </label>
            </div>
            <Textarea
              id="content"
              placeholder="Paste email, message or other content to check for fraud"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleCheck}
            disabled={isChecking}
          >
            {isChecking ? 'Analyzing...' : 'Check for Fraud'}
          </Button>
          
          {checkResult && (
            <div className={`mt-4 p-4 rounded-md ${
              checkResult.safe ? 'bg-green-900/20' : 'bg-red-900/20'
            }`}>
              <div className="flex items-center mb-3">
                {checkResult.safe ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <h3 className="font-semibold">
                  {checkResult.safe ? 'No significant fraud detected' : 'Potential fraud detected'}
                </h3>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Fraud Score</span>
                  <span className={
                    checkResult.score < 30 ? 'text-green-400' :
                    checkResult.score < 60 ? 'text-amber-400' : 'text-red-400'
                  }>
                    {checkResult.score}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      checkResult.score < 30 ? 'bg-green-500' :
                      checkResult.score < 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${checkResult.score}%` }}
                  />
                </div>
              </div>
              
              {checkResult.threats.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold mb-2">Detected Issues:</h4>
                  <ul className="space-y-1">
                    {checkResult.threats.map((threat, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-sm">{checkResult.details}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
