// //@ts-nocheck
// "use client"
// import { useState, useEffect, useCallback } from "react";
// import { useRouter, usePathname, useSearchParams } from "next/navigation";
// import SortProducts, { SortOptions } from "./sort-products";
// import { ProductCategories } from "@lib/util/list-categories";
// import { Text } from "@medusajs/ui";
// import { ProductArtists } from "@lib/util/list-artists";
// // import { getProductsList } from "@lib/data"
// // import { medusaClient } from "@lib/config";

// type RefinementListProps = {
//   sortBy: SortOptions;
//   search?: boolean;
// };

// const RefinementList = ({ sortBy }: RefinementListProps) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [categories, setCategories] = useState([]);
//   const [check, setCheck] = useState(localStorage.getItem("checkedCategoryId") || "/");
//   const [artistCheck, setArtistCheck] = useState(localStorage.getItem("checkedArtistId") || "/");
//   const [artists, setArtists] = useState({});
//   const [selectedArtistValue, setSelectedArtistValue] = useState(localStorage.getItem("selectedArtistValue") || "All");
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const categoriesData = await ProductCategories();
//         setCategories(categoriesData.product_categories)

//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const createQueryString = useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams);
//       params.set(name, value);
//       return params.toString();
//     },
//     [searchParams]
//   );

//   const setQueryParams = (name: string, value: string) => {
//     const query = createQueryString(name, value);
//     router.push(`${pathname}?${query}`);
//   };

//   const handleCategoryChange = (e) => {
//     let value = e.target.value
//     if (value === "/") {
//       localStorage.setItem("checkedCategoryId", value);
//       router.push("/store")
//       return
//     }
//     setCheck(value);
//     localStorage.setItem("checkedCategoryId", value);
//     router.push(`/categories/${value}`);
//   }

//   const handleArtistChange = (artistId: string, artistValue: string) => {
//     if (artistId === "/") {
//       localStorage.setItem("checkedArtistId", artistId);
//       setSelectedArtistValue("All");
//       router.push("/store");
//       return;
//     }
//     setArtistCheck(artistId);
//     localStorage.setItem("checkedArtistId", artistId);
//     setSelectedArtistValue(artistValue);
//     localStorage.setItem("selectedArtistValue", artistValue);
//     router.push(`/artist/${artistId}`);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const artists = await ProductArtists()
//         setArtists(artists[0])
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="flex flex-col">
//       <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
//         <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
//       </div>
//       <div className="flex flex-row justify-between md:flex md:flex-col md:justify-normal pl-6 overflow-hidden flex-wrap">
//       {categories && (
//         <>
//           <div >
//             <Text className="txt-compact-small-plus mb-4 text-ui-fg-muted">Category</Text>
//             <div className="language-selector hover:text-ui-fg-base">
//               <select className="dark:text-white bg-transparent dark:bg-black" onChange={(e) => handleCategoryChange(e)} value={check}>
//                 <option value={"/"}>All</option>
//                 {categories
//                   .filter(category => category.parent_category_id === null && category.category_children.length === 0) // Filter top-level parent categories without children
//                   .map(parentCategory => (
//                     <option key={parentCategory.id} value={parentCategory.handle}>{parentCategory.name}</option>
//                   ))}
//               </select>
//             </div>
//           </div>

//           {/* Dropdown for parent categories with children */}
//           {categories
//             .filter(category => category.parent_category_id === null && category.category_children.length > 0) // Filter top-level parent categories with children
//             .map(parentCategory => (
//               <div key={parentCategory.id}>
//                 <Text className="txt-compact-small-plus mb-4 mt-4 text-ui-fg-muted">{parentCategory.name}</Text>
//                 <div className="language-selector hover:text-ui-fg-base">
//                   <select className="dark:text-white bg-transparent dark:bg-black w-32" onChange={(e) => handleCategoryChange(e)} value={check}>
//                     <option value={"/"}>All</option>
//                     {parentCategory.category_children.map(child => (
//                       <option key={child.id} value={child.handle}>{child.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             ))}
//         </>
//       )}
//       <div>
//           <Text className="txt-compact-small-plus mb-4 mt-4 text-ui-fg-muted">Artists</Text>
//           {artists?.values && (
//             <>
//               <div className="language-selector hover:text-ui-fg-base">
//                 <select
//                   className="dark:text-white bg-transparent dark:bg-black w-32"
//                   onChange={(e) => handleArtistChange(e.target.value, e.target.options[e.target.selectedIndex].text)}
//                   value={artistCheck}
//                 >
//                   <option value={"/"}>All</option>
//                   {artists.values.map((artist) => (
//                     <option key={artist.id} value={artist.id}>
//                       {artist.value}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RefinementList;


