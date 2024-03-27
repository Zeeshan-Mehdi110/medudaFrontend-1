//@ts-nocheck
"use client"
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SortProducts, { SortOptions } from "./sort-products";
import { ProductCategories } from "@lib/util/list-categories";
import { Text } from "@medusajs/ui";
import { ProductArtists } from "@lib/util/list-artists";
// import { getProductsList } from "@lib/data"
// import { medusaClient } from "@lib/config";

type RefinementListProps = {
  sortBy: SortOptions;
  search?: boolean;
};

const RefinementList = ({ sortBy }: RefinementListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [check, setCheck] = useState(localStorage.getItem("checkedCategoryId") || "/");
  const [artistCheck, setArtistCheck] = useState(localStorage.getItem("checkedArtistId") || "/");
  const [artists, setArtists] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await ProductCategories();
        setCategories(categoriesData.product_categories)

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  };

  const handleCategoryChange = (e) => {
    let value = e.target.value
    if (value === "/") {
      localStorage.setItem("checkedCategoryId", value);
      router.push("/store")
      return
    }
    setCheck(value);
    localStorage.setItem("checkedCategoryId", value);
    router.push(`/categories/${value}`);
  }

  const handleArtistChange = (artistId: string) => {
    setArtistCheck(artistId);
    if (artistId === "/") {
      localStorage.setItem("checkedartistId", artistId);
      router.push("/store")
      return
    }
    router.push(`/artist/${artistId}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artists = await ProductArtists()
        setArtists(artists[0])
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      </div>
      <div className="md:flex md:flex-row md:justify-between">
      {categories && (
        <>
          {/* <div >
            <Text className="txt-compact-small-plus mb-4 text-ui-fg-muted">Category</Text>
            <div className="language-selector hover:text-ui-fg-base">
              <select className="dark:text-white bg-transparent dark:bg-black" onChange={(e) => handleCategoryChange(e)} value={check}>
                <option value={"/"}>All</option>
                {categories
                  .filter(category => category.parent_category_id === null && category.category_children.length === 0) // Filter top-level parent categories without children
                  .map(parentCategory => (
                    <option key={parentCategory.id} value={parentCategory.handle}>{parentCategory.name}</option>
                  ))}
              </select>
            </div>
          </div> */}

          {/* Dropdown for parent categories with children */}
          {categories
            .filter(category => category.parent_category_id === null && category.category_children.length > 0) // Filter top-level parent categories with children
            .map(parentCategory => (
              <div key={parentCategory.id}>
                <Text className="txt-compact-small-plus mb-4 mt-4 text-ui-fg-muted">{parentCategory.name}</Text>
                <div className="language-selector hover:text-ui-fg-base">
                  <select className="dark:text-white bg-transparent dark:bg-black w-32" onChange={(e) => handleCategoryChange(e)} value={check}>
                    <option value={"/"}>All</option>
                    {parentCategory.category_children.map(child => (
                      <option key={child.id} value={child.handle}>{child.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </>
      )}
      <Text className="txt-compact-small-plus mb-4 mt-8 text-ui-fg-muted">Artists</Text>
      {artists?.values && (
        <>
          <div className="language-selector hover:text-ui-fg-base">
            <select className=" dark:text-white bg-transparent dark:bg-black w-32" onChange={(e) => {
              handleArtistChange(e.target.value);
            }} value={artistCheck}>
              <option selected value={"/"}>All</option>
              {artists.values.map((artist) => (
                <option key={artist.id} value={artist.id}>{artist.value}</option>
              ))}
            </select>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default RefinementList;
