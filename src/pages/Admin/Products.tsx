
import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Product } from "@/services/product.service";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    price: 0,
    description: '',
    image: '',
    in_stock: true
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products, total } = await adminService.getProducts(page, pageSize);
      setProducts(products);
      setTotalProducts(total);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast({
        variant: "destructive",
        title: "Failed to load products",
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(id);
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted",
        });
        loadProducts();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          variant: "destructive",
          title: "Failed to delete product",
          description: error.message || "Please try again",
        });
      }
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await adminService.updateProduct(editingProduct.id, editingProduct);
      toast({
        title: "Product updated",
        description: "The product has been successfully updated",
      });
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Failed to update product",
        description: error.message || "Please try again",
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      await adminService.addProduct(newProduct as Omit<Product, 'id'>);
      toast({
        title: "Product added",
        description: "The product has been successfully added",
      });
      setNewProduct({
        name: '',
        brand: '',
        price: 0,
        description: '',
        image: '',
        in_stock: true
      });
      loadProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Failed to add product",
        description: error.message || "Please try again",
      });
    }
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display-3">Products</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="dark" className="flex items-center gap-2">
              <Plus size={16} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input 
                  id="brand" 
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image" 
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="dark" onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      {product.discount_price ? (
                        <div>
                          <span className="line-through text-secondary-medium mr-2">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-contrast-red">
                            ${product.discount_price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        `$${product.price.toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={product.in_stock ? "text-contrast-green" : "text-contrast-red"}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {editingProduct && (
                            <>
                              <DialogHeader>
                                <DialogTitle>Edit Product</DialogTitle>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Name</Label>
                                  <Input 
                                    id="edit-name" 
                                    value={editingProduct.name}
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-brand">Brand</Label>
                                  <Input 
                                    id="edit-brand" 
                                    value={editingProduct.brand}
                                    onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-price">Price</Label>
                                  <Input 
                                    id="edit-price"
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-discount">Discount Price (Optional)</Label>
                                  <Input 
                                    id="edit-discount"
                                    type="number"
                                    value={editingProduct.discount_price || ''}
                                    onChange={(e) => setEditingProduct({
                                      ...editingProduct, 
                                      discount_price: e.target.value ? Number(e.target.value) : undefined
                                    })}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-image">Image URL</Label>
                                  <Input 
                                    id="edit-image" 
                                    value={editingProduct.image}
                                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                                  />
                                </div>
                                
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea 
                                    id="edit-description" 
                                    value={editingProduct.description || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                  />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id="in-stock"
                                    checked={editingProduct.in_stock}
                                    onChange={(e) => setEditingProduct({...editingProduct, in_stock: e.target.checked})}
                                    className="h-4 w-4"
                                  />
                                  <Label htmlFor="in-stock">In Stock</Label>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="dark" onClick={handleUpdateProduct}>
                                  Update Product
                                </Button>
                              </DialogFooter>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-contrast-red"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="mx-1"
              >
                Previous
              </Button>
              
              <span className="mx-4 flex items-center">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="mx-1"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
