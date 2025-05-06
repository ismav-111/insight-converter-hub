
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Save, Lock, Database, Cloud, Code, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from '@/components/layout/PageHeader';

// Data source tabs with clearer names and better organization
const dataSourceTabs = [
  { 
    id: "documents", 
    name: "Documents", 
    icon: File,
    fields: [
      { name: "fileStorage", label: "File Storage Location", placeholder: "Enter storage location" },
      { name: "fileTypes", label: "Supported File Types", placeholder: "PDF, DOCX, TXT, etc." },
      { name: "maxFileSize", label: "Max File Size (MB)", placeholder: "Enter maximum file size" },
      { name: "apiKey", label: "Document API Key", placeholder: "Enter API key", type: "password" }
    ]
  },
  { 
    id: "sharepoint", 
    name: "SharePoint", 
    icon: Cloud,
    fields: [
      { name: "siteUrl", label: "SharePoint URL", placeholder: "Enter SharePoint site URL" },
      { name: "library", label: "Document Library", placeholder: "Enter library name" },
      { name: "userId", label: "User ID", placeholder: "Enter user ID" },
      { name: "apiToken", label: "API Token", placeholder: "Enter API token", type: "password" }
    ]
  },
  { 
    id: "databases", 
    name: "Databases", 
    icon: Database,
    fields: [
      { name: "connectionString", label: "Connection String", placeholder: "Enter connection string" },
      { name: "databaseName", label: "Database Name", placeholder: "Enter database name" },
      { name: "username", label: "Username", placeholder: "Enter username" },
      { name: "password", label: "Password", placeholder: "Enter password", type: "password" }
    ]
  },
  { 
    id: "api", 
    name: "External APIs", 
    icon: Code,
    fields: [
      { name: "endpointUrl", label: "API Endpoint", placeholder: "Enter API endpoint URL" },
      { name: "authType", label: "Authentication Type", placeholder: "OAuth, API Key, etc." },
      { name: "apiKey", label: "API Key", placeholder: "Enter API key", type: "password" },
      { name: "refreshToken", label: "Refresh Token", placeholder: "Enter refresh token", type: "password" }
    ]
  },
  { 
    id: "web", 
    name: "Web Sources", 
    icon: Cloud,
    fields: [
      { name: "websiteUrl", label: "Website URL", placeholder: "Enter website URL" },
      { name: "crawlDepth", label: "Crawl Depth", placeholder: "Enter crawl depth" },
      { name: "updateFrequency", label: "Update Frequency", placeholder: "Enter update frequency" },
      { name: "authToken", label: "Authentication Token", placeholder: "Enter auth token", type: "password" }
    ]
  }
];

const ProfileSettings = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("documents");
  
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
      description: `${dataSourceTabs.find(tab => tab.id === currentTab)?.name} configuration has been saved.`,
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

  // Find current tab icon
  const getCurrentTabIcon = () => {
    const tab = dataSourceTabs.find(tab => tab.id === currentTab);
    return tab ? tab.icon : File;
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
          <Card className="md:col-span-1 border-none shadow-md">
            <CardHeader className="bg-primary/5 rounded-t-lg border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center">
                <UserRound className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center mb-6">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
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
                        <FormLabel>Full Name</FormLabel>
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
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" className="border-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    Last login: {new Date(userData.lastLogin).toLocaleString()}
                  </div>
                  
                  <Button type="submit" className="w-full mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {/* Data Source Configuration Card */}
          <Card className="md:col-span-2 border-none shadow-md">
            <CardHeader className="bg-primary/5 rounded-t-lg border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className="mr-2">
                    {React.createElement(getCurrentTabIcon(), { className: "h-5 w-5" })}
                  </div>
                  Data Source Configuration
                </CardTitle>
                <span className="bg-primary/20 text-primary text-xs px-2.5 py-1 rounded-full">
                  {dataSourceTabs.find(tab => tab.id === currentTab)?.name}
                </span>
              </div>
              <CardDescription>
                Configure your data sources for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="documents" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {dataSourceTabs.map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex items-center gap-2 py-2"
                      >
                        <TabIcon className="w-3.5 h-3.5" />
                        <span>{tab.name}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {dataSourceTabs.map(tab => (
                  <TabsContent key={tab.id} value={tab.id}>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium text-sm mb-1">{tab.name} Integration</h3>
                      <p className="text-muted-foreground text-xs">
                        Configure {tab.name.toLowerCase()} access for AI processing and analysis.
                      </p>
                    </div>
                    
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
                          <Save className="w-4 h-4 mr-2" />
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
