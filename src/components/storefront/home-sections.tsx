"use client";

import type { CategorySummary, CampaignSummary, EditorialTile, ProductSummary } from "@/lib/commerce/contracts";
import { Reveal } from "@/components/motion/reveal";
import { LatestDrop } from "@/components/storefront/latest-drop";
import { CategoryRail } from "@/components/storefront/category-rail";
import { EditorialWall } from "@/components/storefront/editorial-wall";
import { EditorialFeature } from "@/components/storefront/editorial-feature";
import { PayungTeaser } from "@/components/storefront/payung-teaser";
import { useOperations } from "@/components/commerce/operations-provider";

function active(startsAt:string,endsAt:string){const now=Date.now();if(startsAt&&now<new Date(startsAt).getTime())return false;if(endsAt&&now>new Date(endsAt).getTime())return false;return true;}
export function HomeSections({latest,categories,tiles,editorial}:{latest:ProductSummary[];categories:CategorySummary[];tiles:EditorialTile[];editorial:CampaignSummary}){
  const {state}=useOperations();
  return <>{state.content.sections.filter((section)=>section.visible&&active(section.startsAt,section.endsAt)).map((section)=>{
    if(section.id==="latest") return <Reveal key={section.id}><LatestDrop products={latest}/></Reveal>;
    if(section.id==="categories") return <Reveal key={section.id}><CategoryRail categories={categories}/></Reveal>;
    if(section.id==="editorial-wall") return <Reveal key={section.id}><EditorialWall tiles={state.content.editorialTiles.length?state.content.editorialTiles:tiles}/></Reveal>;
    if(section.id==="editorial-feature") return <Reveal key={section.id}><EditorialFeature campaign={editorial}/></Reveal>;
    if(section.id==="payung") return <Reveal key={section.id}><PayungTeaser/></Reveal>;
    return null;
  })}</>;
}
