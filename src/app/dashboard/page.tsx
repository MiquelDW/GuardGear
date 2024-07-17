import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { formatPrice } from "@/lib/utils";
// in Server Components you can get the Kinde Auth data by using the getKindeServerSession helper
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound } from "next/navigation";
import StatusDropdown from "./StatusDropdown";

export default async function Dashboard() {
  // the getUser() function reads the cookies attached to that API request and returns the currently logged-in user
  const { getUser } = getKindeServerSession();
  // the 'user' object contains the currently logged-in user from the current session
  const user = await getUser();

  // retrieve admin's email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // return not found page if user doesn't exist OR logged-in user is not allowed to view this page
  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  // retrieve all orders from the last week that have been successfully paid
  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        // order entry needs to be greater than or equal to the given value to 'gte'
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    // order the retrieved entries by the "createdAt" field in descending order (newest orders on top, oldest orders on the bottom)
    orderBy: {
      createdAt: "desc",
    },
    // also fetch the related records of the retrieved order entries (SQL join syntax)
    include: {
      User: true,
      shippingAddress: true,
    },
  });

  // retrieve the sum of the revenue you made in the last week
  const lastWeekSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        // order entry needs to be greater than or equal to the given value to 'gte'
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    // perform a sum aggregation on the field 'amount' from the retrieved order entries
    _sum: {
      amount: true,
    },
  });

  // retrieve the sum of the revenue you made in the last month
  const lastMonthSum = await db.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        // order entry needs to be greater than or equal to the given value to 'gte'
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    // perform a sum aggregation on the field 'amount' from the retrieved order entries
    _sum: {
      amount: true,
    },
  });

  // revenue goals for your business
  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2500;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Card weekly goal */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Week</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(WEEKLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                {/* view progress of the weekly goal */}
                <Progress
                  // e.g. 500 * 100 = 50.000 - 50.000 / 500 = 100%
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>

            {/* Card monhtly goal */}
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Last Month</CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  of {formatPrice(MONTHLY_GOAL)} goal
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  // e.g. 2500 * 100 = 250.000 - 250.000 / 2500 = 100%
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

          {/* Table of all paid orders from last week */}
          <Table>
            {/* display column titles */}
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchased date
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            {/* display all the retrieved orders in seperate rows */}
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.User.email}
                    </div>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {/* display current order status and update order status */}
                    <StatusDropdown
                      orderId={order.id}
                      orderStatus={order.status}
                    />
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    {formatPrice(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
