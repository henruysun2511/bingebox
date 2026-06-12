import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Christopher Nolan",
    position: "Đạo diễn",
    image: "https://github.com/henruysun2511/BingeBox_Project/blob/main/assets/images/nolan.jpg?raw=true",
    content: "Tôi không thể tin Việt Nam lại sở hữu một rạp phim với chất lượng quốc tế đến vậy."
  },
  {
    name: "Leonardo DiCaprio",
    position: "Diễn viên Hollywood",
    image: "https://github.com/henruysun2511/BingeBox_Project/blob/main/assets/images/leonardo.webp?raw=true",
    content: "Âm thanh sống động, hình ảnh mãn nhãn thị giác, tôi thật mãn nguyện khi được thấy bản thân mình đang chuyển động trước màn hình. Cảm ơn BingeBox Cinema đã cho tôi một trải nghiệm tuyệt vời."
  },
  {
    name: "Trấn Thành",
    position: "Nhà sản xuất",
    image: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/2/4/1001257/Tt.jpg",
    content: "Phim tôi đạo diễn phải cho chiếu ở rạp BingeBox đầu tiên"
  },
  {
    name: "Cristiano Ronaldo",
    position: "Cầu thủ bóng đá",
    image: "https://github.com/henruysun2511/BingeBox_Project/blob/main/assets/images/ronaldo.jpg?raw=true",
    content: "Ngay khi đặt chân đến Việt Nam, điều đầu tiên tôi phải làm ngay không phải là đá bóng với Quang Hải mà phải vào rạp BingeBox ngay để thưởng thức màn chiêu đãi thị giác có một không hai."
  }
];

export default function ExpertReviews() {
  return (
    <section className="my-[150px]">
      <div className="container mx-auto px-4">
        {/* BOX HEAD */}
        <div className="text-center mb-[30px]">
          <h2 className="text-[40px] font-bold text-yellow-500 mb-5">
            ĐÁNH GIÁ TỪ CHUYÊN GIA
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Binge Box Cinema luôn là rạp phim uy tín chất lượng hàng đầu Việt Nam.
            Được công nhận và đánh giá từ các chuyên gia, nhà phê bình và diễn viên
            hàng đầu trong và ngoài nước.
          </p>
        </div>

        {/* REVIEWS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {testimonials.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
             <div className="relative bg-comment p-5 rounded-lg w-full h-full flex flex-col items-center justify-center text-center italic">
                {/* Icon nháy kép mở */}
                <Quote size={20} className="text-quote mb-2 rotate-180 fill-quote" />
                
                <p className="font-medium leading-relaxed">
                  {item.content}
                </p>

                {/* Icon nháy kép đóng */}
                <Quote size={20} className="text-quote mt-2 fill-quote" />

                {/* Hình tam giác chỉ xuống (Pseudo-element ::after) */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px]" style={{ borderTopColor: 'var(--color-comment)' }}></div>
              </div>

              {/* THÔNG TIN NHÂN VẬT (INNER INFO) */}
              <div className="text-center mt-10 space-y-2">
                <div className="w-20 h-20 mx-auto overflow-hidden rounded-full border-2 border-neutral-800">
                   <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                   />
                </div>
                <h3 className="text-[23px] font-semibold mt-5">
                  {item.name}
                </h3>
                <p className="text-gray-500 italic">
                  {item.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
