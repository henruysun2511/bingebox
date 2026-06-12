
import { Setting } from "@/types/object";
import Image from "next/image";
import Link from "next/link";


interface FooterProps {
  settings: Setting;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer data-theme-fixed className="w-full font-sans" id="footer">
      {/* TOP FOOTER */}
      <div className="bg-black text-white py-10 px-5 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Cột 1: Về BingeBox */}
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold mb-4 uppercase tracking-wider">
              VỀ {settings.name}
            </h1>
            <div className="bg-[#004aad] w-48 h-2.5 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/aboutUs" className="hover:text-[#004aad] transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/showtime" className="hover:text-[#004aad] transition-colors">Lịch chiếu</Link></li>
              <li><Link href="/new" className="hover:text-[#004aad] transition-colors">Tin tức</Link></li>
              <li><Link href="/price" className="hover:text-[#004aad] transition-colors">Giá vé</Link></li>
            </ul>
          </div>

          {/* Cột 2: Quy định & Điều khoản */}
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold mb-4 uppercase tracking-wider">
              QUY ĐỊNH & ĐIỀU KHOẢN
            </h1>
            <div className="bg-[#004aad] w-48 h-2.5 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-300 text-sm md:text-base">
              <li><Link href="#" className="hover:text-[#004aad] transition-colors">Điều khoản</Link></li>
              <li><Link href="#" className="hover:text-[#004aad] transition-colors">Quy định thành viên</Link></li>
              <li><Link href="#" className="hover:text-[#004aad] transition-colors">Quy định và chính sách chung</Link></li>
              <li><Link href="#" className="hover:text-[#004aad] transition-colors">Chính sách bảo vệ thông tin cá nhân</Link></li>
            </ul>
          </div>

          {/* Cột 3: Chăm sóc khách hàng & Social */}
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold mb-4 uppercase tracking-wider">
              CHĂM SÓC KHÁCH HÀNG
            </h1>
            <div className="bg-[#004aad] w-48 h-2.5 rounded-full mb-6"></div>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li><p><strong>Hotline:</strong> {settings.hotline}</p></li>
              <li><p><strong>Giờ làm việc:</strong> {settings.workHours || "9:00 - 22:00 (Tất cả các ngày)"}</p></li>
              <li><p><strong>Email:</strong> {settings.email}</p></li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {settings.social?.facebook && (
                <Link href={settings.social.facebook} target="_blank" className="hover:opacity-80 transition-opacity">
                  <Image src="/facebook_Logo.png" alt="Facebook" width={40} height={40} className="w-10 h-10 object-contain" />
                </Link>
              )}
              {settings.social?.instagram && (
                <Link href={settings.social.instagram} target="_blank" className="hover:opacity-80 transition-opacity">
                  <Image src="/instagram_logo.png" alt="Instagram" width={40} height={40} className="w-10 h-10 object-contain" />
                </Link>
              )}
              {settings.social?.zalo && (
                <Link href={settings.social.zalo} target="_blank" className="hover:opacity-80 transition-opacity">
                  <Image src="/zalo_logo.png" alt="Zalo" width={40} height={40} className="w-10 h-10 object-contain" />
                </Link>
              )}
              {settings.social?.tiktok && (
                <Link href={settings.social.tiktok} target="_blank" className="hover:opacity-80 transition-opacity">
                  <Image src="/tiktok_logo.png" alt="Tiktok" width={40} height={40} className="w-10 h-10 object-contain" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="bg-[#16171F] py-8 px-5 md:px-[110px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <img
              src={settings.logo || "/bingebox_logo.png"}
              alt="Logo BingeBox"
              className="object-contain"
            />
          </div>

          {/* Info Content */}
          <div className="text-white text-center md:text-left space-y-2">
            <p className="font-bold text-lg">{settings.company}</p>
            <p className="text-sm text-gray-400 font-medium">
              <strong>Giấy CNĐKDN:</strong> Giấy phép kinh doanh số: 0104597158. Đăng ký lần đầu ngày 15 tháng 04 năm 2010
            </p>
            <p className="text-sm text-gray-400 font-medium">
              <strong>Địa chỉ:</strong> {settings.address}
            </p>
            <p className="text-sm text-gray-400 font-medium">
              <strong>Hotline:</strong> {settings.hotline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

