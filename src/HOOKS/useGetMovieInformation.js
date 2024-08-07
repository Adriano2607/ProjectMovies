import { useState, useCallback, useEffect } from "react";
import { GET_CREDITS_MOVIE, GET_DETAILS_MOVIE, GET_DETAILS_MOVIE_TRAILER } from "../ENDPOINTS/api.js";
import useFetch from "./useFetch.js";

const useGetMovieInformation  = () => {
  const { request, loading } = useFetch();
  const [diretorActor, setDiretorActor] = useState({ elenco: [], diretor: null });
  const [movieDetails, setMovieDetails] = useState([{}]);

 useEffect(() => {

  
 })
  
  const getDetails = useCallback(async ({ id }) => {

    if (!id) {
      console.warn("ID inválido fornecido para getDetails");
      return;
    }
    try {
      const { url, options } = GET_DETAILS_MOVIE(id);
      const { json } = await request(url, options);
      if (json) {
        await getCreditsMovie(id);
        setMovieDetails(json);
      }
    } catch (error) {
      console.error("Erro ao obter detalhes do filme:", error);
    }
  
    return null;

  }, []);
  
  const getCreditsMovie = useCallback(async (id) => {
    const { url, options } = GET_CREDITS_MOVIE(id);
    const { json } = await request(url, options);
    if (json) {
      const { cast, crew } = json;
      setDiretorActor({
        elenco: cast.slice(0, 8).filter(ac => ac.known_for_department === 'Acting'),
        diretor: crew.find(ac => ac.known_for_department === 'Directing') || null,
      });
    }
  }, [request]);
  
  const getMoviesVideos = useCallback(async (id) => {
    const { url, options } = GET_DETAILS_MOVIE_TRAILER(id);
    const { json } = await request(url, options);
    if (json && json.results) {
      const trailerFilme = getOfficialTrailer(json.results);
      if (trailerFilme) {
        window.open(trailerFilme, '_blank');
      } else {
        alert("Não Há Trailer Disponível");
      }
    }
  }, [request]);

  const getOfficialTrailer = useCallback((videos) => {
    if (videos && Array.isArray(videos) && videos.length > 0) {
      const officialTrailer = videos.find(
        video => video.name.toLowerCase().includes('trailer')
      );
      if (officialTrailer) {
        return `https://www.youtube.com/watch?v=${officialTrailer.key}`;
      }
    }
    return null;
  }, []);


  
  return {diretorActor, loading, getMoviesVideos, movieDetails,getDetails};
};

export default useGetMovieInformation ;
