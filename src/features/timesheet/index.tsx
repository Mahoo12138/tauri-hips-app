import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { Calendar } from "@/components/ui/calendar";
import { RecentSales } from "./components/recent-sales";
import { TimesheetForm } from "./components/timesheet-form";

export default function Timesheet() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main fixed>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Timesheet</h1>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation="vertical"
          defaultValue="overview"
          className="space-y-4"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Fill in</TabsTrigger>
              <TabsTrigger value="analytics">Make up</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-y-4">
            <div className="sm:grid-cols-[250px_1fr] md:grid gap-2">
              <div className="mb-3 rounded-md border shadow w-[250px] h-[300px]">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </div>
              <Card className="pt-4">
                <CardContent>
                  <TimesheetForm />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button>提交</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Tabs>
      </Main>
    </>
  );
}
