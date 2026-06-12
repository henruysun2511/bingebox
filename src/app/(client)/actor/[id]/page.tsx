"use client";
import MovieCard from "@/components/client/movie/movie-card";
import LoadingScreen from "@/components/common/loading/loading-screen";
import SectionTitle from "@/components/common/title/section-title";
import { useActorDetail, useActorMovies } from "@/queries/useActorQuery";
import { useParams } from "next/navigation";

export default function ActorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: actorData, isLoading: isActorLoading } = useActorDetail(id);
    const actor = actorData?.data;

    const { data: movieData, isLoading: isMovieLoading } = useActorMovies(id);
    const movies = movieData?.data || [];
    console.log(actor)

    if (isActorLoading) return <LoadingScreen />;
    if (!actor) return <div className="text-white p-10">Actor not found</div>;

    return (
        <>
            <div className="max-w-[1400px] mx-auto px-6 py-10 mt-16">
                <div className="flex flex-col lg:flex-row gap-5 items-start">

                    {/* LEFT CONTENT: Actor Info */}
                    <div className="w-full lg:w-[300px] shrink-0 bg-white/5 rounded-lg p-6">
                        <div className="sticky top-24">
                            {/* Avatar */}
                            <div className="aspect-square w-full mb-6 overflow-hidden rounded-xl border-2 border-blue-500/30">
                                <img
                                    src={actor.avatar || "/no-image.png"}
                                    alt={actor.name}
                                    className="w-full h-full object-cover shadow-2xl"
                                />
                            </div>

                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        {actor.name || "Đang cập nhật"}
                                    </h1>
                                    <p className="text-blue-400 font-medium text-sm">Diễn viên</p>
                                </div>

                                <div className="h-[1px] bg-white/10 w-full" />

                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Giới tính:</span>
                                        <span className="text-white font-medium">
                                            {actor.gender === "male" ? "Nam" : actor.gender === "female" ? "Nữ" : "Đang cập nhật"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Quốc tịch:</span>
                                        <span className="text-white font-medium">
                                            {actor.nationality || "Đang cập nhật"}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-white/10 w-full" />

                                {/* Bio */}
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Tiểu sử</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed text-justify">
                                        {actor.bio || "Thông tin tiểu sử đang được cập nhật..."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: Movie List */}
                    <div className="flex-1 w-full  rounded-2xl px-6 pb-6 ">
                        <SectionTitle title="Phim đã tham gia" />

                        {isMovieLoading ? (
                            <div className="text-white">Đang tải danh sách phim...</div>
                        ) : (
                            <div className="flex gap-6">
                                {movies.length > 0 ? (
                                    movies.map((movie) => (
                                        <MovieCard key={movie._id} movie={movie} />
                                    ))
                                ) : (
                                    <div className="col-span-full bg-white/5 rounded-xl p-10 text-center text-gray-500 border border-dashed border-white/10">
                                        Chưa có thông tin phim tham gia.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}