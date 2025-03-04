
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Megaphone, 
  Image, 
  PlusCircle, 
  Calendar, 
  BarChart4,
  Tag,
  Target,
  Edit,
  Trash2,
  Eye,
  UploadCloud
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Ad = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location: 'header' | 'sidebar' | 'footer' | 'product_page';
  status: 'active' | 'inactive' | 'scheduled';
  start_date: string;
  end_date: string;
  target_audience: string;
  clicks: number;
  impressions: number;
  ctr: number;
};

// Mock data
const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Summer Collection Sale',
    description: 'Get up to 50% off on our summer collection.',
    image_url: '/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png',
    location: 'header',
    status: 'active',
    start_date: '2023-06-01',
    end_date: '2023-08-31',
    target_audience: 'All users',
    clicks: 1250,
    impressions: 15000,
    ctr: 8.33,
  },
  {
    id: '2',
    title: 'New Fragrance Launch',
    description: 'Introducing our newest perfume collection.',
    image_url: '/lovable-uploads/0fed8e9c-7bde-43e8-8dcf-71367c2afb1f.png',
    location: 'product_page',
    status: 'scheduled',
    start_date: '2023-09-15',
    end_date: '2023-10-15',
    target_audience: 'Female customers',
    clicks: 0,
    impressions: 0,
    ctr: 0,
  },
  {
    id: '3',
    title: 'Gift Card Promotion',
    description: 'Buy a gift card and get $10 extra credit.',
    image_url: '/lovable-uploads/9fe406ef-b60a-4298-beaf-4d1b81da3da2.png',
    location: 'sidebar',
    status: 'inactive',
    start_date: '2023-05-01',
    end_date: '2023-05-31',
    target_audience: 'Returning customers',
    clicks: 500,
    impressions: 8000,
    ctr: 6.25,
  },
];

