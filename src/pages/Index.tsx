
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, FileText, LayoutPanelLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 'encore',
      title: 'EnCore',
      description: 'Conversational AI assistant for text-based insights and analysis',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      image: '/lovable-uploads/f8e1310c-1f4e-4dc4-8420-ae468be97ff7.png',
      path: '/encore'
    },
    {
      id: 'endocs',
      title: 'EnDocs',
      description: 'Document analysis with tables and text for structured information',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      image: '/placeholder.svg',
      path: '/endocs'
    },
    {
      id: 'ensights',
      title: 'EnSights',
      description: 'Advanced data visualization with charts and analytics',
      icon: <LayoutPanelLeft className="h-5 w-5" />,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      image: '/placeholder.svg',
      path: '/ensights'
    }
  ];

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

  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <motion.section 
          className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="show"
          variants={containerAnimation}
        >
          <motion.div variants={itemAnimation}>
            <h5 className="pill bg-primary/10 text-primary inline-flex items-center mb-4">
              <span className="text-gradient font-semibold">enplify.ai</span>
            </h5>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 tracking-tight"
            variants={itemAnimation}
          >
            Transform Your Data <br/>
            <span className="text-gradient">Into Actionable Insights</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
            variants={itemAnimation}
          >
            Our AI-powered platform helps you analyze, visualize, and extract meaningful insights from your data with precision and elegance.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={itemAnimation}
          >
            <Button 
              onClick={() => navigate('/ensights')} 
              size="lg"
              className="rounded-full py-6 px-8 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore EnSights
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => navigate('/encore')} 
              variant="outline"
              size="lg"
              className="rounded-full py-6 px-8 border-2 transition-all duration-300"
            >
              Try EnCore
            </Button>
          </motion.div>
        </motion.section>

        <motion.section 
          className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
          initial="hidden"
          animate="show"
          variants={containerAnimation}
        >
          <motion.div variants={itemAnimation}>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Powerful <span className="text-gradient">Features</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="col-span-1"
                variants={itemAnimation}
                custom={index}
              >
                <motion.div
                  className="glass-card h-full p-6 md:p-8 flex flex-col group cursor-pointer"
                  onClick={() => navigate(feature.path)}
                  variants={cardAnimation}
                  whileHover="hover"
                >
                  <div className={cn("rounded-lg w-12 h-12 flex items-center justify-center mb-6", feature.color)}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6">{feature.description}</p>
                  
                  <div className="mt-auto">
                    <div className="relative overflow-hidden rounded-lg aspect-video bg-muted/30 mb-4">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-primary"
                    >
                      <span>Explore {feature.title}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <footer className="py-10 px-4 md:px-8 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-xl font-bold text-gradient">enplify</span>
            <span className="text-sm text-muted-foreground">.ai</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © 2023 Enplify.ai — All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
