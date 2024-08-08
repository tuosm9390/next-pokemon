import axios from 'axios';

export const getKoreanName = async url => {
  const response = await axios.get(url);
  return response;
};

export const callPokeDetailData = async url => {
  const response = await axios.get(url);
  return response;
};

export const getAllPokemon = async ({ pageParam = 0 }) => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon', {
    params: {
      limit: 30,
      offset: pageParam,
    },
  });
  return response.data;
};

export const callPokeEvolutionData = async url => {
  const response = axios.get(url);
  return response;
};
