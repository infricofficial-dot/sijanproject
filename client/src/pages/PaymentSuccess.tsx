import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PaymentStatusCard } from "@/components/payment/PaymentStatusCard";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  tax: string;
  shippingCost: string;
  discount: string;
  total: string;
  createdAt: string;
  paidAt: string | null;
  items: Array<{
    productName: string;
    variantName: string | null;
    quantity: number;
    price: string;
    total: string;
  }>;
}

interface Payment {
  id: string;
  method: string;
  transactionId: string | null;
  amount: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
}

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderNumber = params.get("orderNumber");
      
      if (!orderNumber) {
        toast({
          title: "Error",
          description: "Order number not found",
          variant: "destructive"
        });
        setLocation("/");
        return;
      }

      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/track/${orderNumber}`, {
          credentials: "include"
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to fetch order details");
        }

        const orderData = await orderResponse.json();
        setOrder(orderData);

        // Fetch payment details
        const paymentResponse = await fetch(`/api/payments/order/${orderData.id}`, {
          credentials: "include"
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          setPayment(paymentData);
        }

        // Fetch shipping address
        if (orderData.shippingAddressId) {
          const addressResponse = await fetch(`/api/addresses/${orderData.shippingAddressId}`, {
            credentials: "include"
          });

          if (addressResponse.ok) {
            const addressData = await addressResponse.json();
            setShippingAddress(addressData);
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [setLocation, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="text-center mb-6">
        <CardHeader className="pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl" data-testid="text-payment-success">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {order && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-mono font-medium text-lg" data-testid="text-order-number">{order.orderNumber}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={order ? `/orders/${order.id}` : "/orders"}>
              <Button className="w-full sm:w-auto" data-testid="button-view-order">
                <Package className="w-4 h-4 mr-2" />
                View Order Details
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-continue-shopping">
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      {payment && (
        <div className="mb-6">
          <PaymentStatusCard 
            method={payment.method}
            status={payment.status}
            transactionId={payment.transactionId}
            amount={formatPrice(parseFloat(payment.amount))}
            date={payment.createdAt}
          />
        </div>
      )}

      {/* Order Summary */}
      {order && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(parseFloat(item.total))}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(parseFloat(order.subtotal))}</span>
              </div>
              {parseFloat(order.tax) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(parseFloat(order.tax))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{parseFloat(order.shippingCost) === 0 ? "FREE" : formatPrice(parseFloat(order.shippingCost))}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(parseFloat(order.discount))}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(parseFloat(order.total))}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      {shippingAddress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p className="text-sm text-muted-foreground">{shippingAddress.phone}</p>
              <p className="text-sm text-muted-foreground">{shippingAddress.addressLine1}</p>
              {shippingAddress.addressLine2 && (
                <p className="text-sm text-muted-foreground">{shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm text-muted-foreground">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
              </p>
              <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground text-center mt-6">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
    </Layout>
  );
}