//@ts-nocheck
"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SortProducts, { SortOptions } from "./sort-products"
import { ProductCategories } from "@lib/util/list-categories"
import { Text } from "@medusajs/ui"
import { ProductArtists } from "@lib/util/list-artists"
import { Button } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import TextConvertor from "@modules/products/components/text-convertor"
type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean,
  locale: string
}

const RefinementList = ({ sortBy,locale }: RefinementListProps) => {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const savedCategories = localStorage.getItem('selectedCategories');
    return savedCategories ? JSON.parse(savedCategories) : {};
  });
  const [artists, setArtists] = useState({})
  const [artistCheck, setArtistCheck] = useState("/")
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await ProductCategories()
        setCategories(categoriesData.product_categories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await ProductArtists()
        setArtists(artistsData[0])
      } catch (error) {
        console.error("Error fetching artists:", error)
      }
    }
    fetchArtists()
  }, [])

  const handleCategoryChange = (e, parentCategoryId) => {
    const selectedHandle = e.target.value;
    setSelectedCategories((prev) => {
      const newState = selectedHandle === "/"
        ? { ...prev, [parentCategoryId]: undefined } // Remove the entry if "All" is selected
        : { ...prev, [parentCategoryId]: selectedHandle }; // Update with new selection
      
      localStorage.setItem('selectedCategories', JSON.stringify(newState)); // Save to localStorage
      return newState;
    });
  };

  const handleArtistChange = (artistId: string) => {
    setArtistCheck(artistId)
    if (artistId === "/") {
      localStorage.setItem("checkedArtistId", artistId)
      router.push("/store")
      return
    }
    router.push(`/artist/${artistId}`)
  }
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

  const handleSearch = () => {
    const query = Object.entries(selectedCategories)
    .filter(([key, value]) => value && value !== "/") // Keep only entries with defined and non-"/" values
    .map(([key, value]) => value) // Extract the value part
    .join("_"); // Join the remaining values with "_"

    if (query) {
      router.push(`/categories/${query}`)
    } else {
      router.push("/store")
    }
  }


  return (
    <div className="flex flex-col">
      {/* Sorting and other controls */}
      <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} />
      {/* Category Selection */}
      <div className="flex flex-row justify-around md:flex md:flex-col md:justify-normal overflow-hidden flex-wrap">
      {categories.length > 0 &&
        categories
          .filter(
            (category) =>
              category.parent_category_id === null &&
              category.category_children.length > 0
          )
          .map((parentCategory) => (
            <div key={parentCategory.id}>
              <Text className="txt-compact-small-plus mb-4 mt-4 text-ui-fg-muted">
              <TextConvertor locale={locale ?? "en"} title={parentCategory.name as string} metadata={parentCategory?.metadata?.title ?? null as any}/>
              </Text>
              <select
                className="bg-transparent w-32"
                onChange={(e) => handleCategoryChange(e, parentCategory.id)}
                value={selectedCategories[parentCategory.id] || "/"}
              >
                <option value="/">{t("all")}</option>
                {parentCategory.category_children.map((child) => (
                  <option key={child.id} value={child.handle}>
                    <TextConvertor locale={locale ?? "en"} title={child.name as string} metadata={child?.metadata?.title ?? null as any}/>
                  </option>
                ))}
              </select>
            </div>
          ))}
          </div>
      <div className="flex w-full justify-center items-center">
      <Button onClick={handleSearch} type="submit" className="min-w-[150px] mt-5">
        {t("search")}
      </Button>
      </div>
    </div>
  )
}

export default RefinementList
