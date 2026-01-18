import CategoryClientPage from './CategoryClientPage';

// This is the new, simplified Server Component.
// Its only job is to safely get the 'name' from the URL params
// and pass it as a simple string prop to the Client Component.
export default async function CategoryPage({ params }: { params: Promise<{ name:string }> }) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.name;
  return <CategoryClientPage categoryName={categoryName} />;
}

