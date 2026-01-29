## **Product Creation for React/Next.js Frontend**

You can add products using the **`POST /api/store/products/create/`** endpoint.

### **Endpoint Details**

```
POST /api/store/products/create/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

### **Requirements**
- ✅ User must be authenticated (JWT token)
- ✅ User must be a verified vendor
- ✅ Vendor must have store address with coordinates set
- ✅ At least **ONE image required** (must mark one as main)
- ✅ All images must be sent as files (multipart form data)

---

### **Request Body (Multipart Form Data)**

```javascript
// Basic product fields
{
  name: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  category: "electronics",  // slug (string)
  brand: "AudioBrand",
  price: 150.00,
  discount: 20,  // percentage (0-100)
  stock: 50,
  tags: "headphones, wireless, audio",  // comma-separated string
  
  // Optional: Product variants (JSON string)
  variants: JSON.stringify({
    "colors": ["black", "white", "silver"],
    "sizes": ["M", "L"]
  }),
  
  // Images (REQUIRED - minimum 1)
  // Use FormData to attach files
  // images_data[0].image = File
  // images_data[0].is_main = "true"
  // images_data[0].alt_text = "Main product image"
  
  // Optional: Video (max 5MB)
  // video_data.video = File
  // video_data.title = "Product Demo"
  // video_data.description = "See the product in action"
}
```

---

### **Next.js/React Example Code**

```typescript
// productService.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  stock: number;
  tags: string;
  variants?: {
    [key: string]: string[];
  };
  images: File[];  // At least 1 required
  mainImageIndex: number;  // Which image is main (0-indexed)
  video?: File;
  videoTitle?: string;
  videoDescription?: string;
}

export const createProduct = async (
  productData: ProductFormData,
  accessToken: string
) => {
  const formData = new FormData();

  // Add basic fields
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('category', productData.category);
  formData.append('brand', productData.brand);
  formData.append('price', productData.price.toString());
  formData.append('discount', productData.discount.toString());
  formData.append('stock', productData.stock.toString());
  formData.append('tags', productData.tags);

  // Add variants if provided
  if (productData.variants) {
    formData.append('variants', JSON.stringify(productData.variants));
  }

  // Add images
  productData.images.forEach((file, index) => {
    formData.append(`images_data[${index}].image`, file);
    formData.append(
      `images_data[${index}].is_main`,
      (index === productData.mainImageIndex).toString()
    );
    formData.append(
      `images_data[${index}].alt_text`,
      `Product image ${index + 1}`
    );
  });

  // Add video if provided
  if (productData.video) {
    formData.append('video_data.video', productData.video);
    formData.append('video_data.title', productData.videoTitle || 'Product Video');
    formData.append(
      'video_data.description',
      productData.videoDescription || ''
    );
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/store/products/create/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
```

---

### **React Component Example**

```typescript
// components/CreateProductForm.tsx
import { useState } from 'react';
import { createProduct } from '@/services/productService';

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'electronics',
    brand: '',
    price: 0,
    discount: 0,
    stock: 0,
    tags: '',
    images: [] as File[],
    mainImageIndex: 0,
    video: null as File | null,
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Video must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, video: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (formData.images.length === 0) {
      setError('At least one image is required');
      return;
    }

    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }

    setLoading(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setError('Please login first');
        return;
      }

      const response = await createProduct(
        {
          ...formData,
          price: parseFloat(formData.price.toString()),
          discount: parseFloat(formData.discount.toString()),
          stock: parseInt(formData.stock.toString()),
        },
        accessToken
      );

      setSuccess(true);
      setFormData({
        name: '',
        description: '',
        category: 'electronics',
        brand: '',
        price: 0,
        discount: 0,
        stock: 0,
        tags: '',
        images: [],
        mainImageIndex: 0,
        video: null,
      });

      console.log('Product created:', response.data);
    } catch (err: any) {
      setError(
        err.error || 
        err.detail || 
        JSON.stringify(err) || 
        'Failed to create product'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product created successfully!
        </div>
      )}

      {/* Basic Info */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Product Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          placeholder="Wireless Headphones"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">Description *</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          rows={4}
          placeholder="Product description..."
        />
      </div>

      {/* Category, Brand, Price */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="food">Food</option>
            <option value="books">Books</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Brand</label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            placeholder="Brand name"
          />
        </div>
      </div>

      {/* Price, Discount, Stock */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold">Price ($) *</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full border px-4 py-2 rounded"
            placeholder="150.00"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
            className="w-full border px-4 py-2 rounded"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Stock *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            className="w-full border px-4 py-2 rounded"
            placeholder="50"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Tags</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          placeholder="headphones, wireless, audio"
        />
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Product Images * (At least 1)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="w-full border px-4 py-2 rounded"
        />
        
        {formData.images.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-semibold">Selected Images:</p>
            <div className="grid grid-cols-2 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="border p-2 rounded">
                  <p className="text-sm font-semibold">{file.name}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mainImageIndex: index })}
                      className={`px-2 py-1 text-sm rounded ${
                        formData.mainImageIndex === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                    >
                      {formData.mainImageIndex === index ? '✓ Main' : 'Set Main'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Product Video (Optional, max 5MB)</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="w-full border px-4 py-2 rounded"
        />
        {formData.video && (
          <p className="mt-2 text-sm text-green-600">✓ {formData.video.name}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating Product...' : 'Create Product'}
      </button>
    </form>
  );
}
```

---

### **API Response Example**

**Success (201)**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones...",
    "category": "electronics",
    "brand": "AudioBrand",
    "price": 150.00,
    "discount": 20,
    "stock": 50,
    "tags": "headphones, wireless, audio",
    "vendorName": "My Store",
    "publish_status": "draft",
    "in_stock": true,
    "images": [
      {
        "image": "https://res.cloudinary.com/.../image.jpg",
        "is_main": true,
        "alt_text": "Main product image"
      }
    ],
    "created_at": "2026-01-29T09:30:00Z"
  }
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "At least one image is required"
}
```

---