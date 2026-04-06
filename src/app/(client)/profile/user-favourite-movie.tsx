import MovieCardSkeleton from "@/components/common/skeleton/movie-card-skeleton";
import { useFavouriteMovies } from "@/queries/useMovieQuery";
import Link from "next/link";

export default function UserMovieFavouriteList() {
    const { data, isLoading } = useFavouriteMovies();

    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-6 justify-start">
                {Array.from({ length: 8 }).map((_, index) => (
                    <MovieCardSkeleton key={index} />
                ))}
            </div>
        );
    }


    const movies = data?.data || [];

    return (
        <div className="flex flex-wrap gap-6 justify-start">
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <div key={movie._id} className="w-[230px] group cursor-pointer">
                        {/* Poster */}
                        <div className="relative h-[320px] w-full overflow-hidden rounded-xl">
                            <img
                                src={movie.poster || "/no-image.png"}
                                alt={movie.name || "movie"}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                         
                        </div>

                        {/* Name */}
                        <Link href={`/movie/${movie._id}`}>
                            <h2 className="mt-3 text-white font-semibold text-lg line-clamp-2 hover:text-blue-400 transition">
                                {movie.name || "N/A"}
                            </h2>
                        </Link>

                        {/* Categories (object[]) */}
                        <p className="text-gray-400 text-sm mt-1">
                            Thể loại:{" "}
                            {movie.categories?.length
                                ? movie.categories.map((c) => c.name).join(", ")
                                : "N/A"}
                        </p>
                    </div >
                ))
            ) : (
                <div className="text-white">Chưa có phim yêu thích</div>
            )}
        </div>
    );
}