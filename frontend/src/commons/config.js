// root 폴더에 있는 env 파일 안 REACT_APP_BASE_URL 설정을 불러오는 명령어.
// env_example 파일 작성 예정
export const BaseUrl = process.env.REACT_APP_BASE_URL;
if(!BaseUrl) throw new Error('REACT_APP_BASE_URL가 없음');