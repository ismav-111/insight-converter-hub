
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Save, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '@/components/layout/PageHeader';

// Data source tabs with improved user experience 
const dataSourceTabs = [
  { id: "youtube", name: "YouTube", fields: [
    { name: "channel", label: "Channel Name", placeholder: "Enter channel name" },
    { name: "playlist", label: "Playlist Name", placeholder: "Enter playlist name" },
    { name: "videos", label: "Number Of Videos", placeholder: "Enter number of videos" },
    { name: "apiKey", label: "YouTube API KEY", placeholder: "Enter YouTube API key", type: "password" }
  ]},
  { id: "sharepoint", name: "SharePoint", fields: [
    { name: "siteUrl", label: "Site URL", placeholder: "Enter SharePoint site URL" },
    { name: "library", label: "Library Name", placeholder: "Enter library name" },
    { name: "userId", label: "User ID", placeholder: "Enter user ID" },
    { name: "apiToken", label: "API Token", placeholder: "Enter API token", type: "password" }
  ]},
  { id: "website", name: "Website", fields: [
    { name: "websiteUrl", label: "Website URL", placeholder: "Enter website URL" },
    { name: "crawlDepth", label: "Crawl Depth", placeholder: "Enter crawl depth" },
    { name: "updateFrequency", label: "Update Frequency", placeholder: "Enter update frequency" },
    { name: "apiKey", label: "API Key", placeholder: "Enter API key", type: "password" }
  ]},
  { id: "sql", name: "SQL", fields: [
    { name: "serverUrl", label: "Server URL", placeholder: "Enter server URL" },
    { name: "databaseName", label: "Database Name", placeholder: "Enter database name" },
    { name: "username", label: "Username", placeholder: "Enter username" },
    { name: "password", label: "Password", placeholder: "Enter password", type: "password" }
  ]},
  { id: "snowflake", name: "Snowflake", fields: [
    { name: "accountUrl", label: "Account URL", placeholder: "Enter account URL" },
    { name: "warehouse", label: "Warehouse", placeholder: "Enter warehouse name" },
    { name: "username", label: "Username", placeholder: "Enter username" },
    { name: "password", label: "Password", placeholder: "Enter password", type: "password" }
  ]},
];

const ProfileSettings = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("youtube");
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Anand",
    email: "anandkumar85@gmail.com",
    lastLogin: "2025-04-15T11:06:46.41MZ"
  });

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: userData.name,
      email: userData.email
    }
  });

  // Data source form
  const dataSourceForm = useForm({
    defaultValues: {}
  });

  const handleSaveProfile = (data: any) => {
    setUserData({
      ...userData,
      name: data.name,
      email: data.email
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile settings have been saved.",
    });
  };

  const handleSaveDataSource = (data: any) => {
    toast({
      title: "Data source configured",
      description: `${currentTab} configuration has been saved.`,
    });
  };

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen pt-20 px-4 md:px-8 pb-8 mx-auto"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      <PageHeader
        icon={UserRound}
        title="Profile Settings"
        subtitle="Manage your profile and data source configurations"
        badgeText="Account"
      />

      <div className="max-w-6xl mx-auto">
        <motion.div 
          variants={itemAnimation}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Profile Settings Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserRound className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="text-sm text-muted-foreground">
                    Last login: {new Date(userData.lastLogin).toLocaleString()}
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Data Source Configuration Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                Data Source Configuration
              </CardTitle>
              <CardDescription>
                Configure your data sources for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="youtube" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-6 flex flex-wrap gap-2">
                  {dataSourceTabs.map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs md:text-sm">
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {dataSourceTabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id}>
                    <Form {...dataSourceForm}>
                      <form onSubmit={dataSourceForm.handleSubmit(handleSaveDataSource)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tab.fields.map((field, index) => (
                            <FormItem key={index}>
                              <FormLabel>{field.label}</FormLabel>
                              <FormControl>
                                <Input 
                                  type={field.type || "text"} 
                                  placeholder={field.placeholder} 
                                  className="border-primary/20" 
                                />
                              </FormControl>
                              {field.type === "password" && (
                                <FormDescription className="flex items-center text-xs">
                                  <Lock className="h-3 w-3 mr-1" /> Stored securely
                                </FormDescription>
                              )}
                            </FormItem>
                          ))}
                        </div>
                        
                        <Button type="submit" className="mt-6">
                          Save Configuration
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
