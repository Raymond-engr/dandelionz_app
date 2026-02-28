import type { Metadata } from 'next';
import CategoryClientPage from './CategoryClientPage';

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.name;
  const capitalizedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ');

  return {
    title: capitalizedName,
    description: `Browse the best collection of ${capitalizedName} products on Dandelionz. Shop high-quality items from verified vendors.`,
    openGraph: {
      title: `${capitalizedName} | Dandelionz`,
      description: `Shop the latest ${capitalizedName} on Dandelionz.`,
    },
  };
}

// This is the new, simplified Server Component.
// Its only job is to safely get the 'name' from the URL params
// and pass it as a simple string prop to the Client Component.
export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.name;
  return <CategoryClientPage categoryName={categoryName} />;
}
