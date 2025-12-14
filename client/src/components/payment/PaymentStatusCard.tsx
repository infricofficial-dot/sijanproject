import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentStatusCardProps {
  method: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  transactionId?: string | null;
  amount: string;
  date: string;
}

export function PaymentStatusCard({ method, status, transactionId, amount, date }: PaymentStatusCardProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: CheckCircle,
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          badgeVariant: "default" as const,
          label: "Completed"
        };
      case "PENDING":
        return {
          icon: Clock,
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
          badgeVariant: "secondary" as const,
          label: "Pending"
        };
      case "FAILED":
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          badgeVariant: "destructive" as const,
          label: "Failed"
        };
      default:
        return {
          icon: Clock,
          color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
          badgeVariant: "outline" as const,
          label: "Unknown"
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${status === "COMPLETED" ? "bg-green-500" : status === "PENDING" ? "bg-yellow-500" : "bg-red-500"}`} />
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            Payment Details
          </span>
          <Badge variant={config.badgeVariant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Method</p>
            <p className="font-semibold capitalize text-lg">{method}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
            <p className="font-semibold text-lg">{amount}</p>
          </div>
        </div>

        {transactionId && (
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Transaction ID</p>
            <p className="font-mono text-sm font-medium break-all">{transactionId}</p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Payment processed on {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
