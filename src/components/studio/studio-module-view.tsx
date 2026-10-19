import { StudioIcon, type StudioIconName } from "@/components/studio/studio-icons";
export const studioModuleMap: Record<string,{title:string;icon:StudioIconName;summary:string}> = {
  products:{title:"Products",icon:"products",summary:"Catalogue and product operations."},
  collections:{title:"Collections",icon:"collections",summary:"Collection merchandising and publishing."},
  inventory:{title:"Inventory",icon:"inventory",summary:"Variant stock and adjustment operations."},
  customers:{title:"Customers",icon:"customers",summary:"Customer, order and membership context."},
  payung:{title:"Payung Program",icon:"payung",summary:"Members, points, tiers and reward catalogue."},
  promotions:{title:"Promotions",icon:"promotions",summary:"Discount rules, codes and schedules."},
  drops:{title:"Drops & Events",icon:"drops",summary:"Release scheduling and campaign control."},
  content:{title:"Content Studio",icon:"content",summary:"Storefront merchandising and media control."},
  reports:{title:"Reports",icon:"reports",summary:"Commercial and operational reporting."},
  support:{title:"Support",icon:"support",summary:"Customer conversations and order context."},
  settings:{title:"Settings",icon:"settings",summary:"Store, fulfilment and integration configuration."},
};
export function StudioModuleView({module}:{module:keyof typeof studioModuleMap}){const entry=studioModuleMap[module];return <div className="studio-page"><section className="studio-card p-5"><div className="flex items-center gap-3"><StudioIcon name={entry.icon} className="h-4 w-4"/><p className="text-[10px] font-bold">{entry.title}</p></div></section></div>}
