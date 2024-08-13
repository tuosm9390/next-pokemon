/* eslint-disable @next/next/no-img-element */
import { colorToRgba } from '@/utils/colorToRgba';
import { callPokeDetailData, getKoreanName } from '@/utils/getPokemonData';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styles from './Card.module.css';

function Card({ item }) {
  const router = useRouter();
  // 상태를 사용하여 수정된 detailData 저장
  const [modifiedDetailData, setModifiedDetailData] = useState([]);

  // 첫 번째 쿼리: 포켓몬 상세 데이터
  const {
    isLoading,
    isError,
    data: detailData,
    error,
  } = useQuery({
    queryKey: ['callPokeDetailData', item?.url],
    queryFn: () => callPokeDetailData(item?.url),
  });

  // 두 번째 쿼리: 한국어 이름 데이터
  const {
    isLoading: loading2,
    data: data2,
    error: error2,
  } = useQuery({
    queryKey: [
      'getKoreanName',
      `https://pokeapi.co/api/v2/pokemon-species/${item?.name}`,
    ],
    queryFn: () =>
      getKoreanName(`https://pokeapi.co/api/v2/pokemon-species/${item?.name}`),
    enabled: !!detailData, // detailData가 존재할 때만 실행
  });

  useEffect(() => {
    if (detailData && data2 && data2.data.names?.length > 2) {
      const koName =
        data2.data.names.find(name => name.language.name === 'ko')?.name ||
        data2.data.name;
      const color = data2.data.color.name;
      if (koName) {
        // detailData에 koName 추가
        const updatedDetailData = {
          ...detailData.data,
          koName,
          color,
        };
        setModifiedDetailData(updatedDetailData);
      }
    }
  }, [detailData, data2]);

  const onClick = data => {
    router.push({
      pathname: `/${modifiedDetailData.id}`,
      query: {
        url: item?.url,
        speciesUrl: `https://pokeapi.co/api/v2/pokemon-species/${modifiedDetailData.id}`,
        evolutionChainUrl: data2?.data?.evolution_chain?.url,
        koName: modifiedDetailData.koName,
        id: modifiedDetailData.id,
        color: colorToRgba(modifiedDetailData.color, 0.5),
      },
    });
  };

  return (
    !isLoading &&
    !loading2 && (
      <div
        className={styles.cardContainer}
        style={{ backgroundColor: colorToRgba(modifiedDetailData.color, 0.5) }}
        onClick={() => onClick(modifiedDetailData)}>
        <div className={styles.cardBox}>
          <div>
            <img
              className={styles.pokeImg}
              src={
                modifiedDetailData.sprites?.other['official-artwork']
                  .front_default || modifiedDetailData.sprites?.front_default
              }
              alt="image"
            />
          </div>
          <div>No. {modifiedDetailData.id}</div>
          <div>이름 : {modifiedDetailData.koName}</div>
        </div>
      </div>
    )
  );
}

export default Card;
