
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { DataSource, dataSources } from "@/lib/mock-data";

// Data source tabs
const dataSourceTabs = [
  { id: "youtube", name: "YouTube", fields: ["Channel Name", "Playlist Name", "Number Of Videos", "YouTube API KEY"] },
  { id: "sharepoint", name: "Share Point", fields: ["Site URL", "Library Name", "User ID", "API Token"] },
  { id: "website", name: "Website", fields: ["Website URL", "Crawl Depth", "Update Frequency", "API Key"] },
  { id: "sql", name: "SQL", fields: ["Server URL", "Database Name", "Username", "Password"] },
  { id: "snowflake", name: "Snowflake", fields: ["Account URL", "Warehouse", "Username", "Password"] },
  { id: "zoho", name: "Zoho", fields: ["Organization ID", "API Domain", "Client ID", "Client Secret"] },
  { id: "dynamics365", name: "Dynamics 365", fields: ["Instance URL", "Organization Name", "User ID", "Access Key"] },
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
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          variants={itemAnimation}
          className="text-2xl md:text-3xl font-bold mb-8"
        >
          Welcome, {userData.name}!
        </motion.h1>
        
        <motion.div 
          variants={itemAnimation}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Profile Settings Card */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserRound className="mr-2 h-5 w-5" />
              Profile Setting
            </h2>
            
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" {...field} className="border-primary/20" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} className="border-primary/20" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="text-sm text-muted-foreground">
                  {userData.lastLogin}
                </div>
                
                <Button type="submit" className="w-full">
                  SAVE
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Data Source Configuration Card */}
          <div className="glass-panel p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              Datasource configuration
            </h2>
            
            <Tabs defaultValue="youtube" value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4 flex flex-wrap gap-2">
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
                            <FormControl>
                              <Input placeholder={field} className="border-primary/20" />
                            </FormControl>
                          </FormItem>
                        ))}
                      </div>
                      
                      <Button type="submit" className="mt-6">
                        SAVE
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfileSettings;
