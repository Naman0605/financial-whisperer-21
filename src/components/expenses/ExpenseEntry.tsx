import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, CheckCircle, Save, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categories = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Personal",
  "Debt",
  "Education",
  "Travel",
  "Other"
];

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Rental",
  "Gift",
  "Refund",
  "Business",
  "Other"
];

export const ExpenseEntry = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{ [key: string]: string } | null>(null);
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split("T")[0]);
  const [incomeNotes, setIncomeNotes] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };
  
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setUploadedImage(e.target.result as string);
          setIsUploading(false);
          
          // Simulate OCR processing
          setIsProcessing(true);
          simulateOCRProcessing();
        }
      };
      reader.readAsDataURL(file);
    }, 1000);
  };
  
  const simulateOCRProcessing = () => {
    // Simulate AI processing of the receipt
    setTimeout(() => {
      setIsProcessing(false);
      
      setExtractedData({
        amount: "36.84",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        notes: "Grocery store - milk, eggs, bread, vegetables"
      });
      
      setAmount("36.84");
      setCategory("Food");
      setNotes("Grocery store - milk, eggs, bread, vegetables");
      
      toast({
        title: "Receipt processed",
        description: "We've extracted the data from your receipt",
        variant: "default"
      });
    }, 2000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate saving
    toast({
      title: "Expense saved",
      description: `$${amount} added to ${category}`,
      variant: "default"
    });
    
    // Reset form
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setUploadedImage(null);
    setExtractedData(null);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incomeAmount || !incomeCategory || !incomeDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate saving income
    toast({
      title: "Income saved",
      description: `$${incomeAmount} added from ${incomeCategory}`,
      variant: "default"
    });
    
    // Reset form
    setIncomeAmount("");
    setIncomeCategory("");
    setIncomeDate(new Date().toISOString().split("T")[0]);
    setIncomeNotes("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Money Manager</h1>
        <p className="text-muted-foreground">
          Track your finances by adding expenses and income entries.
        </p>
      </div>
      
      <Card className="glass-card overflow-hidden">
        <Tabs defaultValue="expense">
          <TabsList className="w-full rounded-none border-b border-gray-200 dark:border-gray-700 bg-transparent px-6 pt-6">
            <TabsTrigger value="expense" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Expense</TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Income</TabsTrigger>
            <TabsTrigger value="receipt" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Upload Receipt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expense" className="p-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</div>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-finance-teal hover:bg-finance-teal/90 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Expense
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="income" className="p-6 pt-4">
            <form onSubmit={handleIncomeSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Amount</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</div>
                    <Input
                      id="income-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={incomeAmount}
                      onChange={(e) => setIncomeAmount(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income-category">Source</Label>
                  <Select value={incomeCategory} onValueChange={setIncomeCategory} required>
                    <SelectTrigger id="income-category">
                      <SelectValue placeholder="Select income source" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="income-date">Date</Label>
                  <Input
                    id="income-date"
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="income-notes">Notes</Label>
                  <Textarea
                    id="income-notes"
                    value={incomeNotes}
                    onChange={(e) => setIncomeNotes(e.target.value)}
                    placeholder="Add any additional details..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-finance-success hover:bg-finance-success/90 text-white"
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Save Income
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="receipt" className="p-6 pt-4">
            {!uploadedImage ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-finance-teal bg-finance-teal/5"
                    : "border-gray-200 dark:border-gray-700 hover:border-finance-teal/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-finance-teal" />
                </div>
                
                <h3 className="text-lg font-medium mb-2">Upload Receipt</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop an image of your receipt, or click to browse
                </p>
                
                <div className="flex justify-center">
                  <label>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="relative overflow-hidden"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </label>
                </div>
                
                <p className="mt-4 text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, HEIC
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Receipt Image</h3>
                    <div className="relative aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img 
                        src={uploadedImage} 
                        alt="Receipt" 
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      
                      {(isUploading || isProcessing) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-10 h-10 border-4 border-gray-400 border-t-white rounded-full animate-spin mx-auto mb-2" />
                            <p>{isUploading ? "Uploading..." : "Processing with AI..."}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setUploadedImage(null);
                          setExtractedData(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                      Extracted Data
                      {extractedData && (
                        <CheckCircle className="h-5 w-5 text-finance-success" />
                      )}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="receipt-amount">Amount</Label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</div>
                          <Input
                            id="receipt-amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-7"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="receipt-category">Category</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger id="receipt-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="receipt-date">Date</Label>
                        <Input
                          id="receipt-date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="receipt-notes">Notes</Label>
                        <Textarea
                          id="receipt-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any additional details..."
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-finance-teal hover:bg-finance-teal/90 text-white"
                        disabled={isUploading || isProcessing}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Expense
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ExpenseEntry;
