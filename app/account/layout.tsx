import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/dashboard/navbar/Navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/dashboard/footer/Footer";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Generated by Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />

            <div className="h-[calc(100vh-140px)]">
                <div className="mx-auto max-w-[780px] py-10">
                    <h1 className="mb-14 font-poppins text-3xl font-black">Hey, User</h1>

                    <Tabs defaultValue="profile">
                        <TabsList className="">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="account">Account Settings</TabsTrigger>
                            <TabsTrigger value="rating">Your Ratings</TabsTrigger>
                            <TabsTrigger value="saved">Saved Guard</TabsTrigger>
                        </TabsList>

                        {children}

                        {/* <TabsContent value="account">account</TabsContent>
              <TabsContent value="rating">rating</TabsContent>
              <TabsContent value="saved">Saved</TabsContent> */}
                    </Tabs>
                </div>
            </div>

            <Footer />
        </>
    );
}
