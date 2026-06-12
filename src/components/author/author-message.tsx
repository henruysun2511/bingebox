import { Quote } from "lucide-react";

interface Props {
  content: string;
  name: string;
  position: string;
  image: string;
}

export default function AuthorMessage({ content, name, position, image }: Props) {
  return (
    <div className="fixed right-6 bottom-6 z-50 w-[280px] hidden lg:block">
      <div className="flex flex-col items-center w-full group">
        <div className="relative bg-comment p-5 rounded-lg w-full flex flex-col items-center justify-center text-center italic shadow-xl transition-transform duration-300 group-hover:-translate-y-1">
          <Quote size={18} className="text-quote mb-2 rotate-180 fill-quote" />

          <p className="text-sm font-medium leading-relaxed">
            {content}
          </p>

          <Quote size={18} className="text-quote mt-2 fill-quote" />

          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
            border-l-[15px] border-l-transparent 
            border-r-[15px] border-r-transparent 
            border-t-[15px]" style={{ borderTopColor: 'var(--color-comment)' }} />
        </div>

        <div className="text-center mt-8 space-y-2">
          <div className="w-16 h-16 mx-auto overflow-hidden rounded-full border-2 border-yellow-500 shadow-lg">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold uppercase tracking-tight">
            {name}
          </h3>
          <p className="text-[11px] text-gray-500 italic uppercase tracking-widest">
            {position}
          </p>
        </div>
      </div>
    </div>
  );
}

