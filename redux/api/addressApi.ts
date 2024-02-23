import _ from 'underscore';
import api from './api';

const API_KEY = 'U01TX0FVVEgyMDIwMDIyMDExMzYwNzEwOTQ4MjI=';

// const SAMPLE = `{"results":{"common":{"errorMessage":"정상","countPerPage":"10","totalCount":"513","errorCode":"0","currentPage":"1"},"juso":[{"detBdNmList":"","engAddr":"50, Bundang-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"분당로","emdNm":"수내동","zipNo":"13594","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 1","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 분당로 50","bdNm":"","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"1","roadAddr":"경기도 성남시 분당구 분당로 50 (수내동)","lnbrSlno":"0","buldMnnm":"50","bdKdcd":"0","liNm":"","rnMgtSn":"411353180026","mtYn":"0","bdMgtSn":"4113510200100010000019855","buldSlno":"0"},{"detBdNmList":"","engAddr":"50, Bundang-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"분당로","emdNm":"수내동","zipNo":"13594","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 1 분당구청","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 분당로 50","bdNm":"분당구청","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"1","roadAddr":"경기도 성남시 분당구 분당로 50 (수내동)","lnbrSlno":"0","buldMnnm":"50","bdKdcd":"0","liNm":"","rnMgtSn":"411353180026","mtYn":"0","bdMgtSn":"4113510200100010000028736","buldSlno":"0"},{"detBdNmList":"","engAddr":"262, Hwangsaeul-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"황새울로","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"01","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 4-1 성옥빌딩","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 황새울로 262","bdNm":"성옥빌딩","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"4","roadAddr":"경기도 성남시 분당구 황새울로 262 (수내동)","lnbrSlno":"1","buldMnnm":"262","bdKdcd":"0","liNm":"","rnMgtSn":"411353180053","mtYn":"0","bdMgtSn":"4113510200100040001037801","buldSlno":"0"},{"detBdNmList":"","engAddr":"38, Sunae-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"수내로","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 4-2 두산위브센티움1","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 수내로 38","bdNm":"두산위브센티움1","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"4","roadAddr":"경기도 성남시 분당구 수내로 38 (수내동)","lnbrSlno":"2","buldMnnm":"38","bdKdcd":"0","liNm":"","rnMgtSn":"411353180039","mtYn":"0","bdMgtSn":"4113510200100040002049107","buldSlno":"0"},{"detBdNmList":"","engAddr":"42, Sunae-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"수내로","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 4-3 두산위브센티움2","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 수내로 42","bdNm":"두산위브센티움2","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"4","roadAddr":"경기도 성남시 분당구 수내로 42 (수내동)","lnbrSlno":"3","buldMnnm":"42","bdKdcd":"0","liNm":"","rnMgtSn":"411353180039","mtYn":"0","bdMgtSn":"4113510200100040003004110","buldSlno":"0"},{"detBdNmList":"","engAddr":"4, Sunae-ro 46beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"수내로46번길","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"01","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 4-4 경동빌딩","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 수내로46번길 4","bdNm":"경동빌딩","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"4","roadAddr":"경기도 성남시 분당구 수내로46번길 4 (수내동)","lnbrSlno":"4","buldMnnm":"4","bdKdcd":"0","liNm":"","rnMgtSn":"411354340285","mtYn":"0","bdMgtSn":"4113510200100040004010863","buldSlno":"0"},{"detBdNmList":"","engAddr":"50, Sunae-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"수내로","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 5-1 수내동업무빌딩","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 수내로 50","bdNm":"수내동업무빌딩","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"5","roadAddr":"경기도 성남시 분당구 수내로 50 (수내동)","lnbrSlno":"1","buldMnnm":"50","bdKdcd":"0","liNm":"","rnMgtSn":"411353180039","mtYn":"0","bdMgtSn":"4113510200100050001013194","buldSlno":"0"},{"detBdNmList":"","engAddr":"54, Sunae-ro, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"수내로","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"02","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 5-2 삼성보보스쉐르빌","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 수내로 54","bdNm":"삼성보보스쉐르빌","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"5","roadAddr":"경기도 성남시 분당구 수내로 54 (수내동)","lnbrSlno":"2","buldMnnm":"54","bdKdcd":"0","liNm":"","rnMgtSn":"411353180039","mtYn":"0","bdMgtSn":"4113510200100050002004120","buldSlno":"0"},{"detBdNmList":"","engAddr":"19, Hwangsaeul-ro 258beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"황새울로258번길","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"01","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 6-1 한산이씨봉화공파종중회관","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 황새울로258번길 19","bdNm":"한산이씨봉화공파종중회관","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"6","roadAddr":"경기도 성남시 분당구 황새울로258번길 19 (수내동)","lnbrSlno":"1","buldMnnm":"19","bdKdcd":"0","liNm":"","rnMgtSn":"411354340466","mtYn":"0","bdMgtSn":"4113510200100060001001873","buldSlno":"0"},{"detBdNmList":"","engAddr":"23, Hwangsaeul-ro 258beon-gil, Bundang-gu, Seongnam-si, Gyeonggi-do","rn":"황새울로258번길","emdNm":"수내동","zipNo":"13595","roadAddrPart2":" (수내동)","emdNo":"01","sggNm":"성남시 분당구","jibunAddr":"경기도 성남시 분당구 수내동 6-2 그라테아","siNm":"경기도","roadAddrPart1":"경기도 성남시 분당구 황새울로258번길 23","bdNm":"그라테아","admCd":"4113510200","udrtYn":"0","lnbrMnnm":"6","roadAddr":"경기도 성남시 분당구 황새울로258번길 23 (수내동)","lnbrSlno":"2","buldMnnm":"23","bdKdcd":"0","liNm":"","rnMgtSn":"411354340466","mtYn":"0","bdMgtSn":"4113510200100060002031014","buldSlno":"0"}]}}`;

const re = /[%=><]/gi;

// sql 예약어
const keywords =
  /(^|\s*)(OR|SELECT|INSERT|DELETE|UPDATE|CREATE|DROP|EXEC|UNION|FETCH|DECLARE|TRUNCATE)($|\s*)/gi;

const toAddress = (resp) => {
  if (!_.isEmpty(resp.results)) {
    return api.success(resp.results.juso, [resp.results.common]);
  }

  return api.failure(api.FAILED);
};

const find = (key: string, page = 1) => {
  if (_.isEmpty(key))
    return api.reject(
      api.E_INVALID_ARGUMENT,
      undefined,
      'missing parameter: key',
    );

  const query = {
    currentPage: page,
    countPerPage: 10,
    keyword: key.replace(re, '').replace(keywords, ''),
    confmKey: API_KEY,
    resultType: 'json',
  };

  return api.callHttpGet(
    `${api.addrApiUrl()}?${api.queryString(query)}`,
    toAddress,
  );
};

export default {toAddress, find};