export const AdminAds = () => {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [isNewAdDialogOpen, setIsNewAdDialogOpen] = useState(false);
  const [isEditAdDialogOpen, setIsEditAdDialogOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const filteredAds = activeTab === 'all' 
    ? ads 
    : ads.filter(ad => ad.status === activeTab);

  const handleDeleteAd = (adId: string) => {
    setAds(ads.filter(ad => ad.id !== adId));
    toast({
      title: "Ad deleted",
      description: "The advertisement has been successfully deleted.",
    });
  };

  const handleAddAd = (newAd: Partial<Ad>) => {
    const adWithDefaults: Ad = {
      id: Math.random().toString(36).substr(2, 9),
      title: newAd.title || '',
      description: newAd.description || '',
      image_url: newAd.image_url || '',
      location: newAd.location || 'header',
      status: newAd.status || 'inactive',
      start_date: newAd.start_date || new Date().toISOString().split('T')[0],
      end_date: newAd.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      target_audience: newAd.target_audience || 'All users',
      clicks: 0,
      impressions: 0,
      ctr: 0,
    };
    
    setAds([...ads, adWithDefaults]);
    setIsNewAdDialogOpen(false);
    toast({
      title: "Ad created",
      description: "The new advertisement has been successfully created.",
    });
  };

  const handleUpdateAd = (updatedAd: Ad) => {
    setAds(ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
    setIsEditAdDialogOpen(false);
    toast({
      title: "Ad updated",
      description: "The advertisement has been successfully updated.",
    });
  };

  const handleToggleAdStatus = (adId: string) => {
    setAds(ads.map(ad => {
      if (ad.id === adId) {
        const newStatus = ad.status === 'active' ? 'inactive' : 'active';
        return { ...ad, status: newStatus };
      }
      return ad;
    }));
    
    const ad = ads.find(a => a.id === adId);
    const newStatus = ad?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `Ad ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      description: `The advertisement is now ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone size={20} />
              Advertisement Management
            </CardTitle>
            <CardDescription>Create and manage advertisements across the site</CardDescription>
          </div>
          <Button onClick={() => setIsNewAdDialogOpen(true)} className="flex items-center gap-1">
            <PlusCircle size={16} />
            <span>Create Ad</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Ads</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4">
              {filteredAds.length === 0 ? (
                <div className="text-center py-10 border rounded-md">
                  <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No advertisements found</h3>
                  <p className="text-gray-500 mb-4">Create a new ad to get started</p>
                  <Button onClick={() => setIsNewAdDialogOpen(true)}>
                    Create Ad
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAds.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                      <div className="relative h-48 bg-gray-100">
                        {ad.image_url ? (
                          <img 
                            src={ad.image_url} 
                            alt={ad.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image size={48} className="text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 bg-white hover:bg-gray-100"
                            onClick={() => {
                              setCurrentAd(ad);
                              setIsEditAdDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 bg-white hover:bg-gray-100"
                            onClick={() => handleDeleteAd(ad.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            ad.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : ad.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ad.status === 'active' ? 'Active' : 
                             ad.status === 'scheduled' ? 'Scheduled' : 'Inactive'}
                          </span>
                          <Switch 
                            checked={ad.status === 'active'} 
                            onCheckedChange={() => handleToggleAdStatus(ad.id)}
                          />
                        </div>
                        <h3 className="font-medium text-lg mb-1 line-clamp-1">{ad.title}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{ad.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>Start: {ad.start_date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>End: {ad.end_date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            <span>{ad.location.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target size={12} />
                            <span>{ad.target_audience}</span>
                          </div>
                        </div>
                        {ad.status === 'active' && (
                          <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 border-t">
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <div className="text-gray-500">Clicks</div>
                                <div className="font-medium">{ad.clicks.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Impressions</div>
                                <div className="font-medium">{ad.impressions.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">CTR</div>
                                <div className="font-medium">{ad.ctr.toFixed(2)}%</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* New Ad Dialog */}
      <Dialog open={isNewAdDialogOpen} onOpenChange={setIsNewAdDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Advertisement</DialogTitle>
            <DialogDescription>
              Set up a new advertisement to display on your site
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddAd({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              image_url: '/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png', // Placeholder
              location: formData.get('location') as 'header' | 'sidebar' | 'footer' | 'product_page',
              status: formData.get('status') as 'active' | 'inactive' | 'scheduled',
              start_date: formData.get('start_date') as string,
              end_date: formData.get('end_date') as string,
              target_audience: formData.get('target_audience') as string,
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  required
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="border rounded-md p-4 bg-gray-50 text-center">
                    <div className="mb-2">
                      <UploadCloud className="mx-auto h-10 w-10 text-gray-300" />
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Drag and drop an image, or click to browse
                    </div>
                    <Button variant="outline" type="button">
                      Choose Image
                    </Button>
                    <input type="hidden" name="image_url" value="/lovable-uploads/fa14be45-6a8f-4469-8aba-e4169ebf59a9.png" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Select name="location" defaultValue="header">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="product_page">Product Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select name="status" defaultValue="inactive">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="col-span-3"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="col-span-3"
                  defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target_audience" className="text-right">
                  Target Audience
                </Label>
                <Select name="target_audience" defaultValue="All users">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All users">All users</SelectItem>
                    <SelectItem value="New customers">New customers</SelectItem>
                    <SelectItem value="Returning customers">Returning customers</SelectItem>
                    <SelectItem value="Female customers">Female customers</SelectItem>
                    <SelectItem value="Male customers">Male customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAdDialogOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Create Ad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Ad Dialog */}
      <Dialog open={isEditAdDialogOpen} onOpenChange={setIsEditAdDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>
              Update this advertisement's details
            </DialogDescription>
          </DialogHeader>
          {currentAd && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              if (currentAd) {
                handleUpdateAd({
                  ...currentAd,
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  location: formData.get('location') as 'header' | 'sidebar' | 'footer' | 'product_page',
                  status: formData.get('status') as 'active' | 'inactive' | 'scheduled',
                  start_date: formData.get('start_date') as string,
                  end_date: formData.get('end_date') as string,
                  target_audience: formData.get('target_audience') as string,
                });
              }
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={currentAd.title}
                    required
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={currentAd.description}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <div className="border rounded-md overflow-hidden">
                      {currentAd.image_url ? (
                        <img 
                          src={currentAd.image_url} 
                          alt={currentAd.title} 
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <Image size={32} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <Button variant="outline" type="button" className="mt-2">
                      Change Image
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-location" className="text-right">
                    Location
                  </Label>
                  <Select name="location" defaultValue={currentAd.location}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="product_page">Product Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select name="status" defaultValue={currentAd.status}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-start_date" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="edit-start_date"
                    name="start_date"
                    type="date"
                    defaultValue={currentAd.start_date}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-end_date" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="edit-end_date"
                    name="end_date"
                    type="date"
                    defaultValue={currentAd.end_date}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-target_audience" className="text-right">
                    Target Audience
                  </Label>
                  <Select name="target_audience" defaultValue={currentAd.target_audience}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All users">All users</SelectItem>
                      <SelectItem value="New customers">New customers</SelectItem>
                      <SelectItem value="Returning customers">Returning customers</SelectItem>
                      <SelectItem value="Female customers">Female customers</SelectItem>
                      <SelectItem value="Male customers">Male customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditAdDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
