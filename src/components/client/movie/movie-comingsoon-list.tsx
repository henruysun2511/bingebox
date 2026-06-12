import MovieCardSkeleton from "@/components/common/skeleton/movie-card-skeleton";
import { MovieStatusEnum } from "@/constants/enum";
import { useMovieList } from "@/queries/useMovieQuery";
import MovieCard from "./movie-card";

export default function MovieComingSoonList() {
    const { data, isLoading } = useMovieList({
        limit: 20,
        status: MovieStatusEnum.COMING_SOON
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <MovieCardSkeleton key={index} />
                ))}
            </div>
        );
    }


    const movies = data?.data || [];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.length > 0 ? (
                movies.map((movie) => (
                    <MovieCard key={movie._id} movie={movie} />
                ))
            ) : (
                <div className="text-white col-span-full">Đang cập nhật phim sắp chiếu</div>
            )}
        </div>
    );
}