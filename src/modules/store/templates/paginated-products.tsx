import { getProductsListWithSort } from "@lib/data";
import ProductPreview from "@modules/products/components/product-preview";
import { Pagination } from "@modules/store/components/pagination";
import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import { getRegion } from "app/actions";
import initTranslations from "app/i18n";

const PRODUCT_LIMIT = 12;

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryIds, // Assume this can now be an array
  productsIds,
  countryCode,
  locale,
  artist
}: {
  sortBy?: SortOptions;
  page: number;
  collectionId?: string; // Assuming this remains singular for simplicity, adjust as needed
  categoryIds?: string[]; // Adjusted to expect an array
  productsIds?: string[];
  countryCode: string;
  locale: string;
  artist?: string;
}) {
  const region = await getRegion(countryCode);
  const { t } = await initTranslations(locale, ['common']);
  if (!region) {
    return null;
  }

  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  };

  // Adjusting for collectionId to be singular, as an example. Modify as needed.
  if (collectionId) {
    queryParams["collection_id"] = [collectionId];
  }

  // Now directly assigning the array without wrapping it in another array
  if (categoryIds && categoryIds.length) {
    queryParams["category_id"] = categoryIds;
  }

  if (productsIds) {
    queryParams["id"] = productsIds;
  }

  let {
    response: { products, count },
  } = await getProductsListWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  });
  products = products.filter((p) => (p.handle !== "custom-print" && p.is_giftcard == false));

  const totalPages = Math.ceil(count / PRODUCT_LIMIT);

  return (
    <>
    {products.length > 0 ? (
      <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview productPreview={product} region={region} locale={locale} />
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center text-xl-semi mt-4">{t("no-products-found")}</div>
    )}
    {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
  </>
  );
}