import { DataPagination } from "@/components/admin/pagination/data-pagination";
import ActorCardSkeleton from "@/components/common/skeleton/actor-card-skeleton";
import { useActorList } from "@/queries/useActorQuery";
import { useState } from "react";
import ActorCard from "./actor-card";

export const alphabetImages = [
    {
        alphabet: "",
        img: null
    },
    { alphabet: "A", img: "https://images2.thanhnien.vn/528068263637045248/2024/11/25/mam9047-copy-17325134328761172213077.jpg" },
    { alphabet: "B", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brad_Pitt_2019_by_Glenn_Francis.jpg/960px-Brad_Pitt_2019_by_Glenn_Francis.jpg" },
    { alphabet: "C", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdRWkPm8n52LlE8T8qLO6AlhWuRidquhMieQ&s" },
    { alphabet: "D", img: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSsKomPXmLMNkKRjYMcTnzejIfrFdpzkNvhZRCDwIgQzRrtqyObcAS-NWSH_3rOYoaCYPqBMLkOzPHl7ft2VunrdvJX8QKYY2QoCPkWcICkg5rF39EfSQvqlZhGGrNMGDgwJwmAlf2n&s=19" },
    { alphabet: "E", img: "https://m.media-amazon.com/images/M/MV5BMjEzMjA0ODk1OF5BMl5BanBnXkFtZTcwMTA4ODM3OQ@@._V1_.jpg" },
    { alphabet: "F", img: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQJKosSMuSBQqVlKQBkc6CYFg8-3tuZ6CAV28r1NJtoxtyus930Z3pHgKOyV9gJXdLZGhwUi0QvtiNOb3Q" },
    { alphabet: "G", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLJqLu6hVhFY9d1EZzldGa6xJ_CoT_jcsOMw&s" },
    { alphabet: "H", img: "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/594967022_1516503276319019_8492803772297431689_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeEqpj_W1mY3f9Ind2M2MR0MfkBe9wLyyPF-QF73AvLI8bsDO1r5N9BB285-jH05W2M308Iblmz1ZK5GGFRs2rGh&_nc_ohc=pILzs-qRekAQ7kNvwEwW8e2&_nc_oc=Adlh9LfA2cvWf3vbfiwIzaJVIuQXTRCUKLJZXEWULM9Y_XMtTm-7Iz3DSvI5DyIcP5wQbj0ReXWbYj459KfkQKXm&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=LzKl7QVKb-gvwX0rmXHRWg&oh=00_Afu7D28RzMsEGMvJVczwBgEt4JBzwau06cBaty9XNR-_-Q&oe=69A4C57C" },
    { alphabet: "I", img: "https://hips.hearstapps.com/hmg-prod/images/idris-image-1675167329.jpg?crop=1.00xw:0.981xh;0,0&resize=1200:*" },
    { alphabet: "J", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_F1IOlmpvx9JJ9H-IB37At2hxldNode2tcw&s" },
    { alphabet: "K", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZ9xJalMbxDrosQoiBpmmu4ERrpbXn_Z491aCLHvEH6pqBOESuNFmH-Xu194NRkVTVrvi8xaZpSH6qKPLNzhPrruXro4esvqI-UNqwPs&s=10" },
    { alphabet: "L", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Leonardo_DiCaprio_2014.jpg" },
    { alphabet: "M", img: "https://upload.wikimedia.org/wikipedia/commons/5/57/SYDNEY%2C_AUSTRALIA_-_JANUARY_23_Margot_Robbie_arrives_at_the_Australian_Premiere_of_%27I%2C_Tonya%27_on_January_23%2C_2018_in_Sydney%2C_Australia_%2828074883999%29_%28cropped_2%29.jpg" },
    { alphabet: "N", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMYXp_W0v6ZtLEjcw_xmPzuZg0wqc7dINbaDR0kxCxxei8Ij6KrYvfNoZW9WUBEpl3c1xktMA6pwK80ZOPiBfRDdrHxsTQZ1nM-ZExmI&s=10" },
    { alphabet: "O", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYfnw2oj8U8O6XcPbyCt7MsY1Ot16UUYmJ_g&s" },
    { alphabet: "P", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZGtHPAZRtpKYaBXJvGDwJqrkeIBUoWhWG76JiYBge9AdY6WB7xVmDXEyY4XXDmchJHgMZCgzc3Dckg-0Vig9nFnG83AuSrvA0N5-ZAg&s=10" },
    { alphabet: "Q", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTyxHBvwmVi4aop9nnrgyQ6qP0_AQQuLQINk3SEhoVp-g9epB5b_7RmbCDEhrOEwYqb4sEqFBULJ5KwoI3yQWeFnocvRajxR1tMRd8xQ&s=10" },
    { alphabet: "R", img: "https://hips.hearstapps.com/hmg-prod/images/midnight-in-paris-premiere---64th-annual-cannes-film-festival.jpg" },
    { alphabet: "S", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-fcns60P3N6KeRmgovHCP3n5nXWKYcubkzcNvN149JjJdOcaqR25xvxiUg6jQYMcSKLEDbxXNExJefscMwmmHR9d8Ko07WunQT0aXGw&s=10" },
    { alphabet: "T", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Timoth%C3%A9e_Chalamet_in_2018_%28cropped%29.jpg/250px-Timoth%C3%A9e_Chalamet_in_2018_%28cropped%29.jpg" },
    { alphabet: "U", img: "https://vpf.vn/wp-content/uploads/2023/07/23.jpg" },
    { alphabet: "V", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFPzMI9lr1khfmxkjSxadeRRTHZHnfPvzsC8F85LdvZ0Gvi4n9wdoKL8DHfwDB4tgENHsUgQ-l1VRo_0E3kWJkFLkgOKd4lTxyWUs9ObY&s=10" },
    { alphabet: "W", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0IM_7qByedIGYSBCYPTeMqJHQMD4O2tXMkw&s" },
    { alphabet: "X", img: "https://static0.cbrimages.com/wordpress/wp-content/uploads/2017/11/Patrick-Stewart-Professor-X-Charles-Xavier-movie.jpg" },
    { alphabet: "Y", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNuxRTW1nt0EJzyTQYetW2fNdD6neZlWzhUtIMKI1mwHuC2sbxXbGrnKPuY1p24UyBkHdNcYPBWCQnm_H58MQ-tUWctKQ4-oqBOTusZA&s=10" },
    { alphabet: "Z", img: "https://m.media-amazon.com/images/M/MV5BMTUxNzY3NzYwOV5BMl5BanBnXkFtZTgwNzQ3Mzc4MTI@._V1_FMjpg_UX1000_.jpg" }
];



export default function ActorList() {
    const [page, setPage] = useState(1);
    const [alphabet, setAlphabet] = useState("");
    const limit = 32;

    const { data, isLoading } = useActorList({
        page,
        limit,
        alphabet,
    });

    if (isLoading) {
        return <ActorCardSkeleton />;
    }

    const actors = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="space-y-12 max-w-7xl mx-auto">

            {/* Alphabet */}
            <div className="flex flex-wrap gap-4 justify-center">
                {alphabetImages.map((item) => {
                    const isActive = alphabet === item.alphabet;

                    return (
                        <button
                            key={item.alphabet || "all"}
                            onClick={() => {
                                setAlphabet(item.alphabet);
                                setPage(1);
                            }}
                            className={`cursor-pointer group relative w-24 h-28 rounded-lg overflow-hidden border-2 transition-all duration-300
                            ${isActive
                                    ? "border-primary scale-110"
                                    : "border-gray-700 hover:border-white"
                                }`}
                        >
                            {item.img ? (
                                <>
                                    <img
                                        src={item.img}
                                        alt={item.alphabet}
                                        className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition"
                                    />

                                    <span className="absolute inset-0 flex items-end justify-start pl-1 pb-1 text-white font-bold text-lg">
                                        {item.alphabet}
                                    </span>
                                </>
                            ) : (
                                <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                                    ALL
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Actor Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                {actors.length > 0 ? (
                    actors.map((actor) => (
                        <ActorCard key={actor._id} actor={actor} />
                    ))
                ) : (
                    <div className="text-white col-span-full text-center py-10 opacity-50">
                        Không tìm thấy diễn viên nào bắt đầu bằng "{alphabet}"
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex justify-center pt-6">
                    <DataPagination
                        page={pagination.page ?? 1}
                        totalPages={pagination.totalPages ?? 1}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </div>
    );
}

