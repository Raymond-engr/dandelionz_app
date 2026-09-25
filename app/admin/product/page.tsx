'use client';

import React, { useState } from 'react';
import { Package, Filter, Edit2, Trash2, Plus, Flag } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  useGetAdminReportsQuery,
  useDismissReportMutation,
  useTakedownReportedProductMutation
} from '@/lib/api/adminApi';
import { useGetDraftsQuery, useSubmitDraftMutation, useDeleteDraftMutation } from '@/lib/api/vendorApi';
import { useInfiniteList, useInfiniteScrollTrigger, selectStandardEnvelope } from '@/lib/hooks/use-infinite-list';
import { useDebouncedValue } from '@/lib/hooks/use-debounced-value';
import AdminCategoryListItem from '@/components/AdminCategoryListItem';
import Link from 'next/link';
import { Category, Product } from '@/lib/api/adminApi';
import CategoryListItemSkeleton from '@/components/CategoryListItemSkeleton';
import ProductListItemSkeleton from '@/components/ProductListItemSkeleton';
import toast from 'react-hot-toast';
import SearchBar from '@/components/SearchBar';
import { apiError } from '@/lib/utils';

export default function ProductManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');
  const [reportsFilter, setReportsFilter] = useState<'pending' | 'reviewed' | 'dismissed'>('pending');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'category' | 'product' | 'draft'; slug: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError, refetch: refetchCategories } = useGetAllCategoriesQuery();
  const categories = categoriesData || [];
  const filteredCategories = categories.filter((c: Category) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Was a single unpaginated useGetAllProductsQuery({}) - the admin products
  // endpoint returned the entire products table (every vendor, every
  // status) in one response, growing on every upload. Now infinite-scroll
  // paginated, same pattern as ShopClientPage / admin users / vendor orders.
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const {
    items: products,
    isInitialLoading: isLoadingProducts,
    isFetchingMore: isFetchingMoreProducts,
    hasMore: hasMoreProducts,
    loadMore: loadMoreProducts,
    error: productsError,
    refresh: refreshProducts,
  } = useInfiniteList(
    useGetAllProductsQuery,
    { search: activeTab === 'products' ? (debouncedSearch || undefined) : undefined },
    selectStandardEnvelope<Product>,
  );
  const productsSentinelRef = useInfiniteScrollTrigger(loadMoreProducts, hasMoreProducts && !isFetchingMoreProducts);

  // Total/Approved/Rejected/Pending counters below used to be computed from
  // `products.length`/`.filter()` over the fully-loaded array - correct only
  // while the whole catalog was fetched at once. Now that only one page is
  // loaded at a time, each count needs the backend's true total instead, via
  // a cheap page_size=1 request per status.
  const { data: totalResp } = useGetAllProductsQuery({ page_size: 1 });
  const { data: approvedResp } = useGetAllProductsQuery({ status: 'APPROVED', page_size: 1 });
  const { data: rejectedResp } = useGetAllProductsQuery({ status: 'REJECTED', page_size: 1 });
  const { data: pendingResp } = useGetAllProductsQuery({ status: 'PENDING', page_size: 1 });
  const totalProductsCount = totalResp?.data?.count ?? 0;
  const approvedCount = approvedResp?.data?.count ?? 0;
  const rejectedCount = rejectedResp?.data?.count ?? 0;
  const pendingCount = pendingResp?.data?.count ?? 0;

  // Reports (Apple App Review Guideline 1.2 - UGC moderation)
  const { data: reportsResp, isLoading: isLoadingReports, refetch: refetchReports } = useGetAdminReportsQuery(
    { status: reportsFilter },
    { skip: activeTab !== 'reports' }
  );
  const { data: pendingReportsResp } = useGetAdminReportsQuery({ status: 'pending' });
  const reports = reportsResp?.data || [];
  const pendingReportsCount = pendingReportsResp?.data?.length ?? 0;
  const [dismissReport, { isLoading: isDismissingReport }] = useDismissReportMutation();
  const [takedownReport, { isLoading: isTakingDown }] = useTakedownReportedProductMutation();

  const handleDismissReport = async (reportId: number) => {
    try {
      await dismissReport(reportId).unwrap();
      toast.success('Report dismissed');
      refetchReports();
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to dismiss report'));
    }
  };

  const handleTakedownReport = async (reportId: number) => {
    try {
      const result = await takedownReport(reportId).unwrap();
      toast.success(result.message || 'Listing taken down');
      refetchReports();
      refreshProducts();
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to take down listing'));
    }
  };

  // Mutations
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProductMutation();
  const [submitDraft, { isLoading: isSubmitting }] = useSubmitDraftMutation();
  const [deleteDraft, { isLoading: isDeletingDraft }] = useDeleteDraftMutation();

  const isDeleting = isDeletingCategory || isDeletingProduct || isDeletingDraft;

  // Fetch drafts
  const { data: draftsData, isLoading: isLoadingDrafts } = useGetDraftsQuery();
  const draftProducts = draftsData?.data || [];
  const filteredDrafts = draftProducts.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDeleteCategory = async (categorySlug: string) => {
    try {
      await deleteCategory(categorySlug).unwrap();
      refetchCategories();
      toast.success('Category deleted successfully');
      setShowDeleteConfirm(null);
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      toast.error(apiError(err, 'Failed to delete category'));
    }
  };

  const handleDeleteProduct = async (productSlug: string) => {
    try {
      const result = await deleteProduct(productSlug).unwrap();
      refreshProducts();
      toast.success(`Product "${result.data?.name || 'Unknown'}" deleted successfully`);
      setShowDeleteConfirm(null);
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      toast.error(apiError(err, 'Failed to delete product'));
    }
  };

  const handleEditCategory = (categorySlug: string) => {
    router.push(`/admin/product/category/${categorySlug}/edit`);
  };

  const handleSubmitDraft = async (slug: string) => {
    try {
      await submitDraft(slug).unwrap();
      toast.success('Draft submitted successfully');
      refreshProducts();
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to submit draft'));
    }
  };

  const handleDeleteDraft = async (slug: string) => {
    try {
      await deleteDraft(slug).unwrap();
      toast.success('Draft deleted successfully');
      setShowDeleteConfirm(null);
    } catch (err: any) {
      toast.error(apiError(err, 'Failed to delete draft'));
    }
  };

  return (
    <AppLayout showBottomNav={true} userRole="admin">
      <div className="min-h-screen bg-white pb-20">
        <div className="p-4 border-b border-gray-200 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Manage your categories and products</p>

          <div className="mb-4">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder={activeTab === 'categories' ? "Search categories..." : "Search products..."} 
            />
          </div>

          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'categories'
                  ? 'border-system-blue-light text-system-blue-light'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-system-blue-light text-system-blue-light'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'border-system-blue-light text-system-blue-light'
                  : 'border-transparent text-gray-600'
              }`}
            >
              Reports
              {pendingReportsCount > 0 && (
                <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] rounded-full font-bold leading-none">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'categories' ? (
            <div>
              {isLoadingCategories ? (
                <div className="space-y-3">
                  <CategoryListItemSkeleton />
                  <CategoryListItemSkeleton />
                  <CategoryListItemSkeleton />
                  <CategoryListItemSkeleton />
                </div>
              ) : categoriesError ? (
                <div className="text-center text-red-500">Failed to load categories.</div>
              ) : (
                <div className="space-y-3">
                  {filteredCategories.map((category: Category) => (
                    <AdminCategoryListItem
                      key={category.slug}
                      id={category.id}
                      name={category.name}
                      productCount={category.product_count || 0}
                      totalSales={parseFloat(category.total_sales || '0')}
                      onEdit={() => handleEditCategory(category.slug)}
                      onDelete={() => setShowDeleteConfirm({ type: 'category', slug: category.slug })}
                    />
                  ))}
                </div>
              )}

                        <Link
                          href="/admin/product/category/new/edit"
                          className="bg-[#f5f7fa] flex items-center justify-center gap-4 p-5 rounded-lg cursor-pointer w-full max-w-[370px] h-[101px] mx-auto shadow-sm hover:shadow-md transition-shadow text-system-blue-light font-semibold text-2xl mt-4"
                        >                <Plus className="w-8 h-8" />
                Add New Category
              </Link>
            </div>
          ) : activeTab === 'reports' ? (
            <div>
              <div className="flex gap-2 mb-4">
                {(['pending', 'reviewed', 'dismissed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setReportsFilter(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-colors ${
                      reportsFilter === s
                        ? 'bg-system-blue-light text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {isLoadingReports ? (
                <div className="space-y-3">
                  <ProductListItemSkeleton />
                  <ProductListItemSkeleton />
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Flag className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No {reportsFilter} reports</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report: any) => (
                    <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <button
                            onClick={() => router.push(`/admin/product/${report.product_slug}`)}
                            className="text-sm font-semibold text-gray-900 hover:underline text-left"
                          >
                            {report.product_name}
                          </button>
                          <p className="text-xs text-gray-600">Vendor: {report.vendor_name || 'N/A'}</p>
                          <p className="text-xs text-gray-600">Reported by: {report.reporter_email}</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium capitalize whitespace-nowrap">
                          {report.reason}
                        </span>
                      </div>
                      {report.details && (
                        <p className="text-xs text-gray-700 bg-white rounded p-2 mb-2">{report.details}</p>
                      )}
                      <p className="text-[11px] text-gray-400 mb-3">
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDismissReport(report.id)}
                            disabled={isDismissingReport || isTakingDown}
                            className="flex-1 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                          <button
                            onClick={() => handleTakedownReport(report.id)}
                            disabled={isDismissingReport || isTakingDown}
                            className="flex-1 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                          >
                            Take down listing
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="bg-system-blue-light text-white rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Products</p>
                    <p className="text-3xl font-bold">{totalProductsCount}</p>
                  </div>
                  <Package className="w-12 h-12 opacity-80" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[rgba(77,255,151,0.25)] rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Approved Products</p>
                    <p className="text-xl font-bold text-gray-900">{approvedCount}</p>
                  </div>
                  <div className="bg-[rgba(255,77,77,0.25)] rounded-lg p-3">
                    <p className="text-xs text-gray-700 mb-1">Rejected Products</p>
                    <p className="text-xl font-bold text-gray-900">{rejectedCount}</p>
                  </div>
                </div>

                <div className="bg-[rgba(255,212,59,0.5)] rounded-lg p-3">
                  <p className="text-xs text-gray-700 mb-1">Pending Products</p>
                  <p className="text-xl font-bold text-gray-900">{pendingCount}</p>
                  </div>
                </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Products</h2>
                <div className="flex gap-2">
                    <Link href="/admin/product/new" className="bg-system-blue-light text-white p-2 rounded-lg hover:bg-system-blue-dark transition-colors">
                        <Plus className="w-5 h-5" />
                    </Link>
                    <button><Filter className="w-5 h-5 text-gray-600" /></button>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="space-y-3">
                  <ProductListItemSkeleton />
                  <ProductListItemSkeleton />
                  <ProductListItemSkeleton />
                </div>
              ) : productsError ? (
                <div className="text-center text-red-500">Failed to load products.</div>
              ) : (
                <div className="space-y-3">
                  {products.map((product: Product) => (
                    <div
                      key={product.slug}
                      className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-start gap-3"
                    >
                      <button 
                        onClick={() => router.push(`/admin/product/${product.slug}`)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-600">{product.vendor?.store_name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{product.category}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                              <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  product.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                  product.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                                  'bg-yellow-100 text-yellow-700'
                              }`}>
                                  {product.status}
                              </span>
                              {(product.discount ?? 0) > 0 && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded font-bold">
                                      -{product.discount}%
                                  </span>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-bold text-gray-900 text-left">
                              {(product.discount ?? 0) > 0 ? (
                                  `₦${(parseFloat(product.price) * (1 - (product.discount ?? 0) / 100)).toLocaleString()}`
                              ) : (
                                  `₦${parseFloat(product.price).toLocaleString()}`
                              )}
                          </p>
                          {(product.discount ?? 0) > 0 && (
                              <p className="text-xs text-gray-400 line-through">₦{parseFloat(product.price).toLocaleString()}</p>
                          )}
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm({ type: 'product', slug: product.slug });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div ref={productsSentinelRef} className="h-1" />
              {isFetchingMoreProducts && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-system-blue-light border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Draft Products */}
              {draftProducts.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">Draft Products</h2>
                  <div className="space-y-3">
                    {filteredDrafts.map((product: any) => (
                      <div key={product.slug} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-600 mb-1">
                              Stock: {product.stock} units
                            </p>
                            <p className="text-xs text-gray-600 mb-2">
                              {product.category}
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ₦{parseFloat(product.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/product/${product.slug}/edit?type=draft`}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-5 h-5 text-system-blue-light" />
                            </Link>
                            <button
                              onClick={() => handleSubmitDraft(product.slug)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              disabled={isSubmitting}
                            >
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm({ slug: product.slug, type: 'draft' })}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete {showDeleteConfirm.type === 'category' ? 'Category' : 'Product'}?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'category') {
                    handleDeleteCategory(showDeleteConfirm.slug);
                  } else if (showDeleteConfirm.type === 'draft') {
                    handleDeleteDraft(showDeleteConfirm.slug);
                  } else {
                    handleDeleteProduct(showDeleteConfirm.slug);
                  }
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}