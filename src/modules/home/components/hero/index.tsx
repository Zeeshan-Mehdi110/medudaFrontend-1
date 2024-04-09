import { Github } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import HeroProducts from "../hero-products";
import heroBanner from "../../../../../public/PixelsJourney.png";
import MySwiperComponent from "../hero-carousel";
const Hero = ({locale}:{locale:string}) => {
  return (
    <div className="flex flex-col md:flex-row justify-center h-[75vh] gap-4 pr-2 pl-2 mt-4">
      <div className="h-full flex-grow flex-shrink w-full md:w-4/5 border-b border-ui-border-base relative bg-ui-bg-subtle flex justify-center rounded-lg shadow-xl" >
      
      <MySwiperComponent/>

      </div>
      <div className="w-full sm:w-auto pl-4 h-full flex overflow-hidden flex-col float-right gap-2 shadow-xl rounded-lg">
          <HeroProducts locale={locale} />
        </div>
    </div>
  );
};

export default Hero;
