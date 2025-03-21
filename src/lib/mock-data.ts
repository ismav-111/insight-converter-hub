
// Mock data for charts, tables, and text responses

export interface SalesData {
  city: string;
  sales: number;
  growth: number;
  color?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  icon: string;
}

// Mock city sales data
export const citySalesData: SalesData[] = [
  { city: 'New York', sales: 1200000, growth: 12.5, color: '#4A90E2' },
  { city: 'San Francisco', sales: 950000, growth: 10.2, color: '#50E3C2' },
  { city: 'Chicago', sales: 800000, growth: 8.7, color: '#F5A623' },
  { city: 'Boston', sales: 600000, growth: 6.8, color: '#D0021B' },
  { city: 'Seattle', sales: 750000, growth: 9.5, color: '#7ED321' },
  { city: 'Austin', sales: 500000, growth: 15.3, color: '#BD10E0' },
  { city: 'Denver', sales: 450000, growth: 7.2, color: '#9013FE' },
  { city: 'Los Angeles', sales: 900000, growth: 5.4, color: '#4A4A4A' },
  { city: 'Portland', sales: 350000, growth: 6.9, color: '#417505' },
  { city: 'Miami', sales: 580000, growth: 11.1, color: '#F8E71C' },
  { city: 'Dallas', sales: 620000, growth: 8.3, color: '#8B572A' },
  { city: 'Atlanta', sales: 580000, growth: 7.5, color: '#B8E986' },
  { city: 'Philadelphia', sales: 480000, growth: 4.2, color: '#50E3C2' },
  { city: 'Phoenix', sales: 510000, growth: 9.8, color: '#9B9B9B' },
  { city: 'Detroit', sales: 320000, growth: 3.5, color: '#F8E71C' },
];

// Mock data sources
export const dataSources: DataSource[] = [
  { id: 'ds1', name: 'CRM Database', type: 'database', icon: 'database' },
  { id: 'ds2', name: 'Sales API', type: 'api', icon: 'code' },
  { id: 'ds3', name: 'Marketing Cloud', type: 'cloud', icon: 'cloud' },
  { id: 'ds4', name: 'Customer Files', type: 'file', icon: 'file' },
  { id: 'ds5', name: 'Financial Database', type: 'database', icon: 'database' },
];

// Mock customer data
export const customerData = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', status: 'Active', purchases: 12, value: 2450 },
  { id: 2, name: 'Emma Johnson', email: 'emma.j@example.com', status: 'Active', purchases: 8, value: 1640 },
  { id: 3, name: 'Michael Brown', email: 'm.brown@example.com', status: 'Inactive', purchases: 2, value: 320 },
  { id: 4, name: 'Sophia Williams', email: 'sophia.w@example.com', status: 'Active', purchases: 15, value: 3100 },
  { id: 5, name: 'James Garcia', email: 'james.g@example.com', status: 'Pending', purchases: 0, value: 0 },
  { id: 6, name: 'Olivia Miller', email: 'o.miller@example.com', status: 'Active', purchases: 6, value: 980 },
  { id: 7, name: 'Robert Wilson', email: 'r.wilson@example.com', status: 'Active', purchases: 9, value: 1780 },
  { id: 8, name: 'Ava Martinez', email: 'ava.m@example.com', status: 'Inactive', purchases: 3, value: 450 },
  { id: 9, name: 'David Anderson', email: 'd.anderson@example.com', status: 'Active', purchases: 7, value: 1290 },
  { id: 10, name: 'Isabella Thomas', email: 'i.thomas@example.com', status: 'Pending', purchases: 1, value: 120 },
];

// Mock document data
export const documentData = [
  { id: 'doc1', title: 'Annual Report 2023', type: 'PDF', size: '2.4 MB', created: '2023-12-15', pages: 48 },
  { id: 'doc2', title: 'Marketing Strategy', type: 'DOCX', size: '1.8 MB', created: '2023-11-22', pages: 32 },
  { id: 'doc3', title: 'Financial Statement Q4', type: 'XLSX', size: '1.2 MB', created: '2023-12-31', pages: 15 },
  { id: 'doc4', title: 'Product Roadmap', type: 'PPTX', size: '3.5 MB', created: '2023-10-08', pages: 25 },
  { id: 'doc5', title: 'Customer Feedback Summary', type: 'PDF', size: '1.9 MB', created: '2023-11-15', pages: 18 },
  { id: 'doc6', title: 'Employee Handbook', type: 'PDF', size: '4.2 MB', created: '2023-09-01', pages: 72 },
  { id: 'doc7', title: 'Sales Projections 2024', type: 'XLSX', size: '0.9 MB', created: '2023-12-10', pages: 8 },
  { id: 'doc8', title: 'Brand Guidelines', type: 'PDF', size: '5.7 MB', created: '2023-08-20', pages: 64 },
];

// Mock text responses
export const textResponses = [
  `Based on the sales data analyzed from the last quarter, New York continues to be our strongest market with $1.2M in sales, followed by San Francisco with $950K. The most significant growth was observed in Austin at 15.3%, suggesting we should consider expanding our presence there. Miami and New York also showed strong growth at 11.1% and 12.5% respectively.`,
  
  `The customer satisfaction survey results indicate an overall satisfaction score of 8.7/10, a 0.5 point improvement from the previous quarter. Key areas of improvement cited by customers include product quality (9.2/10) and customer service responsiveness (8.9/10). Areas requiring attention include the checkout process (7.5/10) and website navigation (7.8/10).`,
  
  `Financial analysis reveals that our profit margins have increased by 2.3% this quarter due to successful cost-cutting measures and optimized supply chain operations. The ROI on our digital marketing campaigns has improved to 320%, with social media campaigns performing particularly well at 410% ROI. We recommend increasing budget allocation to Instagram and TikTok campaigns by 15% for the next quarter.`,
  
  `Market research indicates growing demand for our premium product line, with a 28% increase in searches and a 32% increase in conversion rates for these products. The demographic most interested in our premium offerings is 28-42 year old professionals in urban areas. We recommend developing three new premium products for this demographic by Q3.`,
  
  `Inventory analysis shows that we're overstocked on Product Category B by approximately 22%, while Product Category D is frequently out of stock (stockout rate of 15%). Implementing an improved inventory forecasting system could reduce carrying costs by an estimated $120K annually while improving product availability and customer satisfaction.`,
];

// Generate a random chart data point
export const generateRandomData = (min = 100, max = 1000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate time series data
export const generateTimeSeriesData = (days = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - i - 1));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: generateRandomData(200, 800)
    });
  }
  
  return data;
};

// Generate sample queries
export const sampleQueries = [
  "Show me sales data by city",
  "Compare Q1 vs Q2 revenue",
  "What were our top performing products last month?",
  "Summarize customer feedback trends",
  "Show marketing campaign performance"
];
