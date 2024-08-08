/* eslint-disable @next/next/no-img-element */
import {
  callPokeDetailData,
  callPokeEvolutionData,
  getKoreanName,
} from '@/utils/getPokemonData';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styles from './index.module.css';

function Index() {
  const router = useRouter();
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [evolutionChainKo, setEvolutionChainKo] = useState([]);
  const [koData, setKoData] = useState([]);

  // 첫 번째 쿼리: 포켓몬 상세 데이터
  const { isLoading, data } = useQuery({
    queryKey: [
      'callPokeDetailData',
      `https://pokeapi.co/api/v2/pokemon/${router.query?.id}/`,
    ],
    queryFn: () =>
      callPokeDetailData(
        `https://pokeapi.co/api/v2/pokemon/${router.query?.id}/`,
      ),
  });

  const { data: evolutionData, isLoading: evolutionIsLoading } = useQuery({
    queryKey: ['callPokeEvolutionData', router.query.evolutionChainUrl],
    queryFn: () => callPokeEvolutionData(router.query.evolutionChainUrl),
    enabled: !!router.isReady && !!data,
  });

  // 진화단계 설정
  useEffect(() => {
    const extractEvolutionChain = chain => {
      const evolution = [];
      const traverseChain = (node, level) => {
        if (!node) return;
        evolution.push({ level, name: node?.species?.name });
        node?.evolves_to?.forEach(evolutionNode =>
          traverseChain(evolutionNode, level + 1),
        );
      };
      traverseChain(chain, 1);
      return evolution;
    };
    if (router.isReady) {
      const evolutionChain = extractEvolutionChain(evolutionData?.data?.chain);
      setEvolutionChain(evolutionChain);
    }
  }, [evolutionData, router.isReady]);

  // 진화단계 한글 이름 수정
  useEffect(() => {
    const fetchKoreanNames = async () => {
      const names = await Promise.all(
        evolutionChain.map(async item => {
          const response = await getKoreanName(
            `https://pokeapi.co/api/v2/pokemon-species/${item.name}`,
          );
          const detailData = await callPokeDetailData(
            response.data.varieties[0].pokemon.url,
          );
          const pokeImg =
            detailData.data.sprites?.other['official-artwork'].front_default ||
            detailData.data.sprites?.front_default;
          const koreanName = response.data.names.find(
            item => item.language.name === 'ko',
          ).name;
          return { ...item, koreanName, pokeImg };
        }),
      );

      setEvolutionChainKo(names);
    };

    // 이미지 호출 URL

    fetchKoreanNames();
  }, [evolutionChain]);

  // 타입 및 능력치 한글 이름
  useEffect(() => {
    const fetchKoreanNamaes = async () => {
      const { types = [], stats = [] } = data?.data || {};

      const typeNames = await Promise.all(
        types.map(async item => {
          const typeResponse = await getKoreanName(item.type.url);
          const koreanType = typeResponse.data.names.find(
            nameItem => nameItem.language.name === 'ko',
          ).name;
          return { ...item, koreanType };
        }),
      );

      const statNames = await Promise.all(
        stats.map(async item => {
          const statResponse = await getKoreanName(item.stat.url);
          const koreanStat = statResponse.data.names.find(
            nameItem => nameItem.language.name === 'ko',
          ).name;
          return { ...item, koreanStat };
        }),
      );

      setKoData({ types: typeNames, stats: statNames });
    };

    fetchKoreanNamaes();
  }, [data?.data]);

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>;
  }

  return (
    !isLoading &&
    !evolutionIsLoading && (
      <div
        className={styles.card_detail_wrapper}
        style={{ borderColor: router.query.color }}>
        {/* title */}
        <div className={styles.card_detail_title}>
          <h2>No. {router.query.id}</h2>
          <h1>{router.query.koName}</h1>
        </div>

        {/* image */}
        <div className={styles.card_detail_img}>
          <img
            className={styles.pokeImg}
            src={
              data?.data.sprites?.other['official-artwork'].front_default ||
              modifiedDetailData.sprites?.front_default
            }
            alt="image"
          />
        </div>

        {/* info */}
        <div className={styles.card_detail_info}>
          <h3 style={{ textAlign: 'center' }}>상세정보</h3>

          <div className={styles.card_detail_info_types_stats_wrapper}>
            <div
              className={styles.card_detail_info_types_wrapper}
              style={{ borderColor: router.query.color }}>
              <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>
                타입
              </h4>
              {koData?.types?.map((item, index) => (
                <span key={index} className={styles.card_detail_info_types}>
                  {item?.koreanType}
                </span>
              ))}
            </div>

            <div
              className={styles.card_detail_info_stats_wrapper}
              style={{ borderColor: router.query.color }}>
              <h4 style={{ marginBottom: '10px', textAlign: 'center' }}>
                능력치
              </h4>
              {koData?.stats?.map((item, index) => (
                <span key={index} className={styles.card_detail_info_stats}>
                  {item?.koreanStat} : {item?.base_stat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* evolution chain */}
        <div
          className={styles.card_detail_evolution_chain_wrapper}
          style={{ borderColor: router.query.color }}>
          <h3 style={{ marginBottom: '50px' }}>진화단계</h3>
          <div className={styles.card_detail_evolution_chain}>
            {evolutionChain?.map((item, index) => (
              <div key={index} className={styles.poke_evolution_chain_wrapper}>
                <img
                  className={styles.poke_evolution_chain_img}
                  src={evolutionChainKo[index]?.pokeImg}
                  alt="pokeImg"
                />
                <span className={styles.poke_evolution_chain_name}>
                  {evolutionChainKo[index]?.koreanName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default Index;
