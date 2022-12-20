import { Blur, ShoppingBag } from "iconsax-react";
import React from "react";

function TitleCard({ title }: { title: string; }) {
  return (
    <div className={`flex items-center justify-center flex-col pb-6 w-[80%] pt-2`}>
      <div className="w-[50px] h-[50px] shrink-0 flex items-center justify-center">
        <Blur size={50} variant="Bold" className="text-primary" />
      </div>
      <strong className="text-primary text-2xl">Aza Bank</strong>
      <p className="text-lg p-[3px] font-[400] text-neutral-700 dark:text-neutral-200 text-center">
        {title}
      </p>
    </div>
  );
}

export default TitleCard;
