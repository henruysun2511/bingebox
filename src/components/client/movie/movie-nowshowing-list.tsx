import MovieCardSkeleton from "@/components/common/skeleton/movie-card-skeleton";
import { MovieStatusEnum } from "@/constants/enum";
import { useMovieList } from "@/queries/useMovieQuery";
import MovieCard from "./movie-card";


export default function MovieNowShowingList() {
    const { data, isLoading } = useMovieList({
        limit: 20,
        status: MovieStatusEnum.NOW_SHOWING
    });

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
                    <MovieCard key={movie._id} movie={movie} status={MovieStatusEnum.NOW_SHOWING} />
                ))
            ) : (
                <div className="text-white">Không có phim</div>
            )}
        </div>
    );
}