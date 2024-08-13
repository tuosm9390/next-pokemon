import axios from 'axios';

export const getKoreanName = async url => {
  const response = await axios.get(url);
  return response;
};

export const callPokeDetailData = async url => {
  const response = await axios.get(url);
  return response;
};

export const getAllPokemon = async ({ pageParam = 0, searchName }) => {
  const url =
    searchName == ''
      ? 'https://pokeapi.co/api/v2/pokemon'
      : `https://pokeapi.co/api/v2/pokemon/${searchName}`;

  const response = await axios.get(url, {
    params: {
      limit: 30,
      offset: pageParam,
    },
  });

  console.log(response.data);
  return response.data;
};

export const callPokeEvolutionData = async url => {
  const response = axios.get(url);
  return response;
};
