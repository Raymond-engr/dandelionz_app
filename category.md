## **CATEGORY FLOW OVERVIEW**

### **1. DATABASE LAYER** models.py

```
Category Model:
├── Fields:
│   ├── name (CharField, unique)
│   ├── slug (SlugField, auto-generated from name)
│   ├── description (TextField)
│   ├── image (CloudinaryField)
│   ├── is_active (Boolean, default=True)
│   ├── created_at (auto-generated)
│   └── updated_at (auto-updated)
├── Relationships:
│   └── Products (reverse FK via products)
├── Properties (calculated):
│   ├── product_count → counts approved & submitted products
│   └── total_sales → sums quantity from OrderItems
└── Methods:
    └── save() → auto-generates slug from name
```

**Related: Product Model** links to Category via ForeignKey:

```python
category = ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
```

---

### **2. SERIALIZATION LAYER** serializers.py

**Two Serializers:**

**a) CategorySerializer** (Full details)

- Includes: id, name, slug, description, image, is_active, product_count, total_sales, created_at, updated_at
- Uses `SerializerMethodField` for dynamic counts/sales
- Extends `CloudinarySerializer` to format image URLs

**b) CategoryListSerializer** (Lightweight for listings)

- Includes: id, name, slug, product_count, total_sales
- Used for quick lists without full details

---

### **3. VIEW LAYER** views.py

#### **CategoryListCreateView** (GET & POST)

```
GET /categories/
├── Permission: AllowAny (public)
├── Returns: List of active categories
├── Supports: Search (by name/description) & Ordering (by name/created_at)
└── Queryset: Only is_active=True categories

POST /categories/
├── Permission: IsAdmin only
├── Creates: New category
└── Auto-populates: slug from name
```

#### **CategoryDetailView** (GET, PATCH, DELETE)

```
GET /categories/<id>/
├── Permission: AllowAny (public)
└── Returns: Single category details with aggregated stats

PATCH /categories/<id>/
├── Permission: IsAdmin only
└── Updates: Category fields

DELETE /categories/<id>/
├── Permission: IsAdmin only
└── Behavior: Products keep their records, category just becomes NULL
```

---

### **4. URL ROUTING** urls.py

```
GET  /categories/              → CategoryListCreateView (list all)
POST /categories/              → CategoryListCreateView (create)
GET  /categories/<id>/         → CategoryDetailView (retrieve)
PATCH /categories/<id>/        → CategoryDetailView (update)
DELETE /categories/<id>/       → CategoryDetailView (delete)
```

---

### **5. ADMIN INTERFACE** admin.py

**CategoryAdmin Configuration:**

- **List Display:** name, product_count, total_sales, is_active, created_at
- **Filters:** is_active, created_at
- **Search:** by name, description
- **Auto-slug:** name → slug (prepopulated_fields)
- **Read-only:** created_at, updated_at
- **Organized Fieldsets:**
  - Category Information (name, slug, description, image)
  - Status (is_active)
  - Timestamps (collapsible)

---

### **6. COMPLETE REQUEST/RESPONSE FLOW**

```
CLIENT REQUEST
    ↓
[REST API Endpoint]
    ↓
[View Layer] → Permission Check
    ↓
[Queryset] → Filter, Search, Order
    ↓
[Serializer] → Format data + calculate product_count & total_sales
    ↓
[Response] → JSON with standardized format
    ↓
CLIENT RECEIVES DATA
```

**Example Response:**

```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices",
  "image": "https://res.cloudinary.com/...",
  "is_active": true,
  "product_count": 42,
  "total_sales": 156,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:22:00Z"
}
```

---

### **7. PERMISSIONS & ACCESS CONTROL**

| Operation             | Required Permission |
| --------------------- | ------------------- |
| View all categories   | Anyone (AllowAny)   |
| View category details | Anyone (AllowAny)   |
| Create category       | Admin only          |
| Update category       | Admin only          |
| Delete category       | Admin only          |
